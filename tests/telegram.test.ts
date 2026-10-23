import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanField,
  cleanLine,
  escapeHtml,
  sendTelegramMessage,
  truncateHtml,
} from "@/lib/telegram";

describe("escapeHtml", () => {
  it("escapa lo que interpreta el parse_mode HTML de Telegram", () => {
    expect(escapeHtml('<b>a & b</b>')).toBe("&lt;b&gt;a &amp; b&lt;/b&gt;");
  });
});

describe("cleanField / cleanLine", () => {
  it("convierte en cadena vacía cualquier cosa que no sea string", () => {
    expect(cleanField(123, 10)).toBe("");
    expect(cleanField(null, 10)).toBe("");
    expect(cleanField({ a: 1 }, 10)).toBe("");
    expect(cleanField(["x"], 10)).toBe("");
  });

  it("recorta y limita la longitud", () => {
    expect(cleanField("  hola  ", 3)).toBe("hol");
  });

  it("cleanLine aplana saltos de línea y espacios repetidos", () => {
    expect(cleanLine("Juan\nResponder a: otro@x.com\t\tfin", 100)).toBe(
      "Juan Responder a: otro@x.com fin"
    );
  });
});

describe("truncateHtml", () => {
  it("no toca mensajes dentro del límite", () => {
    expect(truncateHtml("<b>hola</b>", 50)).toBe("<b>hola</b>");
  });

  it("no parte una entidad HTML por la mitad", () => {
    const html = "a".repeat(10) + "&amp;" + "b".repeat(10);
    const out = truncateHtml(html, 14);
    expect(out).toBe("a".repeat(10) + "…");
    expect(out.length).toBeLessThanOrEqual(14);
  });

  it("cierra un <b> que quedase abierto", () => {
    const html = "<b>" + "x".repeat(50) + "</b>";
    const out = truncateHtml(html, 20);
    expect(out.endsWith("</b>…")).toBe(true);
    expect((out.match(/<b>/g) ?? []).length).toBe((out.match(/<\/b>/g) ?? []).length);
  });
});

describe("sendTelegramMessage", () => {
  const fetchMock = vi.fn();
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    process.env.TELEGRAM_BOT_TOKEN = "123456:SECRET-TOKEN";
    process.env.TELEGRAM_CHAT_ID = "42";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    errorSpy.mockRestore();
  });

  it("falla con error genérico si faltan las variables de entorno", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    const res = await sendTelegramMessage("hola");
    expect(res.success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("envía con parse_mode HTML, timeout y devuelve éxito", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const res = await sendTelegramMessage("<b>hola</b>");
    expect(res).toEqual({ success: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/bot123456:SECRET-TOKEN/sendMessage");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(init.body)).toMatchObject({ chat_id: "42", parse_mode: "HTML", text: "<b>hola</b>" });
  });

  it("no registra el cuerpo del error ni el token", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400, text: async () => "bad bot123456:SECRET-TOKEN" });
    const res = await sendTelegramMessage("x");
    expect(res.success).toBe(false);
    const logged = errorSpy.mock.calls.flat().join(" ");
    expect(logged).toContain("400");
    expect(logged).not.toContain("SECRET-TOKEN");
  });

  it("redacta el token si aparece en un error de red", async () => {
    fetchMock.mockRejectedValue(new Error("connect failed https://api.telegram.org/bot123456:SECRET-TOKEN/sendMessage"));
    const res = await sendTelegramMessage("x");
    expect(res.success).toBe(false);
    const logged = errorSpy.mock.calls.flat().join(" ");
    expect(logged).not.toContain("SECRET-TOKEN");
    expect(logged).toContain("***");
  });
});
