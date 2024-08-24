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
    primarytitle: "",
    secondarytitle: "",
    numberofsteps: 0,
    deadlinedate: new Date("2024-01-01T00:00:00Z"),
    deadlinetime: "00:00",
    color: "#ffffff",
    steps: [],
  });
  const [errors, setErrors] = useState<ITaskFormDataValidate | null>(null);

  // Handle input change for simple fields
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((oldFd) => ({
      ...oldFd,
      [name]: value,
    }));
  };

  // Handle deadline date change
  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((oldFd) => ({
      ...oldFd,
      [name]: new Date(value), // Convert string to Date object
    }));
  };

  // Handle deadline time change
  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((oldFd) => ({
      ...oldFd,
      [name]: value,
    }));
  };

  // Handle change in number of steps and dynamically adjust the steps array
  const onNumberOfStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numberOfSteps = parseInt(value) || 0; // Convert string to integer, default to 0

    // Adjust the steps array length based on the new numberOfSteps value
    const newSteps = Array.from({ length: numberOfSteps }, (_, index) => ({
      _id: "",
      steptitle: formData.steps[index]?.steptitle || "",
      stepdescription: formData.steps[index]?.stepdescription || "",
      deadlinedate:
        formData.steps[index]?.deadlinedate instanceof Date
          ? formData.steps[index].deadlinedate
          : new Date("2024-01-01T00:00:00Z"), // Ensure it's always a Date object
      deadlinetime: formData.steps[index]?.deadlinetime || "00:00",
      category: formData.steps[index]?.category || "",
    }));

    setFormData((oldFd) => ({
      ...oldFd,
      numberofsteps: numberOfSteps,
      steps: newSteps,
    }));
  };

  // Handle changes in individual step fields
  const onStepChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const newSteps = [...formData.steps];
    if (name === "deadlinedate") {
      newSteps[index] = { ...newSteps[index], [name]: new Date(value) }; // Convert to Date object
    } else {
      newSteps[index] = { ...newSteps[index], [name]: value };
    }
    setFormData((oldFd) => ({
      ...oldFd,
      steps: newSteps,
    }));
  };

  // Handle form submission
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
        text: "Project has been added successfully!",
        showCancelButton: true,
        cancelButtonText: "Go to Profile",
      });

      // Reset form data after submission
      setFormData({
        primarytitle: "",
        secondarytitle: "",
        numberofsteps: 0,
        deadlinedate: new Date("2024-01-01T00:00:00Z"),
        deadlinetime: "00:00",
        color: "#ffffff",
        steps: [],
      });

      navigate(`/`);
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
          <h1 className="font-bold">Add New Project</h1>
          <div className="flex w-full flex-col gap-2">
            {/* Input fields for primary and secondary titles, deadline date and time, and color */}
            <label
              htmlFor="primarytitle"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Primary Title
            </label>
            <TextAreaInput
              name="primarytitle"
              value={formData.primarytitle}
              onChange={onChange}
              placeholder="Input your primary title here"
              className="w-full"
              clearErrorMsg={() => setErrors({ ...errors, text: "" })}
              rows={2}
            />

            <label
              htmlFor="secondarytitle"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Secondary Title
            </label>
            <TextAreaInput
              name="secondarytitle"
              value={formData.secondarytitle}
              onChange={onChange}
              placeholder="Input your secondary title here"
              className="w-full"
              clearErrorMsg={() => setErrors({ ...errors, text: "" })}
              rows={2}
            />

            <label
              htmlFor="deadlinedate"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Deadline Date
            </label>
            <input
              type="date"
              name="deadlinedate"
              value={formData.deadlinedate.toISOString().substring(0, 10)}
              onChange={onDateChange}
              className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
            />

            <label
              htmlFor="deadlinetime"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Deadline Time
            </label>
            <input
              type="time"
              name="deadlinetime"
              value={formData.deadlinetime}
              onChange={onTimeChange}
              className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
            />

            <label
              htmlFor="color"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={onChange}
              className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
            />

            <label
              htmlFor="numberofsteps"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Number of Steps
            </label>
            <input
              type="number"
              name="numberofsteps"
              value={formData.numberofsteps}
              onChange={onNumberOfStepsChange}
              className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
              min={0}
            />
          </div>

          {/* Step inputs based on number of steps */}
          <div className="flex w-full flex-col gap-4">
            {formData.steps.map((step, index) => (
              <div key={index} className="grid w-full grid-cols-1 gap-2">
                {/* Step input fields for title, description, deadline date and time, and category */}
                <label
                  htmlFor={`step-title-${index}`}
                  className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
                >
                  Step {index + 1} Title
                </label>
                <input
                  type="text"
                  name="steptitle"
                  value={step.steptitle}
                  onChange={(e) => onStepChange(index, e)}
                  placeholder="Input step title here"
                  className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
                />

                <label
                  htmlFor={`step-description-${index}`}
                  className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
                >
                  Step {index + 1} Description
                </label>
                <TextAreaInput
                  name="stepdescription"
                  value={step.stepdescription}
                  onChange={(e) => onStepChange(index, e)}
                  placeholder="Input step description here"
                  className="w-full"
                  clearErrorMsg={() => setErrors({ ...errors, text: "" })}
                  rows={4}
                />

                <label
                  htmlFor={`step-deadlinedate-${index}`}
                  className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
                >
                  Step {index + 1} Deadline Date
                </label>
                <input
                  type="date"
                  name="deadlinedate"
                  value={
                    step.deadlinedate instanceof Date
                      ? step.deadlinedate.toISOString().substring(0, 10)
                      : new Date(step.deadlinedate)
                          .toISOString()
                          .substring(0, 10) // Handle both cases
                  }
                  onChange={(e) => onStepChange(index, e)}
                  className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
                />

                <label
                  htmlFor={`step-deadlinetime-${index}`}
                  className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
                >
                  Step {index + 1} Deadline Time
                </label>
                <input
                  type="time"
                  name="deadlinetime"
                  value={step.deadlinetime}
                  onChange={(e) => onStepChange(index, e)}
                  className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
                />

                <label
                  htmlFor={`step-category-${index}`}
                  className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
                >
                  Step {index + 1} Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={step.category}
                  onChange={(e) => onStepChange(index, e)}
                  className="w-full rounded border-[1px] border-slate-400 px-3 py-2 text-slate-700"
                />
              </div>
            ))}
          </div>

          {/* Submit and Cancel buttons */}
          <div className="grid w-full grid-cols-2 gap-2">
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={() => navigate(`/`)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateTaskPage;
