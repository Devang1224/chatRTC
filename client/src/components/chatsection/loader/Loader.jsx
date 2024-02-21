import React from 'react'
import "./loader.css"
import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div className="loader_container">
       <CircularProgress/>
    </div>
  )
}

export default Loader;