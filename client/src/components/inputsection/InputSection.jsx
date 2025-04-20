import React, { useContext, useEffect, useState } from "react";
import "./inputsection.css";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { userRequest } from "../../ApiCalls";
import { receiverContext } from "../../contextApi/ReceiverProvider";
import { userContext } from "../../contextApi/Usercontext";
import { useSocket } from "../../contextApi/SocketProvider";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const InputSection = () => {
  const [message, setMessage] = useState("");
  const { receiverData } = useContext(receiverContext);
  const { data } = useContext(userContext);
  const { socket } = useSocket();
  const [emojiContainer, setEmojiContainer] = useState(false);
  const {dispatch} = useContext(receiverContext);

  const handleKey = (e) => {
    e.code == "Enter" && handleSend();
  };

  const handleSend = async () => {
    try {
      if (message.trim()?.length != 0) {
        setMessage((prev) => prev.trim());
        const res = await userRequest.post("/chat/message/send", {
          conversationId: receiverData.ConvoId,
          sender: data.userDetails._id, // sender's Id
          senderImage: data.userDetails.profilePic,
          text: message.trim(),
        });

       dispatch({
        type:"UPDATE_CONVO",
        payload:{
          lastMessage:message,
          updatedAt:res.data?.data?.createdAt,
          _id:receiverData.ConvoId
        }
       })
        socket.emit("newMessage", {
          conversationId: receiverData.ConvoId,
          sender: data.userDetails._id, // sender's Id
          senderImage: data.userDetails.profilePic,
          text: message,
          _id: res.data?.data?._id,
        });
      }
    } catch (err) {
      console.log(err);
    }

    setMessage("");
  };

  const handleEmojiClick = (emojiData, event) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  function handleEmojiContainer() {
    setEmojiContainer((prev) => !prev);
  }

  // const handleVoiceMessage = async()=>{

  //   try{
  //      const stream = await navigator.mediaDevices.getUserMedia({audio:true});

  //      const mediaRecorder = new MediaRecorder(stream);
  //      setMediaRecorderInstance(mediaRecorder);
  //      const audioChunks = [];

  //      mediaRecorder.addEventListener("dataavailable", (event) => {
  //        if (event.data.size > 0) {
  //          audioChunks.push(event.data);
  //        }
  //      });

  //      mediaRecorder.start();

  //      setTimeout(() => {
  //        mediaRecorder.stop();
  //      }, 5000);

  //      mediaRecorder.addEventListener("stop", () => {
  //        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

  //        const audioUrl = URL.createObjectURL(audioBlob);
  //        const audioElement = new Audio(audioUrl);
  //        audioElement.play();
  //        console.log("Audio recording complete. URL:", audioUrl);

  //      });

  //   }
  //   catch(err)
  //   {
  //     console.log(err);
  //   }
  // }

  return (
    <div className="input_container">
      <div className="emoji_container">
        {emojiContainer && (
          <div className="emoji_window">
            <EmojiPicker
              height={300}
              width={300}
              previewConfig={{ showPreview: false }}
              onEmojiClick={handleEmojiClick}
            />
          </div>
        )}
        <SentimentSatisfiedAltIcon
          className="emoji_button"
          onClick={handleEmojiContainer}
        />
      </div>

      <div className="input_box">
        <input
          type="text"
          placeholder="Type a message . . ."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          value={message}
        />

        <div className="send" onClick={handleSend}>
          <SendIcon />
        </div>
      </div>

      {/* {
        micIcon?( <div className='mic_button' onClick={handleVoiceMessage}>
                   <MicIcon className='mic_icon' />
                 </div>):
                 (<div className='mic_button'><StopIcon/></div>)
}

      

      <label htmlFor="file" className='attachfile'>
        <AttachFileIcon className='attachicon'/>
      </label>

      <input style={{display:"none"}} id="file" type="file"/>
       */}
    </div>
  );
};

export default InputSection;
