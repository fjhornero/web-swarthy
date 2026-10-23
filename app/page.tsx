import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Dates } from "@/components/sections/Dates";
import { Mixes } from "@/components/sections/Mixes";
import { Releases } from "@/components/sections/Releases";
import { Formats } from "@/components/sections/Formats";
import { Venues } from "@/components/sections/Venues";
import { Testimonials } from "@/components/sections/Testimonials";
import { Socials } from "@/components/sections/Socials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";
import { getLatestYouTubeVideos, getLatestSoundCloudTracks } from "@/lib/feeds";
import { getSpotifyReleases, getSpotifyArtistCard } from "@/lib/spotify";
import { upcomingDates } from "@/lib/dates";

// La home se prerrenderiza y se regenera como mucho cada hora: los feeds ya
// llevan `revalidate: 3600` en sus fetch, pero fijarlo aquí deja el
// comportamiento explícito y a salvo de que algún fetch futuro la vuelva
// dinámica por accidente.
export const revalidate = 3600;

export default async function Home() {
  // allSettled como red de seguridad: cada fetcher ya captura sus errores,
  // pero una excepción imprevista en uno de ellos no debe tumbar la home.
  const [ytVideos, scTracks, spotifyReleases, spotifyArtist] = await Promise.allSettled([
    getLatestYouTubeVideos(),
    getLatestSoundCloudTracks(),
    getSpotifyReleases(),
    getSpotifyArtistCard(),
  ]).then(([yt, sc, releases, artist]) => [
    yt.status === "fulfilled" ? yt.value : [],
    sc.status === "fulfilled" ? sc.value : [],
    releases.status === "fulfilled" ? releases.value : [],
    artist.status === "fulfilled" ? artist.value : null,
  ] as const);

  // El filtrado por fecha se hace aquí (servidor) con la zona horaria de la
  // agenda; el componente sólo pinta lo que recibe.
  const dates = upcomingDates();

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Orden del embudo del promotor: escuchar y ver dónde ha pinchado,
            entender qué compra, resolver dudas y pedir fecha. El formulario
            genérico va detrás del de booking para que nadie lo use para
            contratar (no recoge fecha ni ciudad). */}
        <Hero />
        <Stats />
        <Dates dates={dates} />
        <Venues />
        <Mixes videos={ytVideos} tracks={scTracks} />
        <Formats />
        <About />
        <Releases releases={spotifyReleases} artist={spotifyArtist} />
        <Testimonials />
        <Faq />
        <FinalCta />
        <Contact />
        <Socials />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
