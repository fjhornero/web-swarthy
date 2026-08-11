import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Dates } from "@/components/sections/Dates";
import { Mixes } from "@/components/sections/Mixes";
import { Formats } from "@/components/sections/Formats";
import { Venues } from "@/components/sections/Venues";
import { Testimonials } from "@/components/sections/Testimonials";
import { Socials } from "@/components/sections/Socials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";
import { getLatestYouTubeVideos, getLatestSoundCloudTracks } from "@/lib/feeds";
import { upcomingDates } from "@/lib/dates";

export default async function Home() {
  const [ytVideos, scTracks] = await Promise.all([
    getLatestYouTubeVideos(),
    getLatestSoundCloudTracks(),
  ]);

  // El filtrado por fecha se hace aquí (servidor) y no dentro del componente
  // cliente: si cliente y servidor cayesen en días distintos, la lista diferiría
  // y React marcaría un error de hidratación.
  const dates = upcomingDates();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Stats />
        <About />
        <Dates dates={dates} />
        <Mixes videos={ytVideos} tracks={scTracks} />
        <Formats />
        <Venues />
        <Testimonials />
        <Socials />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
