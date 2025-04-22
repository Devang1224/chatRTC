import React, { useCallback, useContext, useEffect, useState } from "react";
import "./righttopbar.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import { userContext } from "../../contextApi/Usercontext";
import ReceiverProvider, {
  receiverContext,
} from "../../contextApi/ReceiverProvider";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contextApi/SocketProvider";
import VideoCall from "../Video/VideoCall";
import peer from "../../contextApi/Peer";
import Modal from "react-modal";
import { setAppElement } from "react-modal";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Set the app element for modal
setAppElement("#root");

const RightTopBar = () => {
  const { receiverData, dispatch } = useContext(receiverContext);
  const { data } = useContext(userContext);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [onGoingCall, setOnGoingCall] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [incomingCall, setIncomingCall] = useState(false);
  const [isNegotiationDone, setIsNegotiationDone] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [remoteUser, setRemoteUser] = useState(null);
  const [callRejectedNotification, setCallRejectedNotification] =
    useState(false);

  // function to start video call
  const startVideoCall = () => {
    const User = data?.userDetails?.username;
    const convoId = receiverData?.ConvoId;
    const Receiver = receiverData?.partnerDetails?.username;
    socket.emit("roomJoined", { User, convoId, Receiver });
    setOnGoingCall(true);
  };

  console.log("receiverData",receiverData)

  // when user joins the chat room
  const handleUserJoined = useCallback(({ User, id }) => {
    setRemoteSocketId(id);
    setRemoteUser(User);
    setIncomingCall(true);
  }, []);

  // this function is setting the users or caller remoteSocketid equal to receiver's socket id
  const handleSetRemoteIdForUser = useCallback(({ Receiver, receiverid }) => {
    setRemoteSocketId(receiverid);
  }, []);

  //when user accept the modal
  const handleModalAccepted = () => {
    socket.emit("modalaccepted", { to: remoteSocketId });
  };

  // when the modal gets accepted ,call the user
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioEnabled,
      video: videoEnabled ? { facingMode: "user" } : false,
    });

    setMyStream(stream);

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [audioEnabled, remoteSocketId, socket, videoEnabled]);

  //
  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoEnabled ? { facingMode: "user" } : false,
      });
      setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket, videoEnabled]
  );

  const handleCallAccepted = useCallback(({ from, ans }) => {
    handleNegoNeeded(from);

    peer.setLocalDescription(ans);
  }, []);

  // handling negotiatation
  const handleNegoNeeded = useCallback(
    async (from) => {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", { offer, to: from });
    },
    [remoteSocketId, socket]
  );

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
    setIsNegotiationDone(true);
  }, []);

  // on call rejection
  const rejectedCallHandler = useCallback(async () => {
    setOnGoingCall(false);
    toast.error("Call Rejected!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, []);

  // sending user's stream to remote
  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    } else {
      console.log("myStream is undefined");
    }
  }, [myStream]);

  // checking if stream tracks are coming from the remote
  useEffect(() => {
    peer?.peer?.addEventListener("track", async (ev) => {
      const remoteStream = ev?.streams[0];
      setRemoteStream(remoteStream);
    });
    return () => {
      peer?.peer?.removeEventListener("track", async (ev) => {
        const remoteStream = ev?.streams[0];
        setRemoteStream(remoteStream);
      });
    };
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("setremoteidfor-user", handleSetRemoteIdForUser);
    socket.on("youcancallusernow", handleCallUser);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("RejectedCall", rejectedCallHandler);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("RejectedCall", rejectedCallHandler);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleSetRemoteIdForUser,
    handleCallUser,
    rejectedCallHandler,
  ]);

  useEffect(() => {
    if (myStream) {
      sendStreams();
    }
  }, [myStream, sendStreams]);

  // end the call
  const hangUpHandler = useCallback(() => {
    // Stop local media streams

    const state = peer.peer.iceConnectionState;

    if (state == "new") {
      peer.peer.close();
      peer.peer = null;
      setMyStream(null);
      setRemoteStream(null);
      setOnGoingCall(false);
      setIsNegotiationDone(false);
      return;
    }

    const localVideoTrack = myStream.getVideoTracks()[0];
    const localAudioTrack = myStream.getAudioTracks()[0];

    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      const audioTrack = myStream.getAudioTracks()[0];

      // Remove video track
      if (videoTrack) {
        myStream.removeTrack(videoTrack);
        videoTrack.stop();
      }

      // Remove audio track
      if (audioTrack) {
        myStream.removeTrack(audioTrack);
        audioTrack.stop();
      }
    }

    // Close the Peer connection
    peer.peer.close();
    peer.peer = null;

    // Reset the state variables
    setMyStream(null);
    setRemoteStream(null);
    setOnGoingCall(false);
    setIsNegotiationDone(false);

    window.location.reload();
  }, [myStream]);

  // if user rejects the call
  const rejectCallHandler = async () => {
    setIncomingCall(false);
    socket.emit("callRejected", { to: remoteSocketId });
  };

  // if receiver wont respond
  const startIncomingCallTimer = useCallback(() => {
    const timer = setTimeout(() => {
      setIncomingCall(false);
    }, 20000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // if receiver won't respond
  const startOutgoingCallTimer = useCallback(() => {
    const timer = setTimeout(() => {
      const state = peer.peer.iceConnectionState;

      if (state == "new") {
        setOnGoingCall(false);
        toast.error("Not Answering", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }, 20000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    if (incomingCall) {
      startIncomingCallTimer();
    }

    if (onGoingCall) {
      startOutgoingCallTimer();
    }
  }, [
    incomingCall,
    onGoingCall,
    startIncomingCallTimer,
    startOutgoingCallTimer,
  ]);

  return (
    <div className="right_topbar">
      <div className="sender_container">
      <div
          className="user_avatar"
          style={{ background: receiverData?.partnerDetails?.profileGradient }}
        >
          {receiverData?.partnerDetails?.username?.charAt(0).toUpperCase()}
        </div>
        <h3>{receiverData?.partnerDetails?.username}</h3>
      </div>

      <div className="videocam">
        <button onClick={startVideoCall}>
          <VideocamIcon />
        </button>
      </div>

      {incomingCall && (
        <div className="incomingCallModal">
          <button className="closeicon" onClick={() => setIncomingCall(false)}>
            {" "}
            <CloseIcon />
          </button>
          <div className="incomingCall-headerContainer">
            <h2>Incoming Call</h2>
            <h2 className="username">{remoteUser}</h2>
          </div>

          <div className="callloader-container">
            <span className="callloader"></span>
          </div>

          <div className="handleCall-container">
            <button onClick={rejectCallHandler} className="rejectCall">
              <CallEndIcon style={{ color: "white" }} />
            </button>
            <button
              onClick={() => {
                setOnGoingCall(true);
                setIncomingCall(false);
                handleModalAccepted();
              }}
              className="acceptCall"
            >
              <CallIcon style={{ color: "white" }} />
            </button>
          </div>
        </div>
      )}

      {onGoingCall && (
        <VideoCall
          remoteStream={remoteStream}
          myStream={myStream}
          remoteSocketId={remoteSocketId}
          handleCallUser={handleCallUser}
          sendStreams={sendStreams}
          close={() => setOnGoingCall(false)}
          hangUpHandler={hangUpHandler}
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
          setVideo={() => setVideoEnabled((prevEnabled) => !prevEnabled)}
          setAudio={() => setAudioEnabled((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default RightTopBar;
