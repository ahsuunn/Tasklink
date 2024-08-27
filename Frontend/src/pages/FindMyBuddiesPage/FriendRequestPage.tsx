import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const FriendRequestPage = () => {
  const navigate = useNavigate();
  const handleNavigateToFindMyBuddies = () => {
    navigate("/findmybuddies");
  };

  return (
    <div className="mb-10 mt-10 flex h-fit min-h-fit w-full flex-col px-20 py-4">
      <div className="mb-6 flex flex-row items-center gap-4">
        <div className="cursor-pointer" onClick={handleNavigateToFindMyBuddies}>
          <FaArrowLeftLong />
        </div>
        <div className="w-fit min-w-fit text-xl text-black">
          Friend request list
        </div>
      </div>
      <div className="h-[32rem] w-full rounded-lg bg-[#4679a8] p-4 shadow-lg"></div>
    </div>
  );
};

export default FriendRequestPage;
