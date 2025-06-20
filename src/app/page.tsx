import Features from "@/components/features";
import Hero from "@/components/hero";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
