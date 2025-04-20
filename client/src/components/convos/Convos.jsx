import React, { useCallback, useContext, useEffect, useState } from "react";
import "./convos.css";
import SingleConvo from "../SingleConvo/SingleConvo";
import { userContext } from "../../contextApi/Usercontext";
import { userRequest } from "../../ApiCalls";
import ConvosLoader from "../ui/convosLoader/ConvosLoader";
import { receiverContext } from "../../contextApi/ReceiverProvider";

const Convos = () => {
  // const [convos, setConvos] = useState([]);
  const { data } = useContext(userContext);
  const {receiverData,dispatch} = useContext(receiverContext);
  const [loading, setLoading] = useState(false);
  const [chattingTo, setChattingTo] = useState("");

console.log("receiverData",receiverData)

const fetchConvos = async () => {
  try {
    setLoading(true);
    const res = await userRequest.get(`/chat/${data.userDetails?._id}`);
    dispatch({
      type:"ADD_CONVOS",
      payload:res.data?.data
    })
    // setConvos(res.data?.data);
  } catch (err) {
    console.log(err);
  }finally{
    setLoading(false);
  }
};

  useEffect(() => {
    if(data.token){
      fetchConvos();
    }
  }, [data.token]);

  return (
    <div className="convos_container">
      {loading ? (
        <ConvosLoader />
      ) : receiverData?.Convos?.length == 0 ? (
        <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
          <p style={{ color: "rgb(98, 97, 97)" }}>
            You have no conversations yet
          </p>
        </div>
      ) : (
        receiverData?.Convos?.map((item) => (
          <SingleConvo
            key={item._id}
            item={item}
            setChattingTo={setChattingTo}
            chattingTo={chattingTo}
          />
        ))
      )}
    </div>
  );
};

export default Convos;
