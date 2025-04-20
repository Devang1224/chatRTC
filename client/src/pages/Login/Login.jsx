import React, { useContext, useEffect, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { userRequest } from "../../ApiCalls";
import { userContext } from "../../contextApi/Usercontext";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(userContext);
  const data = useContext(userContext);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    try{
    const res = await userRequest.post("/auth/login", { userDetail:username, password });

        await dispatch({
          type: "SAVE_USER",
          payload: {
              userData: res.data?.data?.userData,
              token: res.data?.data?.token,
          },
        });
          setError("");
          navigate("/");
      }catch(err){
        setError(err?.response?.data?.message);
      };
  };

// useEffect(()=>{
//   console.log("data",data)
//   if(data?.data?.token){
//     navigate("/")
//   }
// },[data.token])

  return (
    <div className="login_container">
      <form className="loginform" onSubmit={handleSubmit}>
        <p className="form-title">Sign in to your account</p>
        <div className="input-container">
          <input type="text" placeholder="devang" required />
          <span></span>
        </div>
        <div className="input-container">
          <input type="password" placeholder="devangmehra" required />
        </div>
        {error && (
          <p style={{ color: "#f61818ea", textAlign: "center" }}>{error}</p>
        )}

        <button type="submit" className="submitform">
          Sign in
        </button>

        <p className="signup-link">
          No account?
          <Link to={"/register"}> Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
