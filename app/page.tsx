import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Video } from "@/components/sections/Video";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";
import { Mixes } from "@/components/sections/Mixes";
import { Features } from "@/components/sections/Features";
import { HowTo } from "@/components/sections/HowTo";
import { Formats } from "@/components/sections/Formats";
import { Stats } from "@/components/sections/Stats";
import { Venues } from "@/components/sections/Venues";
import { Testimonials } from "@/components/sections/Testimonials";
import { Value } from "@/components/sections/Value";
import { Guarantee } from "@/components/sections/Guarantee";
import { PressKit } from "@/components/sections/PressKit";
import { Socials } from "@/components/sections/Socials";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Video />
        <About />
        <Journey />
        <Mixes />
        <Features />
        <HowTo />
        <Formats />
        <Stats />
        <Venues />
        <Testimonials />
        <Value />
        <Guarantee />
        <PressKit />
        <Socials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
