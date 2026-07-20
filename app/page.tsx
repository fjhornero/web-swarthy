import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Mixes } from "@/components/sections/Mixes";
import { Formats } from "@/components/sections/Formats";
import { Venues } from "@/components/sections/Venues";
import { Socials } from "@/components/sections/Socials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";
import { getLatestYouTubeVideos, getLatestSoundCloudTracks } from "@/lib/feeds";

export default async function Home() {
  const [ytVideos, scTracks] = await Promise.all([
    getLatestYouTubeVideos(),
    getLatestSoundCloudTracks(),
  ]);

  const latestVideo = ytVideos.find((v) => !v.isShort);
  const latestTrack = scTracks[0];

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Stats />
        <About />
        <Mixes latestVideo={latestVideo} latestTrack={latestTrack} />
        <Formats />
        <Venues />
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
