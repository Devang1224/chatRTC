import React from 'react'
import "./loader.css"
import { CircularProgress } from "@mui/material";

const Loader = ({size}) => {
  return (
    <div className="loader_container">
       <CircularProgress size={size || 32}/>
    </div>
  )
}

export default Loader;