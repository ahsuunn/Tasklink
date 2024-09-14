import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import useFetch from "../../lib/CustomHooks/useFetch";
import { useNavigate } from "react-router-dom";
import { ITask } from "../../lib/types/Task";
import { FaTrashAlt } from "react-icons/fa";

const HeroSection = () => {
  const {
    response: tasks,
    error,
    loading,
  } = useFetch<ITask[]>({
    url: "/task/mine",
  });

  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handlePlusClick = () => {
    navigate("/profile/create-task");
  };

  const handleClickDelete = (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing
    navigate(`/delete-project/${taskId}`);
  };

  const handleThreeDotsClick = (index: number) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleArticleClick = (taskId: string) => {
    navigate(`/view-project/${taskId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateDaysLeft = (deadlineDate: string) => {
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const difference = deadline.getTime() - now.getTime();
    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const nearestProjects = tasks
    ? tasks
        .sort(
          (a, b) =>
            new Date(a.deadlinedate).getTime() -
            new Date(b.deadlinedate).getTime(),
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownVisible !== null &&
        dropdownRefs.current[dropdownVisible] &&
        !dropdownRefs.current[dropdownVisible]!.contains(event.target as Node)
      ) {
        setDropdownVisible(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <section className="relative h-fit min-h-fit w-full grow pb-20">
      <div className="relative mx-auto flex h-full min-h-fit w-[90%] grow flex-col items-center justify-between gap-2 px-4 md:flex-row">
        <div className="flex h-fit w-full flex-col rounded-lg border bg-[#7fa1c3] pb-7 shadow-lg md:w-[60%]">
          <div className="flex flex-row justify-between gap-2 px-4 py-2">
            <div className="font-sans text-base">Projects</div>
            <div className="flex w-[80%] flex-row items-center gap-2 rounded-lg bg-white px-2 shadow-lg">
              <IoIosSearch size={15} />
              <div className="text-xs">Find Project</div>
            </div>
            <FaPlus
              size={24}
              onClick={handlePlusClick}
              className="cursor-pointer"
            />
          </div>
          <section className="mt-8 grid gap-4 px-8 py-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {tasks &&
              tasks.map((task, idx) => {
                const completedSteps = task.steps.filter(
                  (step) => step.category === "Completed",
                ).length;
                const totalSteps = task.steps.length;
                const progressPercentage =
                  totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                const daysLeft = calculateDaysLeft(String(task.deadlinedate));

                return (
                  <article
                    key={idx}
                    className="relative mx-auto flex w-[100%] cursor-pointer flex-col items-center gap-2 rounded-lg bg-white" // Add cursor-pointer class here
                    onClick={() => handleArticleClick(task._id)} // Add onClick event
                  >
                    <div
                      className="flex h-fit w-full flex-row justify-between p-2"
                      style={{ backgroundColor: task.color }}
                    >
                      <div className="text-sm">
                        {formatDate(String(task.deadlinedate))}
                      </div>
                      <div className="relative cursor-pointer">
                        <BsThreeDots
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent event bubbling
                            handleThreeDotsClick(idx);
                          }}
                        />
                        {dropdownVisible === idx && (
                          <div
                            ref={(el) => (dropdownRefs.current[idx] = el)}
                            className="absolute right-0 mt-2 flex w-[150px] flex-col items-start rounded-md bg-black text-white shadow-lg"
                          >
                            <button
                              onClick={(event) =>
                                handleClickDelete(task._id, event)
                              }
                              className="flex items-center px-4 py-2 text-left text-xs hover:bg-gray-800 focus:outline-none"
                            >
                              <FaTrashAlt className="mr-2" />
                              Delete Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center px-2 pb-4">
                      <p className="text-dark block px-2 text-base text-black">
                        {task.primarytitle}
                      </p>
                      <p className="text-dark block px-2 text-sm text-black">
                        {task.secondarytitle}
                      </p>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: task.color,
                          }}
                        ></div>
                      </div>
                      <div className="mx-auto mt-2 flex w-full justify-between py-1">
                        <div
                          className="h-fit w-fit rounded-xl p-1 text-sm"
                          style={{ backgroundColor: task.color }}
                        >
                          {daysLeft} Days Left
                        </div>
                        <p className="mt-2 text-sm text-black">
                          {Math.round(progressPercentage)}%
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
          </section>
        </div>
        <div className="flex h-60 w-full flex-col items-center gap-2 rounded-lg border bg-white px-3 py-2 md:w-[40%]">
          <div>Nearest Projects</div>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {nearestProjects.map((task, idx) => (
            <article
              key={idx}
              className="mx-auto flex w-[100%] cursor-pointer flex-row items-center justify-between gap-2 rounded-lg border border-black bg-white px-2 py-1 shadow-lg" // Add cursor-pointer class here
              onClick={() => handleArticleClick(task._id)} // Add onClick event
            >
              <div
                className="h-[90%] w-1"
                style={{ backgroundColor: task.color }}
              ></div>
              <div className="flex flex-col">
                <div>{task.primarytitle}</div>
                <div>{task.secondarytitle}</div>
              </div>
              <div>{formatDate(String(task.deadlinedate))}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
