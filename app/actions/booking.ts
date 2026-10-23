"use server";

import {
  EMAIL_REGEX,
  FIELD_LIMITS,
  cleanField,
  cleanLine,
  escapeHtml,
  sendTelegramMessage,
} from "@/lib/telegram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isIsoDay, todayIso } from "@/lib/dates";

const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export type BookingState = { success: boolean; error?: string } | null;

export type BookingFields = {
  nombre: string;
  email: string;
  telefono?: string;
  tipoEvento: string;
  fecha: string;
  ciudad: string;
  aforo?: string;
  /** Sala o nombre del evento */
  sala?: string;
  /** Warm-up, peak, cierre… */
  franja?: string;
  /** Texto libre: los tramos de cachet aún no están fijados */
  presupuesto?: string;
  /** Opcional: un cliente de boda no tiene por qué conocer los formatos de club */
  formato?: string;
  mensaje: string;
  // Consentimiento RGPD: es la base legal del tratamiento, obligatorio
  consentimiento: boolean;
  // honeypot: los humanos no lo ven; si llega relleno es un bot
  web?: string;
};

export async function submitBooking(fields: BookingFields): Promise<BookingState> {
  // Endpoint público: el payload puede no ser el objeto que declara el tipo.
  if (!fields || typeof fields !== "object") {
    return { success: false, error: "Solicitud no válida." };
  }

  if (typeof fields.web === "string" && fields.web) {
    // Bot detectado: respondemos éxito sin enviar nada
    return { success: true };
  }

  const ip = await getClientIp();
  if (!checkRateLimit(`booking:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
    return {
      success: false,
      error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.",
    };
  }

  const nombre = cleanLine(fields.nombre, FIELD_LIMITS.short);
  const email = cleanLine(fields.email, FIELD_LIMITS.email);
  const telefono = cleanLine(fields.telefono, FIELD_LIMITS.short);
  const tipoEvento = cleanLine(fields.tipoEvento, FIELD_LIMITS.short);
  const fecha = cleanLine(fields.fecha, FIELD_LIMITS.short);
  const ciudad = cleanLine(fields.ciudad, FIELD_LIMITS.short);
  const aforo = cleanLine(fields.aforo, FIELD_LIMITS.short);
  const sala = cleanLine(fields.sala, FIELD_LIMITS.short);
  const franja = cleanLine(fields.franja, FIELD_LIMITS.short);
  const presupuesto = cleanLine(fields.presupuesto, FIELD_LIMITS.short);
  const formato = cleanLine(fields.formato, FIELD_LIMITS.short);
  const mensaje = cleanField(fields.mensaje, FIELD_LIMITS.message);

  if (!nombre || !email || !tipoEvento || !fecha || !ciudad) {
    return { success: false, error: "Completa todos los campos obligatorios." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "El email no tiene un formato válido." };
  }

  // El <input type="date"> ya limita en cliente, pero un envío programático
  // podría mandar cualquier cosa: se exige un día ISO real y no pasado.
  if (!isIsoDay(fecha) || fecha < todayIso()) {
    return { success: false, error: "La fecha del evento no es válida." };
  }

  // Se revalida en servidor: la casilla del formulario es la base legal del
  // tratamiento y un envío programático podría saltársela.
  if (fields.consentimiento !== true) {
    return {
      success: false,
      error: "Necesitamos tu consentimiento para tratar los datos del formulario.",
    };
  }

  const lines = [
    "🎵 <b>NUEVO BOOKING — DJ SWARTHY</b>",
    "",
    `👤 <b>Nombre:</b> ${escapeHtml(nombre)}`,
    `📧 <b>Email:</b> ${escapeHtml(email)}`,
    ...(telefono ? [`📱 <b>Teléfono:</b> ${escapeHtml(telefono)}`] : []),
    `🎪 <b>Tipo:</b> ${escapeHtml(tipoEvento)}`,
    `📅 <b>Fecha:</b> ${escapeHtml(fecha)}`,
    `📍 <b>Ciudad:</b> ${escapeHtml(ciudad)}`,
    ...(sala ? [`🏛 <b>Sala / evento:</b> ${escapeHtml(sala)}`] : []),
    ...(franja ? [`🕐 <b>Franja:</b> ${escapeHtml(franja)}`] : []),
    ...(aforo ? [`👥 <b>Aforo:</b> ${escapeHtml(aforo)}`] : []),
    `🎧 <b>Formato:</b> ${escapeHtml(formato || "Sin preferencia")}`,
    ...(presupuesto ? [`💶 <b>Presupuesto:</b> ${escapeHtml(presupuesto)}`] : []),
    ...(mensaje ? [`💬 <b>Mensaje:</b> ${escapeHtml(mensaje)}`] : []),
    "",
    `📩 Responder a: ${escapeHtml(email)}`,
  ];

  return sendTelegramMessage(lines.join("\n"));
}
