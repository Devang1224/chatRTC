import React, { useContext, useState } from "react";
import "./chat.css";
import { userContext } from "../../contextApi/Usercontext";
import DeleteIcon from "@mui/icons-material/Delete";
import { userRequest } from "../../ApiCalls";
import moment from "moment";

const Chat = ({item}) => {
  const { data } = useContext(userContext);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    setIsDeleted(true);
    try {
      const res = await userRequest
        .post(`/chat/messages/${item._id}`)
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="userChat">
      {isDeleted ? (
        <div className="deletedMessage">message deleted</div>
      ) : (
        <>
          <div className="chatContent">
            {item.sender == data.userDetails?._id && (
              <button className="trashChat" onClick={handleDelete}>
                <DeleteIcon className="trash_icon" />
              </button>
            )}
            <p>{item.text}</p>
          </div>
          <p className="chatTime">{moment(item.createdAt).format("D MMM YY, hh:mm A")}</p>

        </>
      )}
    </div>
  );
};

export default Chat;
