import { useState } from "react";
import useFetch from "../../lib/CustomHooks/useFetch";
import { NavLink } from "react-router-dom";
import { ITask } from "../../lib/types/Task";

const TaskPage = () => {
  const {
    response: tasks,
    error,
    loading,
  } = useFetch<ITask[]>({
    url: "/task/mine",
  });

  const [sortOrder, setSortOrder] = useState<"low-to-high" | "high-to-low">(
    "low-to-high",
  );
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "To-Do" | "In Progress" | "Completed"
  >("All");

  const getCategoryColor = (category: ITask["category"]) => {
    switch (category) {
      case "To-Do":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const sortTasks = (tasks: ITask[]) => {
    return tasks.sort((a, b) =>
      sortOrder === "low-to-high"
        ? a.priority - b.priority
        : b.priority - a.priority,
    );
  };

  const filterTasksByCategory = (tasks: ITask[]) => {
    if (selectedCategory === "All") return tasks;
    return tasks.filter((task) => task.category === selectedCategory);
  };

  return (
    <div className="pb-32">
      <div className="relative flex grow flex-col items-center pt-10">
        <div className="mt-2 flex flex-row items-center justify-center gap-4">
          <p className="mt-6 pt-12 text-3xl font-bold tracking-wide text-blue-700">
            My Tasks
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-2">
          <div className="mt-4 flex justify-center gap-4">
            <button
              className={`rounded px-4 py-2 ${
                sortOrder === "low-to-high"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSortOrder("low-to-high")}
            >
              Low-to-high
            </button>
            <button
              className={`rounded px-4 py-2 ${
                sortOrder === "high-to-low"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSortOrder("high-to-low")}
            >
              High-to-low
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <select
              className="rounded bg-gray-200 px-4 py-2"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value as
                    | "All"
                    | "To-Do"
                    | "In Progress"
                    | "Completed",
                )
              }
            >
              <option value="All">All</option>
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <section className="mt-8 grid gap-4 px-8 py-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <NavLink
            to="/profile/create-task"
            className="flex w-full flex-row items-center justify-center gap-2 rounded-lg border border-dashed border-blue-500 p-2"
          >
            <p className="font-bold text-blue-400">Add Task</p>
          </NavLink>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {tasks &&
            filterTasksByCategory(sortTasks(tasks)).map((task, idx) => (
              <article
                key={idx}
                className="flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-blue-100 p-2"
              >
                <div className="flex flex-col p-2">
                  <p className="text-dark block p-2 text-xl font-bold text-black">
                    {task.title}
                  </p>
                  <p className="block p-2">{task.description}</p>
                  <p className="block p-2">Priority: {task.priority}</p>
                  <div
                    className={`mr-auto w-fit rounded-full p-4 px-2 py-0.5 ${getCategoryColor(
                      task.category,
                    )}`}
                  >
                    {task.category}
                  </div>
                </div>
              </article>
            ))}
        </section>
      </div>
    </div>
  );
};

export default TaskPage;
