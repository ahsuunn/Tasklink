import { AboutSection } from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";

const HomePage = () => {
  return (
    <div id="home" className="relative grow">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </div>
  );
};

export default HomePage;
