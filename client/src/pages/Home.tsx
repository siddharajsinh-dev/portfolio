import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: content } = useQuery({
    queryKey: ["/api/content"],
    staleTime: 30_000,
  });

  useEffect(() => {
    document.title = (content as any)?.site?.pageTitle ?? "Siddharajsinh Chauhan - Web Developer";
  }, [content]);

  const c = content as any;
  const isLoaded = !!c;
  const sections = c?.sections ?? null;

  function sectionHasContent(key: string): boolean {
    if (!isLoaded) return true;
    switch (key) {
      case "hero":         return !!(c?.hero?.name);
      case "about":        return !!(c?.about?.paragraphs?.length);
      case "skills":       return !!(c?.skills?.items?.length || c?.skills?.coreStack?.length || c?.skills?.frontend?.length);
      case "experience":   return !!(c?.experience?.length);
      case "projects":     return !!(c?.projects?.length);
      case "testimonials": return !!(c?.testimonials?.length);
      case "contact":      return !!(c?.contact?.email);
      default:             return true;
    }
  }

  const show = (key: string) =>
    (sections === null || sections[key] !== false) && sectionHasContent(key);

  return (
    <div className="min-h-screen">
<Header content={content} />
      <main>
        {show("hero") && <HeroSection content={content} />}
        {show("about") && <AboutSection content={content} />}
        {show("skills") && <SkillsSection content={content} />}
        {show("experience") && <ExperienceSection content={content} />}
        {show("projects") && <ProjectsSection content={content} />}
        {show("testimonials") && <TestimonialsSection content={content} />}
        {show("contact") && <ContactSection content={content} />}
      </main>
      <Footer content={content} />
    </div>
  );
};

export default Home;
