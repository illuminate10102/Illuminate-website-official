import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/home/Hero";
import Catalog from "../components/home/Catalog";
import WhyIlluminate from "../components/home/WhyIlluminate";
import FinalCta from "../components/home/FinalCta";
import Contact from "../components/home/Contact";
import { seoTags } from "../lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "Illuminate — Free college & academic guidance for K–12 students";
  const description =
    "Illuminate is a student-led nonprofit helping K–12 students navigate academics, extracurriculars, testing, and college prep — completely free.";
  return [
    { title },
    { name: "description", content: description },
    ...seoTags({ title, description, path: "/" }),
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Catalog />
        <WhyIlluminate />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
