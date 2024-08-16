export interface ITask {
  _id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: number;
  category?: "To-Do" | "In Progress" | "Completed";
}

export interface ITaskForm {
  title: string;
  description: string;
  deadline: Date;
  priority: number;
  category?: "To-Do" | "In Progress" | "Completed";
}

export interface ITaskFormDataValidate {
  text: string;
}

export const validateTaskForm = (value: ITaskForm) => {
  const errors: ITaskFormDataValidate = { text: "" };
  let isError = false;

  if (!value.title || value.title.split(" ").filter((e) => e).length === 0) {
    isError = true;
    errors.text = "Title can't be empty";
  }

  if (
    !value.description ||
    value.description.split(" ").filter((e) => e).length === 0
  ) {
    isError = true;
    errors.text = "Description can't be empty";
  }

  return { isError, errors };
};
