import React, { useCallback, useContext } from "react";
import "./right.css";
import RightTopBar from "../righttopbar/RightTopBar";
import ChatSection from "../chatsection/ChatSection";
import InputSection from "../inputsection/InputSection";
import ReceiverProvider, {
  receiverContext,
} from "../../contextApi/ReceiverProvider";
import MessagingImage from "../../assets/Messaging-rafiki.png";

const Right = () => {
  const { receiverData } = useContext(receiverContext);
  // console.log('partnerDetails ',receiverData)

  return receiverData?.ConvoId ? (
    <div className="right_container">
      <RightTopBar />
      <ChatSection />
    </div>
  ) : (
    <div className="right_container message">
      <img src={MessagingImage} className="right_container_background" />
    </div>
  );
};

export default Right;
