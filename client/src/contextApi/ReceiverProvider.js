import React, { Children, createContext, useReducer } from 'react'


export const receiverContext = createContext()

const ReceiverProvider = ({children}) => {

    const INITIAL_STATE = {
       Convos:[],
       ReceiverName:"",
       ReceiverId:"",
       ConvoId:"",
       ReceiverImage:""
      }
      

      


      const receiverProvider = (state,action)=>{
        
        switch (action.type){

            case "RECEIVER":
                return{
                    ...state,
                    ReceiverName:action.payload.name,
                    ReceiverId:action.payload.id,
                    ConvoId:action.payload.convoid,
                    ReceiverImage:action.payload.url
                }
        }

      }
      
      

const[state,dispatch] = useReducer(receiverProvider,INITIAL_STATE)

  return (
     <receiverContext.Provider value={{receiverData:state,dispatch}}>
        {children}
     </receiverContext.Provider>
  )
}

export default ReceiverProvider