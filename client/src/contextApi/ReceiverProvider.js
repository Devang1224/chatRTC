import React, { Children, createContext, useReducer } from 'react'


export const receiverContext = createContext()

const ReceiverProvider = ({children}) => {

    const INITIAL_STATE = {
       Convos:[],
       ConvoId:"",
       partnerDetails:{},
       onlineUsers:[]
      }
      

    
      const receiverProvider = (state,action)=>{
        
        switch (action.type){

            case "PARTNER":
                return{
                    ...state,
                    ConvoId:action.payload.convoid,
                    partnerDetails:action.payload.partnerDetails
                }
            case "ADD_CONVOS":
                return{
                    ...state,
                    Convos:action.payload
                }
            case "PUSH_NEW_CONVO":
                return{
                    ...state,
                    Convos:[action.payload,...state.Convos]
                }
            case "UPDATE_CONVO":
                return {
                    ...state,
                    Convos: state.Convos?.map((item) => {
                        if(item._id === action.payload._id) {
                            return {
                                ...item,
                                lastMessage: action.payload.lastMessage,
                                updatedAt: new Date(action.payload.updatedAt)
                            };
                        }
                        return item;
                    }).sort((a, b) => {
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                    })
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