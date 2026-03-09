import HeroSection from "../components/HeroSection";
import ProjectsPreview from "../components/ProjectsPreview";
import DatasetsPreview from "../components/DatasetsPreview"; // Renamed inside the component to PublicationsPreview

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Projects Preview */}
      <ProjectsPreview />

      {/* Publications Preview (formerly Datasets Preview) */}
      <DatasetsPreview />
    </div>
  );
}
