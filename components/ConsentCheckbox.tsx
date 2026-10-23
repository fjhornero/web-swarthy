import Link from "next/link";
import { NewTabHint } from "@/components/NewTabHint";

/**
 * Casilla de consentimiento RGPD. Es la base legal del tratamiento, así que
 * va sin marcar por defecto (el consentimiento tácito no vale) y además se
 * revalida en la server action.
 */
export function ConsentCheckbox({ id }: { id: string }) {
  return (
    <label
      htmlFor={id}
      className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-text-secondary"
    >
      <input
        id={id}
        name="consentimiento"
        type="checkbox"
        required
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent-red"
      />
      <span>
        He leído y acepto la{" "}
        {/* Nueva pestaña a propósito: así no se pierde lo escrito en el formulario. */}
        <Link
          href="/privacidad"
          target="_blank"
          rel="noopener"
          className="text-accent-orange hover:underline"
        >
          política de privacidad
          <NewTabHint />
        </Link>
        . Mis datos se usarán únicamente para responder a esta solicitud.
      </span>
    </label>
  );
}
