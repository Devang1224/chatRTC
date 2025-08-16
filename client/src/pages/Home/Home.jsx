import React, { useContext, useEffect } from "react";
import "./home.css";
import Left from "../../components/leftContainer/Left";
import Right from "../../components/rightContainer/Right";
import ReceiverProvider from "../../contextApi/ReceiverProvider";
import { useSocket } from "../../contextApi/SocketProvider";
import { userContext } from "../../contextApi/Usercontext";
import { openMenuContext } from "../../contextApi/OpenMenu";

const Home = () => {
  const { socket } = useSocket();
  const { data } = useContext(userContext);
  const { openMenu, setOpenMenu } = useContext(openMenuContext);

  const User = data.userDetails.username;

  useEffect(() => {
    socket.emit("userJoinedTheChat", { User });
  }, []);

  return (
    <ReceiverProvider>
      <div className={`main_container ${openMenu && "main_container_blur"}`}>
        <Left />
        <Right />
      </div>
    </ReceiverProvider>
  );
};

export default Home;
