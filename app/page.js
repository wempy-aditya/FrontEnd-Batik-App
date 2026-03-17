import HeroSection from "../components/HeroSection";
import ProjectsPreview from "../components/ProjectsPreview";
import DatasetsPreview from "../components/DatasetsPreview";
import ResearchSection from "../components/ResearchSection";
import GalleryCarousel from "../components/GalleryCarousel";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Products Preview */}
      <ProjectsPreview />

      {/* Datasets / Publications Preview */}
      <DatasetsPreview />

      {/* Research Publications */}
      <ResearchSection />

      {/* Gallery Showcase */}
      <GalleryCarousel />
    </div>
  );
}
