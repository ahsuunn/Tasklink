export interface IStep {
  _id: string;
  steptitle: string;
  stepdescription: string;
  deadlinedate: Date;
  deadlinetime: string;
  category: string;
}

export interface ITask {
  _id: string;
  TaskUserId: string;
  primarytitle: string;
  secondarytitle: string;
  numberofsteps: number;
  deadlinedate: Date;
  deadlinetime: string;
  color: string;
  steps: IStep[];
}

export interface ITaskForm {
  primarytitle: string;
  secondarytitle: string;
  numberofsteps: number;
  deadlinedate: Date;
  deadlinetime: string; // assuming time is stored as a string, e.g., "14:00"
  color: string;
  steps: IStep[];
}

export interface ITaskFormDataValidate {
  text: string;
}

export const validateTaskForm = (value: ITaskForm) => {
  const errors: ITaskFormDataValidate = { text: "" };
  let isError = false;

  // Validate primary title
  if (!value.primarytitle || value.primarytitle.trim().length === 0) {
    isError = true;
    errors.text = "Primary title can't be empty";
  }

  // Validate secondary title
  if (!value.secondarytitle || value.secondarytitle.trim().length === 0) {
    isError = true;
    errors.text = "Secondary title can't be empty";
  }

  // Validate number of steps
  if (value.numberofsteps <= 0) {
    isError = true;
    errors.text = "Number of steps must be greater than zero";
  }

  // Validate steps array
  if (!value.steps || value.steps.length === 0) {
    isError = true;
    errors.text = "Steps can't be empty";
  } else {
    // Check each step for valid data
    value.steps.forEach((step, index) => {
      if (!step.steptitle || step.steptitle.trim().length === 0) {
        isError = true;
        errors.text = `Step ${index + 1}: Title can't be empty`;
      }
      if (!step.stepdescription || step.stepdescription.trim().length === 0) {
        isError = true;
        errors.text = `Step ${index + 1}: Description can't be empty`;
      }
      if (!step.deadlinedate) {
        isError = true;
        errors.text = `Step ${index + 1}: Deadline date is required`;
      }
      if (!step.deadlinetime || step.deadlinetime.trim().length === 0) {
        isError = true;
        errors.text = `Step ${index + 1}: Deadline time is required`;
      }
      if (!step.category || step.category.trim().length === 0) {
        isError = true;
        errors.text = `Step ${index + 1}: Category is required`;
      }
    });
  }

  return { isError, errors };
};
