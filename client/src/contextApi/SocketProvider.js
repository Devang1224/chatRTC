import React, { createContext, useContext, useMemo } from 'react'
import {io} from "socket.io-client";


export const socketContext = createContext(null);

export const useSocket = ()=>{         
    return useContext(socketContext);
}


const SocketProvider = ({children}) => {

const socket = useMemo(()=>io("https://chatapprtc-backend-production.up.railway.app"),[])
// http://localhost:3000
// https://chatapprtc-backend-production.up.railway.app
  return (
    <socketContext.Provider value={{socket}}>
       {children}
   </socketContext.Provider>
  )

}

export default SocketProvider