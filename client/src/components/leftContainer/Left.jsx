import React, { useContext, useEffect, useState } from "react";
import "./left.css";
import Topbar from "../topBar/Topbar";
import Search from "../searchBar/Search";
import Convos from "../convos/Convos";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { openMenuContext } from "../../contextApi/OpenMenu";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useSocket } from "../../contextApi/SocketProvider";



const Left = () => {
  const { openMenu, setOpenMenu } = useContext(openMenuContext);
  const { socket } = useSocket();

  function handleOpenMenu() {
    setOpenMenu((prev) => !prev);
  }

  useEffect(()=>{
    socket.on("getOnlinUsers",(user)=>{
      console.log("online users",user);
    })
    return ()=>{
      socket.off("getOnlinUsers")
    }
  },[])


  return (
    <>
      <div
        className={`left_container ${
          openMenu ? "show_left_container" : "hide_left_container"
        }`}
      >
        <Topbar />
        <Search />
        <Convos/>

        <div className="menu_container" onClick={handleOpenMenu}>
          {openMenu ? (
            <KeyboardDoubleArrowRightIcon className="menu_icon" />
          ) : (
            <KeyboardDoubleArrowLeftIcon className="menu_icon" />
          )}
        </div>
      </div>
    </>
  );
};

export default Left;
