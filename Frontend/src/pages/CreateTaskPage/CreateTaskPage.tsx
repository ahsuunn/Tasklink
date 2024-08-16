import React, { useState } from "react";
import Button from "../../components/universal/Button";
import TextAreaInput from "../../components/universal/TextAreaInput";
import { handleFetchError } from "../../lib/actions/HandleError";
import CustomAxios from "../../lib/actions/CustomAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  ITaskForm,
  ITaskFormDataValidate,
  validateTaskForm,
} from "../../lib/types/Task";

import handleInvalidState from "../../lib/actions/HandleInvalidState";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ITaskForm>({
    title: "",
    description: "",
    deadline: new Date("2024-01-01T00:00:00Z"),
    priority: 0,
    category: "To-Do",
  });
  const [errors, setErrors] = useState<ITaskFormDataValidate | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((oldFd) => ({
      ...oldFd,
      [name]: value,
    }));
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((oldFd) => ({
      ...oldFd,
      [name]: new Date(value), // Convert string to Date object
    }));
  };

  const onPriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((oldFd) => ({
      ...oldFd,
      priority: parseInt(value), // Convert string to integer
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { isError, errors } = validateTaskForm(formData);
      if (isError) {
        setErrors(errors);
        await handleInvalidState();
        return;
      }
      console.log(formData);
      await CustomAxios("post", "/task", formData);

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Task has been added successfully!",
        showCancelButton: true,
        cancelButtonText: "Go to Profile",
      });

      setFormData({
        title: "",
        description: "",
        deadline: new Date("2024-01-01T00:00:00Z"),
        priority: 0,
        category: "To-Do",
      });

      navigate(`/profile/tasks`);
    } catch (error) {
      handleFetchError(error);
    }
  };

  return (
    <main className="flex min-h-screen w-full grow flex-col items-center bg-slate-100 pt-20">
      <div className="w-full pb-20 pt-10">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-4 rounded-lg border-[1px] border-slate-400 bg-white px-6 py-4 shadow-lg"
        >
          <h1 className="font-bold">Add New Task</h1>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="text"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Title
            </label>
            <TextAreaInput
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="Input your title here"
              className="w-full"
              errorMsg={errors?.text}
              clearErrorMsg={() => setErrors({ ...errors, text: "" })}
              rows={2}
            />
            <label
              htmlFor="text"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Task description
            </label>
            <TextAreaInput
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Input your task description here"
              className="w-full"
              errorMsg={errors?.text}
              clearErrorMsg={() => setErrors({ ...errors, text: "" })}
              rows={10}
            />
            <label
              htmlFor="deadline"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline.toISOString().substring(0, 10)}
              onChange={onDateChange}
              className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
            />
            <label
              htmlFor="priority"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Priority
            </label>
            <input
              type="range"
              name="priority"
              min="1"
              max="10"
              value={formData.priority}
              onChange={onPriorityChange}
              className="w-full"
            />
            <span className="pl-2 text-sm text-slate-500">
              Priority: {formData.priority}
            </span>
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={() => navigate(`/profile/tasks`)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateTaskPage;
