import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Programs from "@/components/sections/Programs";
import Testimonials from "@/components/sections/Testimonials";
import Resources from "@/components/sections/Resources";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Programs />
        <Testimonials />
        <Resources />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
