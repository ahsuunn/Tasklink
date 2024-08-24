import { NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useFetch from "../../lib/CustomHooks/useFetch";
import { ITask } from "../../lib/types/Task";
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import CustomAxios from "../../lib/actions/CustomAxios";
import Swal from "sweetalert2";
import { useState } from "react";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  return `${day}/${month}/${year}`;
};

const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) {
    return "00:00";
  }

  const [hours, minutes] = timeString.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const ViewStepsPage = () => {
  const { taskId } = useParams();
  const { response: userProject, refetch } = useFetch<ITask>({
    url: `/task/${taskId}`,
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateCategory = async (stepId: string, newCategory: string) => {
    setLoading(true);
    try {
      const stepToUpdate = userProject?.steps.find(
        (step) => step._id === stepId,
      );

      if (!stepToUpdate) {
        throw new Error("Step not found");
      }

      const payload = {
        ...stepToUpdate,
        category: newCategory,
      };

      await CustomAxios("put", `/task/${taskId}/steps/${stepId}`, payload);

      await Swal.fire({
        icon: "success",
        title: "Step updated!",
        text: `The step has been moved to ${newCategory}.`,
        confirmButtonText: "OK",
      });

      refetch();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error updating the step. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const todoSteps =
    userProject?.steps.filter((step) => step.category === "To-Do") || [];
  const inProgressSteps =
    userProject?.steps.filter((step) => step.category === "In-Progress") || [];
  const completedSteps =
    userProject?.steps.filter((step) => step.category === "Completed") || [];

  return (
    <div className="relative flex min-h-fit grow flex-col">
      <div className="relative w-full pb-2"></div>

      <div className="relative h-fit min-h-fit w-full grow pb-20 pt-20">
        <div className="flex h-fit min-h-fit w-full flex-col px-10">
          <div className="flex h-32 w-full flex-row items-center justify-start gap-4 px-4">
            <NavLink to="/">
              <FaArrowLeft />
            </NavLink>
            <div className="text-2xl">{userProject?.primarytitle}</div>
            <FaPen />
          </div>

          <div className="mt-8 grid items-start gap-4 px-4 py-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* To-Do Section */}
            <section className="flex h-fit min-h-fit w-full flex-col gap-4 rounded-lg bg-[#7fa1c3] p-2">
              <p className="mx-auto flex flex-row items-center justify-center gap-2 text-xl">
                <div className="text-2xl">To-Do</div>
                <div className="rounded-full bg-red-400 px-2 text-xl">
                  {todoSteps.length}
                </div>
              </p>
              {todoSteps.map((step) => (
                <div
                  key={step._id}
                  className="mx-auto flex h-fit min-h-fit w-[80%] flex-col gap-2 rounded-lg bg-white p-2 shadow-lg"
                >
                  <div className="flex flex-row justify-end gap-1">
                    <button
                      onClick={() =>
                        handleUpdateCategory(step._id, "In-Progress")
                      }
                      disabled={loading}
                    >
                      <IoMdCheckmark />
                    </button>
                    <BsThreeDots />
                  </div>
                  <div>{step.steptitle}</div>
                  <div>{step.stepdescription}</div>
                  <div className="flex flex-row gap-1">
                    <div>{formatDate(step.deadlinedate)}</div>
                    <div>{formatTime(step.deadlinetime)}</div>
                  </div>
                </div>
              ))}
            </section>

            {/* In-Progress Section */}
            <section className="flex h-fit min-h-fit w-full flex-col gap-4 rounded-lg bg-[#7fa1c3] p-2">
              <p className="mx-auto flex flex-row items-center justify-center gap-2">
                <div className="text-2xl">In-Progress</div>
                <div className="rounded-full bg-yellow-400 px-2 text-xl">
                  {inProgressSteps.length}
                </div>
              </p>
              {inProgressSteps.map((step) => (
                <div
                  key={step._id}
                  className="mx-auto flex h-fit min-h-fit w-[80%] flex-col gap-2 rounded-lg bg-white p-2 shadow-lg"
                >
                  <div className="flex flex-row justify-end gap-1">
                    <button
                      onClick={() =>
                        handleUpdateCategory(step._id, "Completed")
                      }
                      disabled={loading}
                    >
                      <IoMdCheckmark />
                    </button>
                    <button
                      onClick={() => handleUpdateCategory(step._id, "To-Do")}
                      disabled={loading}
                    >
                      <RxCross2 />
                    </button>
                    <BsThreeDots />
                  </div>
                  <div>{step.steptitle}</div>
                  <div>{step.stepdescription}</div>
                  <div className="flex flex-row gap-1">
                    <div>{formatDate(step.deadlinedate)}</div>
                    <div>{formatTime(step.deadlinetime)}</div>
                  </div>
                </div>
              ))}
            </section>

            {/* Completed Section */}
            <section className="flex h-fit min-h-fit w-full flex-col gap-4 rounded-lg bg-[#7fa1c3] p-2">
              <p className="mx-auto flex flex-row items-center justify-center gap-2">
                <div className="text-2xl">Completed</div>
                <div className="rounded-full bg-green-400 px-2 text-xl">
                  {completedSteps.length}
                </div>
              </p>
              {completedSteps.map((step) => (
                <div
                  key={step._id}
                  className="mx-auto flex h-fit min-h-fit w-[80%] flex-col gap-2 rounded-lg bg-white p-2 shadow-lg"
                >
                  <div className="flex flex-row justify-end gap-1">
                    <BsThreeDots />
                  </div>
                  <div>{step.steptitle}</div>
                  <div className="text-xs">{step.stepdescription}</div>
                  <div className="flex flex-row gap-1">
                    <div>{formatDate(step.deadlinedate)}</div>
                    <div>{formatTime(step.deadlinetime)}</div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStepsPage;
