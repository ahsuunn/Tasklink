import { useContext, useState } from "react";
import InputText from "../components/universal/InputText";
import InputPassword from "../components/universal/InputPassword";
import Button from "../components/universal/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { handleFetchError } from "../lib/actions/HandleError";
import CustomAxios from "../lib/actions/CustomAxios";
import { IUserForm } from "../lib/types/User";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const currentUserContext = useContext(CurrentUserContext);
  const [formData, setFormData] = useState<IUserForm>({
    username: "",
    password: "",
    displayName: "",
    role: "student",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((oldFd) => ({
      ...oldFd,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await CustomAxios("post", "/auth/sign-up", formData);

      const { token, user } = data;
      localStorage.setItem("access_token", token);

      currentUserContext?.setCurrentUser(user);
      navigate("/");
    } catch (error) {
      handleFetchError(error);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center px-4 py-6">
      <form
        action="post"
        onSubmit={onSubmit}
        className="mx-auto flex h-fit w-full max-w-[700px] flex-col gap-4 rounded-lg border-[1px] py-10 shadow-lg md:px-8"
      >
        <h1 className="text-center text-2xl font-bold">Register</h1>
        <h2 className="text-center">Register your account here</h2>
        <InputText
          value={formData.username as string}
          onChange={onChange}
          name="username"
          placeholder="Input your username here"
        />
        <InputPassword
          value={formData.password as string}
          onChange={onChange}
          name="password"
          placeholder="Input your password here"
        />
        <InputText
          value={formData.displayName as string}
          onChange={onChange}
          name="displayName"
          placeholder="Input your public username"
        />
        <Button>Register</Button>
        <div className="mx-auto flex gap-2 text-sm">
          <p>Already have an account?</p>
          <NavLink to="/auth/sign-in" className="text-blue-700 duration-300">
            sign in
          </NavLink>
        </div>
        <NavLink to="/" className="w-full">
          <Button className="w-full bg-blue-200 text-blue-800 hover:bg-blue-300">
            Continue As a Guest
          </Button>
        </NavLink>
      </form>
    </div>
  );
};

export default RegisterPage;
