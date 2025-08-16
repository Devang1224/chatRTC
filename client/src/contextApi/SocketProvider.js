import React, { createContext, useContext, useMemo } from 'react'
import {io} from "socket.io-client";


export const socketContext = createContext(null);

export const useSocket = ()=>{         
    return useContext(socketContext);
}


const SocketProvider = ({children}) => {

const socket = useMemo(()=>io(process.env.REACT_APP_BASE_URL,{
  auth:{
    token:JSON.parse(localStorage.getItem("user"))?.token || ""
  }
}),[])
// http://localhost:3000
// https://chatrtc-production.up.railway.app/
  return (
    <socketContext.Provider value={{socket}}>
       {children}
   </socketContext.Provider>
  )

}

export default SocketProvider