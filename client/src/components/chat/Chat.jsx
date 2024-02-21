import React, { useContext, useState } from 'react'
import "./chat.css"
import { userContext } from '../../contextApi/Usercontext'
import DeleteIcon from '@mui/icons-material/Delete';
import { userRequest } from '../../ApiCalls';

const Chat = (props) => {

  const {data} = useContext(userContext)
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete= async()=>{
        setIsDeleted(true)
        try{
        const res = await userRequest.post(`/chat/messages/${props.messageId}`).then(()=>{}).catch((err)=>{console.log(err);})
        }
        catch(err)
        {
          console.log(err);
        }
      }


  return (

    <div className="userChat">

      {isDeleted?<div className='deletedMessage'>
                  message deleted
      </div>
      :
      (<>
      <div className='chatContent'>
     { (props.id==data.UserId) && <button className='trashChat' onClick={handleDelete}><DeleteIcon className='trash_icon'/></button>}
        <p>{props.text}</p>
      </div>

        <img src={props.url || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"} alt="" />
      </>)
      
      }

     </div>
  )
}

export default Chat