const className = {
  p: "text-justify tracking-wide text-slate-800 text-wrap text-sm px-4 leading-relaxed",
  h3: "text-xl font-bold text-blue-900 leading-relaxed",
};
export const AboutSection = () => {
  return (
    <section
      id="about"
      className="mx-auto flex h-fit w-full max-w-[950px] flex-col items-center justify-center px-4 py-20 pt-80"
    >
      <h2 className="pb-[30px] text-3xl font-bold tracking-wide text-blue-700">
        About
      </h2>
      <div className="flex w-full flex-col items-start gap-5 px-4 text-slate-800">
        <p className="text-wrap text-justify text-sm leading-relaxed tracking-wide">
          Welcome to{" "}
          <strong className="animate-bounce text-xl text-blue-700">
            StudyNex
          </strong>
          , your go-to platform for improving your academic productivity.
        </p>
        <div>
          <h3 className={className.h3}>Our Mission</h3>
          <p className={className.p}>
            At StudyNex, our mission is to ..........................
          </p>
        </div>
      </div>
    </section>
  );
};
