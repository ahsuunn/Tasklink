import { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { IUser } from "../../lib/types/User";
import useFetch from "../../lib/CustomHooks/useFetch";
import { useNavigate } from "react-router-dom";
import CustomAxios from "../../lib/actions/CustomAxios";
import { handleFetchError } from "../../lib/actions/HandleError";
import Swal from "sweetalert2";
import "./SearchFriendsPage.css";

const SearchFriendsPage = () => {
  const navigate = useNavigate();
  const handleNavigateToFindMyBuddies = () => {
    navigate("/findmybuddies");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  const {
    response: users,
    error,
    loading,
  } = useFetch<IUser[]>({
    url: "/profile/alluser",
  });

  useEffect(() => {
    if (users) {
      const filtered = users.filter((user) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery]);

  const handleSendFriendRequest = async (userId: string) => {
    try {
      const reqbody = {
        recipientId: userId,
      };

      await CustomAxios("post", `/profile/friendrequests/send`, reqbody);

      const response = await Swal.fire({
        icon: "success",
        title: "",
        text: "Friend request sent",
        showCancelButton: true,
        cancelButtonText: "Done",
      });
      if (response.isConfirmed) {
        navigate(`/findmybuddies`);
      }
    } catch (error) {
      handleFetchError(error);
    }
  };

  return (
    <div className="mb-10 mt-10 flex h-fit min-h-fit w-full flex-col px-20 py-4">
      <div className="mb-6 flex flex-row items-center gap-4">
        <div className="cursor-pointer" onClick={handleNavigateToFindMyBuddies}>
          <FaArrowLeftLong />
        </div>
        <div className="w-fit min-w-fit text-xl text-black">
          Find More Buddies
        </div>
        <div className="flex h-fit min-h-fit w-full flex-row items-center gap-1 rounded-lg border border-black bg-white shadow-lg">
          <div className="ml-1">
            <IoMdSearch />
          </div>
          <input
            type="text"
            className="flex-grow rounded-lg text-slate-500"
            placeholder="Search name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="h-[32rem] w-full rounded-lg bg-[#4679a8] p-4 shadow-lg">
        {loading && <p>Loading...</p>}
        {error && <p>Error loading users.</p>}
        {!loading && !error && filteredUsers.length === 0 && (
          <p className="text-white">No users found.</p>
        )}
        <div className="scroll-container">
          {!loading &&
            !error &&
            filteredUsers.map((user) => (
              <div key={user._id} className="user-item border-b border-white">
                <div className="flex flex-row items-center">
                  <div className="user-avatar"></div>
                  <div className="user-details">
                    <div className="user-name">
                      <p>{user.displayName}</p>
                      <p className="ml-1">{user.lastName}</p>
                    </div>
                    <p className="user-major">{user.major}</p>
                  </div>
                </div>
                <FaPlus
                  className="cursor-pointer"
                  onClick={() => handleSendFriendRequest(user._id)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFriendsPage;
