// Datos públicos del artista en Spotify.
//
// Dos vías, en orden de preferencia:
//
// 1. Web API oficial (Client Credentials). Devuelve la discografía completa
//    —álbumes, EPs y singles— con carátula y fecha. Necesita las variables
//    SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET; sin ellas se salta.
// 2. oEmbed público (sin credenciales). No lista los lanzamientos, pero da
//    nombre y foto del artista para pintar el reproductor de perfil, que ya
//    muestra las canciones más escuchadas.
//
// Como en lib/feeds.ts, cualquier fallo devuelve null/[] y la sección degrada
// en lugar de romper el render.

import { site } from "./data";

// El id vive en lib/data.ts (fuente única de contenido); aquí sólo se usa.
const ARTIST_ID = site.spotifyArtistId;
const ARTIST_URL = `https://open.spotify.com/artist/${ARTIST_ID}`;

export interface SpotifyRelease {
  id: string;
  name: string;
  /** "album" | "single" | "compilation" — se muestra como etiqueta */
  type: string;
  url: string;
  /** Carátula (~640px). Ausente si el álbum no tiene imagen publicada */
  artwork?: string;
  /** Formato variable: "2024", "2024-05" o "2024-05-17" (releaseDatePrecision) */
  releaseDate: string;
  totalTracks: number;
}

export interface SpotifyArtistCard {
  name: string;
  image?: string;
}

let tokenCache: { value: string; expiresAt: number } | null = null;

/**
 * Client Credentials flow. El token dura una hora; lo guardamos en memoria del
 * módulo porque `fetch` con POST no entra en el Data Cache de Next y pedir uno
 * nuevo en cada render del build sería gratuito pero innecesario.
 */
async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.value;

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;

    tokenCache = {
      value: json.access_token,
      // 60 s de margen para no usar un token que caduque a mitad de petición
      expiresAt: Date.now() + ((json.expires_in ?? 3600) - 60) * 1000,
    };
    return tokenCache.value;
  } catch {
    return null;
  }
}

interface SpotifyAlbumApi {
  id: string;
  name: string;
  album_group?: string;
  album_type: string;
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
  images: Array<{ url: string; width: number; height: number }>;
}

export async function getSpotifyReleases(limit = 12): Promise<SpotifyRelease[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums` +
        `?include_groups=album,single&market=ES&limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];

    const json = (await res.json()) as { items?: SpotifyAlbumApi[] };
    const items = json.items ?? [];

    // Spotify devuelve un item por mercado/reedición, así que el mismo título
    // puede aparecer varias veces. Nos quedamos con la primera aparición.
    const seen = new Set<string>();
    const releases: SpotifyRelease[] = [];

    for (const album of items) {
      const key = album.name.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      releases.push({
        id: album.id,
        name: album.name,
        type: album.album_group ?? album.album_type,
        url: album.external_urls?.spotify ?? `https://open.spotify.com/album/${album.id}`,
        artwork: album.images?.[0]?.url,
        releaseDate: album.release_date ?? "",
        totalTracks: album.total_tracks ?? 0,
      });
    }

    releases.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    return releases.slice(0, limit);
  } catch {
    return [];
  }
}

/** Nombre y foto del artista vía oEmbed público (no requiere credenciales). */
export async function getSpotifyArtistCard(): Promise<SpotifyArtistCard | null> {
  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(ARTIST_URL)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const json = (await res.json()) as { title?: string; thumbnail_url?: string };
    if (!json.title) return null;

    return { name: json.title, image: json.thumbnail_url };
  } catch {
    return null;
  }
}
