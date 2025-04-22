import React, { useContext, useState } from 'react'
import "./searchresult.css"
import { userRequest } from '../../ApiCalls'
import { userContext } from '../../contextApi/Usercontext'
import Loader from '../ui/loader/Loader'
import { receiverContext } from '../../contextApi/ReceiverProvider'

const Searchresult = ({item,setSearchBox}) => {

  const {data} = useContext(userContext);
  const {dispatch} = useContext(receiverContext);
  const [isLoading,setIsLoading] = useState(false);
  const partnerId = item._id;



  const handleClick = async()=>{ 
    setIsLoading(true);
    try{
      
      if(partnerId!==data.userDetails?._id){
         const res = await userRequest.post("/chat/conversation",{partnerId:partnerId,createrId:data?.userDetails?._id});
         console.log('search res',res)
         dispatch({
          type:"PUSH_NEW_CONVO",
          payload:res.data?.data
         })
        }
    }

    catch(err){
      console.log(err);
    }
    setSearchBox(false);
    setIsLoading(false);
  }
console.log("props",item)
  return (

    <div className='searchresult_container' onClick={handleClick}>
       { isLoading?(<Loader/>):(<>
  <div
          className="user_avatar"
          style={{ background: item?.profileGradient }}
        >
          {item?.username?.charAt(0).toUpperCase()}
        </div>
            <p>{item.username}</p></>)
       }
    </div>
  )
  }

export default Searchresult