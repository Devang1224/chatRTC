import React, { useContext } from "react";
import "./singleconvo.css";
import { userContext } from "../../contextApi/Usercontext";
import ReceiverProvider, {
  receiverContext,
} from "../../contextApi/ReceiverProvider";
import { openMenuContext } from "../../contextApi/OpenMenu";

const SingleConvo = (props) => {
  const { dispatch } = useContext(receiverContext);
  const { openMenu, setOpenMenu } = useContext(openMenuContext);


  const handleClick = () => {
    dispatch({
      type: "RECEIVER",
      payload: {
        name: props.name,
        id: props.id,
        convoid: props.convoId,
        url: props.url,
      },
    });
    props.setChattingTo(props.name)
    setOpenMenu(false);
    
  };

  return (
    <div className={`singleconvo_container ${props.name===props.chattingTo && "chattingContainer"}`} onClick={handleClick}>
      <img
        src={
          props.url ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
        }
      />
      <h3>{props.name}</h3>
    </div>
  );
};

export default SingleConvo;
