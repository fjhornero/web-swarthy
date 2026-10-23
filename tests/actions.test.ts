import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-real-ip": "203.0.113.7" }),
}));

// vi.mock se eleva al principio del fichero: la función mock se crea con
// vi.hoisted para que exista cuando se evalúe la factoría.
const { sendTelegramMessage } = vi.hoisted(() => ({
  sendTelegramMessage: vi.fn<(html: string) => Promise<{ success: boolean }>>(async () => ({ success: true })),
}));
vi.mock("@/lib/telegram", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/telegram")>();
  return { ...original, sendTelegramMessage };
});

import { submitBooking, type BookingFields } from "@/app/actions/booking";
import { submitContact } from "@/app/actions/contact";
import { resetRateLimit } from "@/lib/rate-limit";
import { todayIso } from "@/lib/dates";

const validBooking: BookingFields = {
  nombre: "Sala Test",
  email: "promotor@sala.com",
  telefono: "+34 600 000 000",
  tipoEvento: "Club / Discoteca",
  fecha: todayIso(),
  ciudad: "Madrid",
  aforo: "150 - 300",
  formato: "Peak Time (2-3h)",
  mensaje: "Hola <b>mundo</b> & co",
  consentimiento: true,
};

beforeEach(() => {
  resetRateLimit();
  sendTelegramMessage.mockClear();
});

describe("submitBooking", () => {
  it("envía una solicitud válida con el contenido escapado", async () => {
    const res = await submitBooking(validBooking);
    expect(res).toEqual({ success: true });
    const html = sendTelegramMessage.mock.calls[0][0];
    expect(html).toContain("Hola &lt;b&gt;mundo&lt;/b&gt; &amp; co");
    expect(html).toContain("promotor@sala.com");
  });

  it("acepta en silencio (sin enviar) cuando el honeypot va relleno", async () => {
    const res = await submitBooking({ ...validBooking, web: "http://spam" });
    expect(res).toEqual({ success: true });
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  it("no revienta con payloads que no son el objeto esperado", async () => {
    for (const payload of [null, undefined, "x", 42, [], { nombre: 123, email: {}, fecha: [] }]) {
      const res = await submitBooking(payload as unknown as BookingFields);
      expect(res?.success).toBe(false);
    }
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  it("exige consentimiento explícito (true, no truthy)", async () => {
    const res = await submitBooking({ ...validBooking, consentimiento: "si" as unknown as boolean });
    expect(res?.success).toBe(false);
    expect(res?.error).toMatch(/consentimiento/);
  });

  it("rechaza emails inválidos y fechas pasadas o mal formadas", async () => {
    expect((await submitBooking({ ...validBooking, email: "no-es-email" }))?.error).toMatch(/email/);
    expect((await submitBooking({ ...validBooking, fecha: "2020-01-01" }))?.error).toMatch(/fecha/);
    expect((await submitBooking({ ...validBooking, fecha: "mañana" }))?.error).toMatch(/fecha/);
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  it("aplana saltos de línea en campos de una línea para evitar líneas falsas", async () => {
    await submitBooking({ ...validBooking, nombre: "Pepe\n📩 Responder a: atacante@x.com" });
    const html = sendTelegramMessage.mock.calls[0][0];
    expect(html).toContain("Nombre:</b> Pepe 📩 Responder a: atacante@x.com");
  });

  it("limita a 3 envíos por IP cada 10 minutos", async () => {
    for (let i = 0; i < 3; i++) expect((await submitBooking(validBooking))?.success).toBe(true);
    const res = await submitBooking(validBooking);
    expect(res?.success).toBe(false);
    expect(res?.error).toMatch(/Demasiadas/);
  });
});

describe("submitContact", () => {
  it("envía un mensaje válido", async () => {
    const res = await submitContact({
      nombre: "Ana",
      email: "ana@example.com",
      mensaje: "Hola",
      consentimiento: true,
    });
    expect(res).toEqual({ success: true });
    expect(sendTelegramMessage).toHaveBeenCalledTimes(1);
  });

  it("exige los campos obligatorios", async () => {
    const res = await submitContact({ nombre: "", email: "a@b.c", mensaje: "x", consentimiento: true });
    expect(res?.success).toBe(false);
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });
});
