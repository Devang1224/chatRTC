import React, { useContext, useState } from 'react'
import "./searchresult.css"
import { userRequest } from '../../ApiCalls'
import { userContext } from '../../contextApi/Usercontext'
import Loader from '../ui/loader/Loader'
import { receiverContext } from '../../contextApi/ReceiverProvider'

const Searchresult = (props) => {

  const {data} = useContext(userContext);
  const {dispatch} = useContext(receiverContext);
  const [isLoading,setIsLoading] = useState(false);
  const partnerId = props.id;



  const handleClick = async()=>{ 
    setIsLoading(true);
    try{
      
      if(partnerId!==data.userDetails?._id){
         const res = await userRequest.post("/chat/conversation",{partnerId:partnerId,createrId:data?.userDetails?._id});
         dispatch({
          type:"PUSH_NEW_CONVO",
          payload:res.data?.data
         })
        }
    }

    catch(err){
      console.log(err);
    }
    props.box(false);
    setIsLoading(false);
  }

  return (

    <div className='searchresult_container' onClick={handleClick}>
       { isLoading?(<Loader/>):(<>
            <img src={props.url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"}/>
            <p>{props.username}</p></>)
       }
    </div>
  )
  }

export default Searchresult