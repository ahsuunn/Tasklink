import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import useFetch from "../../lib/CustomHooks/useFetch";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import Swal from "sweetalert2";
import { handleFetchError } from "../../lib/actions/HandleError";
import CustomAxios from "../../lib/actions/CustomAxios";

interface IUser {
  _id: string;
  displayName: string;
  lastName: string;
}

interface IFriendRequest {
  _id: string;
  senderid: string;
}

const FriendRequestPage = () => {
  const {
    response: friendrequests,
    error: friendRequestsError,
    loading: friendRequestsLoading,
  } = useFetch<IFriendRequest[]>({
    url: "/profile/friendrequests/mine",
  });

  const {
    response: users,
    error: usersError,
    loading: usersLoading,
  } = useFetch<IUser[]>({
    url: "/profile/alluser",
  });

  const [requestsWithDisplayNames, setRequestsWithDisplayNames] = useState<
    { _id: string; displayName: string; lastName: string; senderid: string }[]
  >([]);

  const navigate = useNavigate();

  const handleNavigateToFindMyBuddies = () => {
    navigate("/findmybuddies");
  };

  const handleDeleteFriendRequest = async (senderId: string) => {
    console.log("Sender ID: ", senderId);
    try {
      const reqbody = {
        requesterId: senderId, // Send the senderId
      };

      await CustomAxios("post", `/profile/friendrequests/remove`, reqbody);

      const response = await Swal.fire({
        icon: "success",
        title: "",
        text: "Friend request rejected.",
        showCancelButton: true,
        cancelButtonText: "Done",
      });
      if (response.isConfirmed) {
        navigate(`/findmybuddies/friendrequests`);
      }
    } catch (error) {
      handleFetchError(error);
    }
  };

  useEffect(() => {
    console.log("Friend requests data:", friendrequests);
    if (friendrequests && users) {
      const requestsWithNames = friendrequests.map((request) => {
        console.log("Processing request ID:", request._id);
        const user = users.find((user) => user._id === request.senderid);
        return {
          _id: request._id,
          displayName: user ? user.displayName : "Unknown User",
          lastName: user ? user.lastName : "",
          senderid: request.senderid, // Include senderid in the state
        };
      });
      setRequestsWithDisplayNames(requestsWithNames);
    }
  }, [friendrequests, users]);

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
      <div className="h-[32rem] w-full overflow-y-auto rounded-lg bg-[#4679a8] p-4 shadow-lg">
        {(friendRequestsLoading || usersLoading) && (
          <p className="text-white">Loading...</p>
        )}
        {(friendRequestsError || usersError) && (
          <p className="text-white">Error loading data.</p>
        )}
        {!friendRequestsLoading &&
          !friendRequestsError &&
          friendrequests &&
          friendrequests.length === 0 && (
            <p className="text-white">No friend requests found.</p>
          )}
        {!friendRequestsLoading &&
          !friendRequestsError &&
          requestsWithDisplayNames.length > 0 && (
            <ul className="space-y-4">
              {requestsWithDisplayNames.map((request) => (
                <li
                  key={request._id}
                  className="flex items-center gap-2 rounded bg-white p-2 shadow"
                >
                  <div className="h-9 w-9 rounded-full bg-black"></div>
                  <span className="flex-1 font-medium text-black">
                    {request.displayName} {request.lastName}
                  </span>
                  <div className="ml-auto flex gap-4">
                    <FaCheck
                      color="green"
                      className="cursor-pointer"
                      size={23}
                    />
                    <RxCross2
                      color="red"
                      className="cursor-pointer"
                      size={23}
                      onClick={() =>
                        handleDeleteFriendRequest(request.senderid)
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default FriendRequestPage;
