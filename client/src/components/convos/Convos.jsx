import React, { useCallback, useContext, useEffect, useState } from "react";
import "./convos.css";
import SingleConvo from "../SingleConvo/SingleConvo";
import { userContext } from "../../contextApi/Usercontext";
import { userRequest } from "../../ApiCalls";
import ConvosLoader from "./convosLoader/ConvosLoader";

const Convos = () => {
  const [convos, setConvos] = useState(null);
  const { data, dispatch } = useContext(userContext);
  const [chattingTo, setChattingTo] = useState("");



  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await userRequest.get(`/chat/${data.UserId}`);
        setConvos(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    data.UserId && fetchConvos();
  }, [data.UserId]);

  return (
    <div className="convos_container">
      {convos == null ? (
        <ConvosLoader />
      ) : convos?.length == 0 ? (
        <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
          <p style={{ color: "rgba(0,0,0,0.4)" }}>
            You have no conversations yet
          </p>
        </div>
      ) : (
        convos.map((item) => (
          <SingleConvo
            name={
              item.receiverData.receiverName === data.Username
                ? item.senderData.senderName
                : item.receiverData.receiverName
            }
            id={item.senderData.senderId}
            convoId={item._id}
            key={item._id}
            url={
              item.receiverData.receiverName === data.Username
                ? item.senderData.senderImage
                : item.receiverData.receiverImage
            }
            setChattingTo={setChattingTo}
            chattingTo={chattingTo}
          />
        ))
      )}
    </div>
  );
};

export default Convos;
