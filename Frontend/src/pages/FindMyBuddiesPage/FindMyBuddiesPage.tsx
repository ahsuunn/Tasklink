import { MdPeople } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const FindMyBuddiesPage = () => {
  const navigate = useNavigate();
  const handleNavigateToFindBuddies = () => {
    navigate("/findmybuddies/find-buddies");
  };

  const handleNavigateToFriendRequest = () => {
    navigate("/findmybuddies/friendrequests");
  };

  return (
    <div className="mb-10 mt-10 flex h-fit min-h-fit w-full flex-col px-10 py-4">
      <div className="mb-2 ml-5 text-xl text-black">Chat</div>
      <div className="flex grow flex-col items-center justify-between gap-2 sm:flex-col md:flex-row">
        <div className="h-[32rem] w-[90%] rounded-lg bg-slate-200 p-2 shadow-lg sm:w-[90%] md:w-[40%]">
          <div className="flex h-full flex-col gap-2">
            <div className="flex flex-row gap-2">
              <div className="flex h-7 w-full flex-row items-center gap-1 rounded-lg bg-white px-1">
                <div>
                  <IoMdSearch />
                </div>
                <div>Search...</div>
              </div>
              <div
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-[#4679a8]"
                onClick={handleNavigateToFriendRequest}
              >
                <FaBell color="white" />
              </div>
              <div
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-[#4679a8]"
                onClick={handleNavigateToFindBuddies}
              >
                <MdPeople color="white" />
              </div>
            </div>
            <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-white px-2 shadow-lg">
              <div>Friendlist</div>
            </div>
          </div>
        </div>
        <div className="flex h-[32rem] w-[90%] flex-col rounded-lg bg-blue-200 shadow-lg sm:w-[90%] md:w-[60%]">
          <div className="h-[8rem] w-full rounded-lg bg-[#cbdefa] shadow-lg">
            Header
          </div>
          <div className="h-full w-full bg-white"></div>
          <div className="h-[8rem] w-full rounded-lg bg-[#cbdefa] shadow-lg">
            Footer
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMyBuddiesPage;
