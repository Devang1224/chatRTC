import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./chatsection.css";
import Chat from "../chat/Chat";
import { userRequest } from "../../ApiCalls";
import { receiverContext } from "../../contextApi/ReceiverProvider";
import Loader from "../ui/loader/Loader";
import InputSection from "../inputsection/InputSection";
import { userContext } from "../../contextApi/Usercontext";
import { useSocket } from "../../contextApi/SocketProvider";

const ChatSection = () => {
  const [chats, setChats] = useState([]);
  const scrollRef = useRef();
  const { receiverData } = useContext(receiverContext);
  const { data } = useContext(userContext);
  const { socket } = useSocket();
  const { dispatch } = useContext(receiverContext);

  const getChats = useCallback(async () => {
    try {
      const res = await userRequest.get(
        `/chat/message/get?convoId=${receiverData?.ConvoId}&userId=${data?.userDetails?._id}`
      );
      setChats(res.data?.data);
    } catch (err) {
      console.log(err);
    }
    const convoid = receiverData.ConvoId;
    const username = data?.userDetails?.username;
    socket.emit("privateChat", { convoid, username });
  }, [data.Username, receiverData.ConvoId, socket]);

  useEffect(() => {
    getChats();
  }, [getChats, receiverData.ConvoId]);

  // sending message
  useEffect(() => {
    socket.on("Message", (message) => {
      console.log("newMessage", message);
      dispatch({
        type:"UPDATE_CONVO",
        payload:{
          lastMessage:message?.text,
          updatedAt:new Date(),
          _id:receiverData.ConvoId
        }
       })
      setChats((prev) => [...prev, message]);
    });

    return ()=>{
      socket.off("Message");
    }
  }, []);

  // sending message

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ bhaviour: "auto" });
  }, [chats]);

  // console.log("chats", chats);

  return (
    <>
      <div className="chat_container">
        {chats == null ? (
          <Loader />
        ) : chats?.length != 0 ? (
          chats?.map((item, index) => (
            <div
              ref={scrollRef}
              key={index}
              className={`chat ${
                item.sender === data.userDetails._id ? "user" : "receiver"
              }`}
            >
              <Chat key={item._id} item={item} />
            </div>
          ))
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.6,
            }}
          >
            <h2>No Messages</h2>
            <p style={{ textAlign: "center" }}>
              You currently have no messages.
            </p>
          </div>
        )}
      </div>
      <InputSection />
    </>
  );
};

export default ChatSection;
