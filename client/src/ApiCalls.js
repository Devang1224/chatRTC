import axios from "axios";

const BASE_URL = "http://localhost:3000";
// const BASE_URL = "https://chatrtc-production.up.railway.app/";


export const userRequest = axios.create({
  baseURL: BASE_URL,
});


userRequest.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userRequest.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
    if(error.response.status === 401){
        localStorage.removeItem("user")
        window.location.href = "/login"
    }
    return Promise.reject(error)
    }
)