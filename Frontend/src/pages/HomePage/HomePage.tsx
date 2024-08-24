import HeroSection from "./HeroSection";

const HomePage = () => {
  return (
    <div id="home" className="relative flex min-h-fit grow flex-col">
      <div className="relative w-full pb-20"></div>
      <HeroSection />
    </div>
  );
};

export default HomePage;
