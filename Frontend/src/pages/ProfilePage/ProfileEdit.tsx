import { NavLink, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../lib/CustomHooks/useFetch";
import { IUser, IUserForm } from "../../lib/types/User";
import { useEffect, useState } from "react";
import InputText from "../../components/universal/InputText";
import Button from "../../components/universal/Button";
import CustomAxios from "../../lib/actions/CustomAxios";
import { handleFetchError } from "../../lib/actions/HandleError";
import InputImage from "../../components/universal/InputImage";

const ProfilePageEdit = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { response: userProfile } = useFetch<IUser>({
    url: `/profile/${email}`,
  });
  const [formData, setFormData] = useState<IUserForm>({
    profilePicUrl: "",
    displayName: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (userProfile) {
      const { profilePicUrl, displayName } = userProfile;
      setFormData({ profilePicUrl, displayName });
    }
  }, [userProfile]);

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
      const updateData = { ...formData };

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await CustomAxios(
          "post",
          `/uploads/profilePic/${email}`,
          fd,
        );
        updateData.profilePicUrl = data.url;
      }

      await CustomAxios("put", `/profile/${userProfile?._id}`, updateData);

      navigate(`/profile/${email}`);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profilePicUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center py-6">
      <div className="flex h-fit min-h-full w-full flex-col items-center justify-center gap-8">
        <form
          action="post"
          onSubmit={onSubmit}
          className="mx-auto flex h-fit w-full max-w-[700px] flex-col gap-4 rounded-lg border-[1px] py-10 shadow-lg md:px-8"
        >
          <h1 className="text-center text-2xl font-bold">
            Hello {userProfile?.displayName}
          </h1>
          <h2 className="text-center">Update your account here</h2>
          <div className="flex w-full flex-col items-start">
            <p className="text-sm font-light uppercase tracking-wider">
              Public Picture
            </p>
            <InputImage
              file={file}
              initialImageUrl={userProfile?.profilePicUrl}
              onChange={handleFileChange}
              className="aspect-square h-64 w-auto rounded-full p-0"
            />
          </div>

          <div className="flex w-full flex-col items-start">
            <p className="text-sm font-light uppercase tracking-wider">
              email
            </p>
            <InputText
              value={formData.displayName as string}
              onChange={onChange}
              name="displayName"
              placeholder="Input your new public email"
            />
          </div>
          <Button>Edit</Button>
          <NavLink
            to={`/profile/${email}`}
            className="flex items-center justify-center rounded-md border-2 border-blue-600 bg-white py-2 text-blue-600 hover:bg-blue-100"
          >
            <p>Cancel</p>
          </NavLink>
        </form>
      </div>
    </main>
  );
};

export default ProfilePageEdit;
