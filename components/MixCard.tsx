import Link from "next/link";
import { Music, Youtube } from "lucide-react";
import { MediaFacade } from "@/components/MediaFacade";
import { NewTabHint } from "@/components/NewTabHint";
import { MIX_STYLES, type MixCardData } from "@/lib/mixes";

/**
 * Reproductor de una mezcla detrás de su fachada: vídeo de YouTube o audio de
 * SoundCloud. El iframe no existe hasta el clic (ver MediaFacade). Los ids
 * llegan ya validados contra el formato de cada plataforma (lib/feeds.ts).
 */
export function MixPlayer({
  mix,
  compact,
  mini,
  sizes,
}: {
  mix: MixCardData;
  compact?: boolean;
  mini?: boolean;
  sizes?: string;
}) {
  return (
    <MediaFacade thumbnail={mix.thumbnail} title={mix.title} compact={compact} mini={mini} sizes={sizes}>
      {mix.kind === "video" ? (
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${mix.id}?rel=0&autoplay=1`}
            title={mix.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <iframe
          scrolling="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${mix.id}&color=%23e11d48&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
          className="w-full"
          style={{ height: compact ? 180 : 300 }}
          title={mix.title}
        />
      )}
    </MediaFacade>
  );
}

/**
 * Lo que un promotor mira antes de darle al play: si es vídeo o audio, cuánto
 * dura, de qué estilo es y de cuándo. Todo sale del feed; nada es editorial.
 */
export function MixMeta({ mix, className = "" }: { mix: MixCardData; className?: string }) {
  const Icon = mix.kind === "video" ? Youtube : Music;
  const style = mix.style === "otros" ? undefined : MIX_STYLES[mix.style];

  // Sin separadores entre los datos: en una tarjeta estrecha la línea parte y
  // un "·" al principio del renglón queda huérfano. El estilo va en píldora.
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary ${className}`}
    >
      <Icon size={13} className="shrink-0 text-accent-orange" aria-hidden="true" />
      <span className="sr-only">
        {mix.kind === "video" ? "Vídeo de YouTube." : "Audio de SoundCloud."}
      </span>
      {mix.duration && (
        <span className="font-semibold text-text-primary">{mix.duration}</span>
      )}
      {style && (
        <span className="rounded-full border border-border-dark px-2 py-0.5 text-[11px] leading-tight">
          {style}
        </span>
      )}
      {mix.date && <span>{mix.date}</span>}
    </p>
  );
}

/**
 * Tarjeta de una mezcla. En móvil es una fila compacta (miniatura a la
 * izquierda) para que una lista de sesiones no ocupe tres pantallas; al darle
 * al play, `has-[iframe]` la pasa a columna y el reproductor ocupa todo el
 * ancho. Desde `sm` es la tarjeta vertical de siempre.
 */
export function MixCard({ mix, className = "bg-dark-primary" }: { mix: MixCardData; className?: string }) {
  return (
    <article
      className={`group/mix flex h-full overflow-hidden rounded-2xl border border-border-dark has-[iframe]:flex-col sm:flex-col ${className}`}
    >
      <div className="w-[44%] shrink-0 self-center p-2.5 pr-0 group-has-[iframe]/mix:w-full group-has-[iframe]/mix:p-0 sm:w-full sm:self-auto sm:p-0">
        <div className="overflow-hidden rounded-xl group-has-[iframe]/mix:rounded-none sm:rounded-none">
          <MixPlayer
            mix={mix}
            compact
            mini
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-3 sm:justify-start sm:gap-2 sm:p-4">
        {/* El título enlaza a la sesión en su plataforma: quien prefiere oírla
            allí llega desde aquí, y los buscadores encuentran cada sesión
            enlazada por su nombre. El recorte a dos líneas va dentro del
            enlace y no en el párrafo: recortado desde fuera, el anillo de
            foco salía cortado. */}
        <p className="text-sm font-medium leading-snug">
          <Link
            href={mix.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-colors hover:text-accent-orange"
          >
            <span className="line-clamp-2">{mix.title}</span>
            <span className="sr-only">
              {mix.kind === "video" ? " en YouTube" : " en SoundCloud"}
            </span>
            <NewTabHint />
          </Link>
        </p>
        <MixMeta mix={mix} />
      </div>
    </article>
  );
}
