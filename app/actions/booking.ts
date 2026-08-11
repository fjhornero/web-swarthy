"use server";

import {
  EMAIL_REGEX,
  FIELD_LIMITS,
  escapeHtml,
  sendTelegramMessage,
} from "@/lib/telegram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

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
  formato: string;
  mensaje: string;
  // Consentimiento RGPD: es la base legal del tratamiento, obligatorio
  consentimiento: boolean;
  // honeypot: los humanos no lo ven; si llega relleno es un bot
  web?: string;
};

export async function submitBooking(fields: BookingFields): Promise<BookingState> {
  if (fields.web) {
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

  const nombre = fields.nombre?.trim().slice(0, FIELD_LIMITS.short);
  const email = fields.email?.trim().slice(0, FIELD_LIMITS.email);
  const telefono = fields.telefono?.trim().slice(0, FIELD_LIMITS.short);
  const tipoEvento = fields.tipoEvento?.trim().slice(0, FIELD_LIMITS.short);
  const fecha = fields.fecha?.trim().slice(0, FIELD_LIMITS.short);
  const ciudad = fields.ciudad?.trim().slice(0, FIELD_LIMITS.short);
  const aforo = fields.aforo?.trim().slice(0, FIELD_LIMITS.short);
  const formato = fields.formato?.trim().slice(0, FIELD_LIMITS.short);
  const mensaje = fields.mensaje?.trim().slice(0, FIELD_LIMITS.message);

  if (!nombre || !email || !tipoEvento || !fecha || !ciudad || !formato) {
    return { success: false, error: "Completa todos los campos obligatorios." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "El email no tiene un formato válido." };
  }

  // Se revalida en servidor: la casilla del formulario es la base legal del
  // tratamiento y un envío programático podría saltársela.
  if (!fields.consentimiento) {
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
    ...(aforo ? [`👥 <b>Aforo:</b> ${escapeHtml(aforo)}`] : []),
    `🎧 <b>Formato:</b> ${escapeHtml(formato)}`,
    ...(mensaje ? [`💬 <b>Mensaje:</b> ${escapeHtml(mensaje)}`] : []),
    "",
    `📩 Responder a: ${escapeHtml(email)}`,
  ];

  return sendTelegramMessage(lines.join("\n"));
}
