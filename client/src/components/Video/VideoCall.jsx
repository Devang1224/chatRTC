import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./videocall.css"
import ReactPlayer from "react-player";
import peer from "../../contextApi/Peer";
import {useSocket} from '../../contextApi/SocketProvider'
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import Draggable, {DraggableCore} from "react-draggable";


const VideoCall = ({audioEnabled,setAudio,setVideo,videoEnabled,close,myStream,remoteStream,remoteSocketId,handleCallUser,sendStreams,hangUpHandler }) => {


  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    if (localVideoRef.current && myStream) {
      localVideoRef.current.srcObject = myStream;

      const videoTrack = myStream.getVideoTracks()[0];
      videoTrack.enabled = videoEnabled;

      const audioTrack = myStream.getAudioTracks()[0];
        audioTrack.enabled = audioEnabled;

    }
  }, [remoteStream, myStream, videoEnabled, audioEnabled]);


  return (
    <div className="videocall-container">
         


  {/* remote user stream        */}
        {remoteStream ? (

          <div className='remoteStreamContainer'>
            <video className="reactplayer"  ref={remoteVideoRef} autoPlay playsInline/>
          </div>

       )  :(<div className='stream-container'>
              <div className='stream-container-content'>
                  <h3>connecting</h3>
                  <span className="connectionLoader"></span>
               </div>
           </div>)
        }

 
   {/* user's stream */}

   <Draggable bounds="parent">
         <div className='userStream-container'>
         {myStream && (

          <video className="userStream" ref={localVideoRef} autoPlay playsInline style={{height:"100%"
          ,width:"100%"}}/>

      )}
         </div>
    </Draggable>

       
      <div className='callhandlers-container'>
            {/* {remoteSocketId && <button onClick={handleCallUser}>CALL</button>} */}
            {remoteSocketId && <button onClick={hangUpHandler} className='endCall'><CallEndIcon style={{color:"white"}}/></button>}
            <button onClick={setVideo} className='callHandler-icon'>
                {videoEnabled ? <VideocamIcon style={{color:"white"}}/> : <VideocamOffIcon style={{color:"white"}} />}
             </button>
             <button onClick={setAudio} className='callHandler-icon'>
               {audioEnabled ? <KeyboardVoiceIcon style={{color:"white"}}/> : <MicOffIcon style={{color:"white"}} />}
             </button>

             </div>
      </div>

  )
}

export default VideoCall