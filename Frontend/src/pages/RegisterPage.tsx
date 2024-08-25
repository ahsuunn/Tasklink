import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../components/universal/InputText";
import InputPassword from "../components/universal/InputPassword";
import Button from "../components/universal/Button";
import { handleFetchError } from "../lib/actions/HandleError";
import CustomAxios from "../lib/actions/CustomAxios";
import { IUserForm } from "../lib/types/User";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";
import logo from "./images/logo.png";
const RegisterPage = () => {
  const navigate = useNavigate();
  const currentUserContext = useContext(CurrentUserContext);

  // State for form data
  const [formData, setFormData] = useState<IUserForm>({
    password: "",
    displayName: "",
    lastName: "",
    email: "",
    major: "",
    yearOfEntry: 0, // Initialize with an empty string to avoid uncontrolled component warning
    role: "student",
  });

  // State for password confirmation
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((oldFd) => ({
      ...oldFd,
      [name]: value, // This assumes all input 'name' attributes match keys in formData
    }));
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

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
    <div className="relative flex min-h-screen items-center bg-[#7FA1C3]">
      <div className="container relative mx-auto w-full max-w-[400px] rounded-[100px] bg-[#7FA1C3] p-8 text-center">
        <img
          src={logo}
          alt="TaskLink Logo"
          className="mx-auto mb-4"
          style={{ marginTop: "-40px", width: "200px", height: "auto" }}
        />
        <form onSubmit={onSubmit}>
          <InputText
            name="displayName"
            placeholder="Display Name (First Name)"
            value={formData.displayName || ""}
            onChange={onChange}
            className="mb-2 block w-full rounded-[6px] border p-1.5 text-[16px]"
          />
          <InputText
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName || ""}
            onChange={onChange}
            className="mb-2 block w-full rounded-[6px] border p-1.5 text-[16px]"
          />
          <InputText
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={onChange}
            className="mb-2 block w-full rounded-[6px] border p-1.5 text-[16px]"
          />
          <InputText
            name="major"
            placeholder="Jurusan"
            value={formData.major || ""}
            onChange={onChange}
            className="mb-2 block w-full rounded-[6px] border p-1.5 text-[16px]"
          />
          <InputText
            name="yearOfEntry"
            placeholder="Angkatan"
            value={formData.yearOfEntry || ""}
            onChange={onChange}
            className="mb-2 block w-full rounded-[6px] border p-1.5 text-[16px]"
          />
          <InputPassword
            name="password"
            placeholder="Password"
            value={formData.password || ""}
            onChange={onChange}
            className="mb-2 block w-full rounded-[6px] border p-1.5 text-[16px]"
          />
          <InputPassword
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            className="mb-2 block w-full rounded-[6px] border p-1.5 text-[16px]"
          />
          <Button
            type="submit"
            className="mt-4 w-1/3 rounded-[12px] bg-[#0C173D] p-2 text-white hover:bg-[#16233a]"
          >
            Sign Up
          </Button>
        </form>
      </div>
      {/* Temporarily remove or adjust absolute positioning for debugging */}
    </div>
  );
};

export default RegisterPage;
