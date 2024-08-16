import { TypeAnimation } from "react-type-animation";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] min-h-[70vh] w-full pt-5">
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2 py-4">
          <h1 className="text-5xl font-bold tracking-wide text-blue-700">
            StudyNex
          </h1>
          <h2 className="text-blue-700">
            Your all-in-one student productivity tool.
          </h2>
        </div>
        <TypeAnimation
          sequence={[
            "Boost your productivity by a huge margin with StudyNex.",
            1000,
            "Difficulty tracking your progress?",
            1000,
            "Difficulty tracking your progress? Missing Deadlines?",
            1000,
            "Difficulty tracking your progress? Missing Deadlines? Need to make an academic comeback?",
            1000,
          ]}
          wrapper="h3"
          className="max-w-[70vw] text-center"
          speed={50}
          repeat={Infinity}
        />
      </div>
    </section>
  );
};

export default HeroSection;
