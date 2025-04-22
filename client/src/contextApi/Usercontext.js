import React, { createContext, useEffect, useReducer, useState } from 'react'
import { useContext } from 'react'




export const userContext = createContext();


const UsercontextProvider = ({children}) => {



  const INITIAL_STATE = {
    token: JSON.parse(localStorage.getItem("user"))?.token || "",
    userDetails: JSON.parse(localStorage.getItem("user"))?.userData || null
  }
  
  

  const userReducer = (state, action) => {
  
    switch (action.type) {
      case "SAVE_USER":
       localStorage.setItem("user",JSON.stringify({...action.payload}));
        return {
          ...state,
          token:action.payload.token,
          userDetails:action.payload.userData,
        };
      case "LOGOUT":
        localStorage.removeItem("user")
        return {
          ...state,
          token: '',
          userDetails:null,
        };

      default:
        return state;
    }
  
  }
  
  const [state,dispatch] = useReducer(userReducer,INITIAL_STATE);


  return (

   <userContext.Provider value={{data:state,dispatch}}>
    {children}
   </userContext.Provider>
  )
}

export default UsercontextProvider