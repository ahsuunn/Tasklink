import { useState } from "react";
import Button from "../../components/universal/Button";
import { handleFetchError } from "../../lib/actions/HandleError";
import CustomAxios from "../../lib/actions/CustomAxios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

interface IFormData {
  text: string;
}

const DeleteTaskPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IFormData>({ text: "" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log({ taskId });
      await CustomAxios("delete", `/task/${taskId}`, formData);

      const response = await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "This project has been deleted successfully!",
        showCancelButton: true,
        cancelButtonText: "Done",
      });

      setFormData({ text: "" });
      if (response.isConfirmed) {
        navigate(`/`);
      }
    } catch (error) {
      handleFetchError(error);
    }
  };

  return (
    <main className="flex min-h-screen w-full grow flex-col items-center bg-slate-100 pt-20">
      <div className="w-full pt-4">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-4 rounded-lg border-[1px] border-slate-400 bg-white px-6 py-4 shadow-lg"
        >
          <h1 className="font-bold">Delete Project</h1>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="text"
              className="self-start pl-2 text-sm uppercase tracking-wide text-slate-500"
            >
              Are you sure that you want to delete this project?
            </label>
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            <Button>Delete</Button>
            <Button type="button" onClick={() => navigate(`/`)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DeleteTaskPage;
