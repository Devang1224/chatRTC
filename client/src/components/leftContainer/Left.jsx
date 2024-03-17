import React, { useContext, useState } from "react";
import "./left.css";
import Topbar from "../topBar/Topbar";
import Search from "../searchBar/Search";
import Convos from "../convos/Convos";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { openMenuContext } from "../../contextApi/OpenMenu";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";



const Left = () => {
  const { openMenu, setOpenMenu } = useContext(openMenuContext);

  function handleOpenMenu() {
    setOpenMenu((prev) => !prev);
  }

const [convosUpdated,setConvosUpdated] = useState(false)

  return (
    <>
      <div
        className={`left_container ${
          openMenu ? "show_left_container" : "hide_left_container"
        }`}
      >
        <Topbar />
        <Search setConvosUpdated={setConvosUpdated}/>
        <Convos convosUpdated={convosUpdated} setConvosUpdated={setConvosUpdated}/>

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
