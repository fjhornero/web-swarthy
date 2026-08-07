"use server";

import {
  EMAIL_REGEX,
  FIELD_LIMITS,
  escapeHtml,
  sendTelegramMessage,
} from "@/lib/telegram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export type ContactState = { success: boolean; error?: string } | null;

export type ContactFields = {
  nombre: string;
  email: string;
  mensaje: string;
  // honeypot: los humanos no lo ven; si llega relleno es un bot
  web?: string;
};

export async function submitContact(fields: ContactFields): Promise<ContactState> {
  if (fields.web) {
    // Bot detectado: respondemos éxito sin enviar nada
    return { success: true };
  }

  const ip = await getClientIp();
  if (!checkRateLimit(`contact:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
    return {
      success: false,
      error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.",
    };
  }

  const nombre = fields.nombre?.trim().slice(0, FIELD_LIMITS.short);
  const email = fields.email?.trim().slice(0, FIELD_LIMITS.email);
  const mensaje = fields.mensaje?.trim().slice(0, FIELD_LIMITS.message);

  if (!nombre || !email || !mensaje) {
    return { success: false, error: "Completa todos los campos obligatorios." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "El email no tiene un formato válido." };
  }

  const lines = [
    "✉️ <b>NUEVO MENSAJE DE CONTACTO — DJ SWARTHY</b>",
    "",
    `👤 <b>Nombre:</b> ${escapeHtml(nombre)}`,
    `📧 <b>Email:</b> ${escapeHtml(email)}`,
    `💬 <b>Mensaje:</b> ${escapeHtml(mensaje)}`,
    "",
    `📩 Responder a: ${escapeHtml(email)}`,
  ];

  return sendTelegramMessage(lines.join("\n"));
}
