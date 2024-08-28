import { MdPeople } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useFetch from "../../lib/CustomHooks/useFetch";
import { useContext, useState } from "react";
import CustomAxios from "../../lib/actions/CustomAxios";
import { CurrentUserContext } from "../../lib/contexts/CurrentUserContext";

interface IFriends {
  friendid: string;
  chatId: string;
  displayName: string;
  lastName: string;
  major: string;
}

interface IMessage {
  _id: string;
  senderid: string;
  content: string;
}

const FindMyBuddiesPage = () => {
  const {
    response: friends,
    error: friendsError,
    loading: friendsLoading,
  } = useFetch<IFriends[]>({
    url: "/profile/friends/mine",
  });

  const currentUserContext = useContext(CurrentUserContext);
  const LOCAL_USER_ID = currentUserContext?.currentUser?._id;
  console.log("Current User sKIBIDI: ", LOCAL_USER_ID);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [selectedFriendName, setSelectedFriendName] = useState<string>("");
  const [messageInput, setMessageInput] = useState<string>("");

  const navigate = useNavigate();

  const handleNavigateToFindBuddies = () => {
    navigate("/findmybuddies/find-buddies");
  };

  const handleNavigateToFriendRequest = () => {
    navigate("/findmybuddies/friendrequests");
  };

  const handleFriendClick = async (
    displayName: string,
    lastName: string,
    chatId: string,
  ) => {
    setSelectedFriendName(`${displayName} ${lastName}`);
    setSelectedChatId(chatId);

    try {
      const response = await CustomAxios("get", `/chat/${chatId}`);
      setChatMessages(
        Array.isArray(response.data.chatcontent)
          ? response.data.chatcontent
          : [],
      );
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleMessageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!selectedChatId || !messageInput.trim()) return;

    try {
      const reqbody = {
        senderId: LOCAL_USER_ID,
        content: messageInput,
      };

      await CustomAxios("post", `/chat/${selectedChatId}/messages`, reqbody);

      setMessageInput("");
      const response = await CustomAxios("get", `/chat/${selectedChatId}`);
      setChatMessages(
        Array.isArray(response.data.chatcontent)
          ? response.data.chatcontent
          : [],
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
              {friendsLoading ? (
                <div>Loading...</div>
              ) : friendsError ? (
                <div>Error loading friends</div>
              ) : (
                friends?.map((friend) => (
                  <div
                    key={friend.friendid}
                    className="cursor-pointer py-2"
                    onClick={() =>
                      handleFriendClick(
                        friend.displayName,
                        friend.lastName,
                        friend.chatId,
                      )
                    }
                  >
                    {friend.displayName} {friend.lastName}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex h-[32rem] w-[90%] flex-col rounded-lg bg-blue-200 shadow-lg sm:w-[90%] md:w-[60%]">
          <div className="flex h-[8rem] w-full items-center justify-center rounded-lg bg-[#cbdefa] shadow-lg">
            {selectedFriendName || "Header"}
          </div>
          <div className="h-full w-full bg-white p-2">
            {/* Display chat messages */}
            {selectedChatId ? (
              chatMessages.length > 0 ? (
                chatMessages.map((message) => (
                  <div key={message._id}>
                    <strong>{message.senderid}: </strong>
                    {message.content}
                  </div>
                ))
              ) : (
                <div>No messages found</div> // Handle the case when there are no chat messages
              )
            ) : (
              <div>Select a friend to view the chat</div>
            )}
          </div>
          <div className="flex h-[8rem] w-full items-center rounded-lg bg-[#cbdefa] p-2 shadow-lg">
            <input
              type="text"
              value={messageInput}
              onChange={handleMessageInputChange}
              placeholder="Type a message..."
              className="flex-grow rounded-l-lg border p-2"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 rounded-r-lg bg-blue-500 px-4 py-2 text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMyBuddiesPage;
