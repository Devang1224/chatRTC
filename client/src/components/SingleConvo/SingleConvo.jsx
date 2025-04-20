import React, { useContext } from "react";
import "./singleconvo.css";
import { userContext } from "../../contextApi/Usercontext";
import ReceiverProvider, {
  receiverContext,
} from "../../contextApi/ReceiverProvider";
import { openMenuContext } from "../../contextApi/OpenMenu";
import moment from "moment";
import { getTimeAgo } from "../../utils/getTimeAgo";

const SingleConvo = ({item,setChattingTo,chattingTo}) => {

  const { dispatch } = useContext(receiverContext);
  const {data} = useContext(userContext);
  const { openMenu, setOpenMenu } = useContext(openMenuContext);
  // const convoId = item._id;
  const partnerDetails = item.participants[0]._id === data.userDetails?._id ? item.participants[1] : item.participants[0];
// id senderData id 

  const handleClick = () => {
    dispatch({
      type: "PARTNER",
      payload: {
        convoid: item?._id,
        partnerDetails:partnerDetails
      },
    });
    setChattingTo(partnerDetails?._id)
    setOpenMenu(false);
    
  };

  // console.log("item",item)

  return (
    <div className={`singleconvo_container ${partnerDetails?._id===chattingTo && "chattingContainer"}`} onClick={handleClick}>
      <img
        src={
          partnerDetails?.profilePic ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
        }
      />
      <div>
        <p>{partnerDetails?.username}</p>
         {
          item.lastMessage && (
            <div className="lastMessageContainer">
              <p className="lastMessage">
               {item.lastMessage}
              </p>
              <span className="lastMessageTime">
                {getTimeAgo(item.updatedAt)}
              </span>
            </div>
          )
         }
      </div>
    </div>
  );
};

export default SingleConvo;
