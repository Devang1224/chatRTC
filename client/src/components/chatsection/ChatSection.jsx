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
  const [page, setPage] = useState(1);
  const [readyToPaginate, setReadyToPaginate] = useState(false);
  const scrollRef = useRef();
  const chatContainerRef = useRef();
  const hasMoreRef = useRef(true);
  const [isFetching, setIsFetching] = useState(false); // prevent double api calls

  const { receiverData } = useContext(receiverContext);
  const { data } = useContext(userContext);
  const { socket } = useSocket();
  const { dispatch } = useContext(receiverContext);


  // console.log("receiverData from chat section",receiverData.ConvoId)

  const getChats = useCallback(async () => {
    if (!receiverData?.ConvoId || !data?.userDetails?._id) return;
    if (isFetching) return; // already fetching? skip

    try {
      setIsFetching(true);

      const res = await userRequest.get(
        `/chat/message/get?convoId=${receiverData.ConvoId}&userId=${data.userDetails._id}&page=${page}`
      );
  //  console.log("res",res.data?.data);
      const newMessages = res.data?.data.length ? res.data?.data?.reverse() : [];
      // console.log("newMessages",newMessages);
      setChats((prev) =>
        page === 1 ? newMessages : [...newMessages, ...prev]
      );
     console.log("new messages length",newMessages.length);
      if (newMessages.length < 20) {
        hasMoreRef.current = false;
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setIsFetching(false);
    }

    if (page === 1) {
      const convoid = receiverData.ConvoId;
      const username = data?.userDetails?.username;
      socket.emit("privateChat", { convoid, username });
    }
  }, [data?.userDetails?._id, receiverData?.ConvoId, socket, page]);

  useEffect(() => {
    getChats();
  }, [getChats]);
console.log("hasMoreRef",hasMoreRef.current)
  // Handle incoming messages via socket
  useEffect(() => {
    socket.on("Message", (message) => {
      // console.log("receiverId from chat section", receiverData.ConvoId);
      console.log("message from chat section", message)
      dispatch({
        type: "UPDATE_CONVO",
        payload: {
          lastMessage: message?.text,
          updatedAt: new Date(),
          _id: message?.conversationId,
        },
      });
      setChats((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off("Message");
    };
  }, []);



const scrollToBottom = () => {
  scrollRef.current?.scrollIntoView({ behavior: "auto" });
}

  useEffect(() => {
    if (chats.length > 0 && page === 1) {
      scrollToBottom();
      setReadyToPaginate(true);
    }
  }, [chats, page]);

  // Scroll event pagination
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (!chatContainer) return;

    const handleScroll = () => {
      
      console.log(!readyToPaginate,isFetching,!hasMoreRef.current)
      if (!readyToPaginate || isFetching || !hasMoreRef.current) return;
      
      if (chatContainer.scrollTop < 100) {
        console.log("Fetching previous messages...");
        setPage((prev) => prev + 1);
      }
    };
    chatContainer.addEventListener("scroll", handleScroll);
     
    return () => {
      chatContainer.removeEventListener("scroll", handleScroll);
    };
  }, [readyToPaginate,isFetching]);
  


  return (
    <>
      <div ref={chatContainerRef} className="chat_container">
      {  (isFetching && chats.length !== 0) && <div>
            <p style={{color:"#fff",textAlign:"center"}}>Loading...</p>
          </div>}
        {chats == null ? (
         <Loader/>
        ) : chats.length !== 0 ? (
          chats?.map((item, index) => (
            <div
              ref={scrollRef}
              key={item._id}
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


