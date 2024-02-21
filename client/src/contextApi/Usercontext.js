import React, { createContext, useEffect, useReducer, useState } from 'react'
import { useContext } from 'react'



export const userContext = createContext();


const UsercontextProvider = ({children}) => {



  const INITIAL_STATE = {
    Username:JSON.parse(localStorage.getItem('user'))?.username,
    UserId:JSON.parse(localStorage.getItem('user'))?.id,
    UserDp:JSON.parse(localStorage.getItem('user'))?.url,
  }
  
  
  const userReducer = (state, action) => {
  
    switch (action.type) {
      case "SAVE_USER":
        const storedUser = localStorage.setItem('user', JSON.stringify(action.payload));
        return {
          ...state,
          Username: action.payload.username,
          UserId: action.payload.id,
          UserDp:action.payload.url,
        };
      case "LOGOUT":
        localStorage.removeItem('user');
        return {
          ...state,
          Username: '',
          UserId: '',
          UserDp:''
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