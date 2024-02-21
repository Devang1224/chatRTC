import React, { useContext, useState } from "react";
import "./register.css"
import { Link } from "react-router-dom";
import { userRequest } from "../../ApiCalls";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../contextApi/Usercontext";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { uploadfile } from "./Uploadimage";
import RegisterLoader from "./registerLoader/RegisterLoader";

const Register = () => {

const [error,setError] = useState("")
const [isLoading, setLoading] = useState(false); 
const[imageUrl,setImageUrl] = useState("")
const {dispatch} = useContext(userContext)
const navigate = useNavigate();




const handleImage = async(e)=>{
  const file = e.target.files[0];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSizeInBytes = 1 * 1024 * 1024;
  

  if (file && allowedTypes.includes(file.type)) {

     if(file.size <= maxSizeInBytes)
     {
      try{
        setLoading(true);
        const url = await uploadfile(file);
        setImageUrl(url)
      }catch(err){
        console.log(err);
      }
      finally{
        setLoading(false);
      }
     }
     else{
       setError("Image size should be less than 1Mb")
     } 

  } 

}


const handleSubmit = async(e)=>{

  e.preventDefault()
  const username = e.target[1].value;
  const email = e.target[2].value
  const password = e.target[3].value;


  // saving user details in mongodb
    await userRequest.post("/user/register",{username,email,password,url:imageUrl}).then((res)=>{
      dispatch({ type: "SAVE_USER", payload: { username: res.data.savedUser.username, id:res.data.id,url:imageUrl } });
       navigate("/");

  }).catch((err)=>{setError(err?.response?.data)});



}

  return (
    <div className="register_container">
      <div className="form-box">
        <form className="registerform" onSubmit={handleSubmit}>
          <span className="title">Sign up</span>
          <span className="subtitle">Create a free account with your email.</span>
          <div className="userImage_container">
            {
              isLoading?<RegisterLoader/>
              :
              (   <div className="image_container">
                        <img src={imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"}/>
                        <label htmlFor = "uploadPic" className="uploadPic" style={{cursor:"pointer"}}>
                           <CameraAltIcon className="uploadPicIcon"/>
                       </label>
                       <input id="uploadPic" type="file" accept="image/*" style={{display:"none"}} onChange={handleImage}/> 
                 </div>)
            }
         
          </div>

        

          <div className="form-container">
            <input type="text" className="registerinput" placeholder="Username" required maxLength={100}/>
            <input type="email" className="registerinput" placeholder="Email" required maxLength={100}/>
            <input type="password" className="registerinput" placeholder="Password" required minLength={10}/>
          </div>

          <button type="submit">Sign up</button>
        </form>
        {
            error && <p style={{color:"red",textAlign:"center"}}>{error}</p>
        }
        <div className="form-section">
          <p>
            Have an account? <Link to={'/login'}>Sign in</Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
