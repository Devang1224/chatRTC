import React, { useContext, useEffect, useState } from "react";
import "./register.css"
import { Link } from "react-router-dom";
import { userRequest } from "../../ApiCalls";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../contextApi/Usercontext";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { uploadfile } from "./Uploadimage";
import RegisterLoader from "./registerLoader/RegisterLoader";
import * as Yup from "yup";
import { Formik } from 'formik';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { use } from "react";


const RegisterUserSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters long")
    .max(100, "Username must be less than 100 characters")
    .required("Username is required")
    .transform((val) => val.trim()),
  email: Yup.string()
    .matches(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
      "Invalid Email format"
    )
    .transform((val) => val.trim())
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/,
      "Password must be at least 8 characters long, include a special character, and a number"
    )
    .max(100, "Password must be less than 100 characters")
    .required("Password is required")
    .transform((val) => val.trim()),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .max(100, "Password must be less than 100 characters")
    .required("Confirm Password is required")
    .transform((val) => val.trim()),
});

const InitialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const Register = () => {


const [isLoading, setLoading] = useState(false); 
const [imageUrl,setImageUrl] = useState("")
const {dispatch} = useContext(userContext)
const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const data = useContext(userContext);



const handleImage = async(e)=>{
  const file = e.target?.files[0];
  const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
  const maxSizeInBytes = 5 * 1024 * 1024;
  

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
       toast.error("Image size should be less than 1Mb")
     } 

  } 

}


const handleRegisterUser = async(values)=>{



let body = {
  username:values.username.trim(),
  email:values.email.trim(),
  password:values.password.trim(),
}

if(imageUrl){
  body.profilePic = imageUrl;
}

try{

  const res  = await userRequest.post("/auth/register",body);
  
  if(res.data.success){
    toast.success('User registered successfully');
    navigate("/login");
  }
  else{
    toast.error("Error occurred while registering! Try again later");
  }
  console.log("signup data",res)
  
}catch(err){
  console.log("error",err)
  toast.error("Error occurred while registering! Try again later");
}
  //  dispatch({ 
    //   type:"SAVE_USER",
    //   payload:{
      //     username:res.data?.savedUser.username,
      //     userId:res.data?.id,
//     profilePic:imageUrl,
//     token:res.data?.token
//   }
//  })

}

useEffect(()=>{
  if(data?.data?.token){
    navigate("/")
  }
},[data.token])

  return (
    <div className="register_container">
      <div className="form-box">
        <div className="registerform" >
          <span className="title">Sign up</span>
          <span className="subtitle">
            Create a free account with your email.
          </span>
          <div className="userImage_container">
            {isLoading ? (
              <RegisterLoader />
            ) : (
              <div className="image_container">
                <img
                  src={
                    imageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
                  }
                />
                <label
                  htmlFor="uploadPic"
                  className="uploadPic"
                  style={{ cursor: "pointer" }}
                >
                  <CameraAltIcon className="uploadPicIcon" />
                </label>
                <input
                  id="uploadPic"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImage}
                />
              </div>
            )}
          </div>

          <Formik
            initialValues={InitialValues}
            validationSchema={RegisterUserSchema}
            onSubmit={handleRegisterUser}
          >
            {({
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              touched
            }) => {
              return (
                <form className="form-container" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={values.username}
                    onChange={handleChange("username")}
                    onBlur={handleBlur("username")}
                    className="registerinput"
                    placeholder="Enter username"
                  />
                  {(touched.username && errors.username) &&
                    <p className="errorStyles">{errors.username}</p>
                  }
                  <input
                    type="email"
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    className="registerinput"
                    placeholder="Enter email"
                  />
                  {(touched.email && errors.email) &&
                    <p className="errorStyles">{errors.email}</p>
                  }
                  <div style={{
                    display:"flex",
                    alignItems:"center",
                    position:"relative"
                  }}>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    className="registerinput" 
                    placeholder="Enter password"
                    />
                    <span onClick={()=>setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityIcon sx={{
                        fontSize:"1.2rem",
                        color:"white",
                        position:"absolute",
                        right:"10px",
                        cursor:"pointer",
                        top:"50%",  
                        transform:"translateY(-50%)",

                      }}/> : <VisibilityOffIcon sx={{
                        fontSize:"1.2rem",
                        color:"white",
                        position:"absolute",
                        right:"10px",
                        cursor:"pointer",
                        top:"50%",
                        transform:"translateY(-50%)",
                      }}/>}
                    </span>
                  </div>
                  {(touched.password && errors.password) &&
                    <p className="errorStyles">{errors.password}</p>
                  }
                  <div style={{
                    display:"flex",
                    alignItems:"center",
                    position:"relative"
                  }}>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    className="registerinput"
                    placeholder="Confirm password"
                    />

                    <span onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityIcon sx={{
                        fontSize:"1.2rem",
                        color:"white",
                        position:"absolute",
                        right:"10px",
                        cursor:"pointer",
                        top:"50%",
                        transform:"translateY(-50%)",
                      }}/> : <VisibilityOffIcon sx={{
                        fontSize:"1.2rem",
                        color:"white",
                        position:"absolute",
                        right:"10px",
                        cursor:"pointer",
                        top:"50%",
                        transform:"translateY(-50%)",
                      }}/>}
                    </span>
                  </div>
                  {(touched.confirmPassword && errors.confirmPassword) &&
                    <p className="errorStyles">{errors.confirmPassword}</p>
                  }
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing up..." : "Sign up"}
                  </button>
                </form>
              );
            }}
          </Formik>

        </div>

        <div className="form-section">
          <p>
            Have an account? <Link to={"/login"}>Sign in</Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
