import React, { useContext, useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { userRequest } from "../../ApiCalls";
import { userContext } from "../../contextApi/Usercontext";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    await userRequest
      .post("/user/login", { username, password })
      .then((res) => {
        dispatch({
          type: "SAVE_USER",
          payload: {
            username: res.data.username,
            id: res.data.id,
            url: res.data.url,
          },
        });
        setError("");
        navigate("/");
      })
      .catch((err) => {
        setError(err?.response?.data);
      });
  };

  return (
    <div className="login_container">
      <form className="loginform" onSubmit={handleSubmit}>
        <p className="form-title">Sign in to your account</p>
        <div className="input-container">
          <input type="text" placeholder="Enter username" required />
          <span></span>
        </div>
        <div className="input-container">
          <input type="password" placeholder="Enter password" required />
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
