import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Button, Divider } from "@mui/material";
import { getRandomColor } from "../methods/styling";
import { actionCreators } from "../state";
import { bindActionCreators } from "redux";
import { useSelector,useDispatch } from "react-redux";
import transport from "../methods/transport";
import { socket } from "../methods/socket";

const Chat = ({notify}) => {

    const [chat,setChat] = useState([]);

    let dispatch = useDispatch();

    const {setChatList} = bindActionCreators(actionCreators,dispatch);
    const chatData = useSelector((state)=>state.chatData);
    const userDetails = useSelector((state)=>state.userR);

    const scrollBottom = () => {
      var objDiv = document.querySelector(".chat-body");
      objDiv.scrollTop = objDiv.scrollHeight;
    };

    const confirmDeal=async()=>{
      try {

        
        let res = await transport.post('http://localhost:5000/updatedeal',{id:chatData.dealId,remail:chatData.email});

        if(res.status !== 202)
        {
          notify('success','deal confirmed!');
          window.location.reload();
        }
        else
        throw new Error(res.data)
      } catch (error) {
        console.log(error)
        notify('error','deal not confirmed!');
        
      }
    }


    React.useEffect(() => {
      setChat(chatData.data)
      changeCount(userDetails.email,chatData.email,0);
    }, [chatData])
    

    const changeCount=async(remail,email,flag)=>{
        try {
            let res = await transport.post('http://localhost:5000/changeunreadcount',{remail:remail,email:email,flag:flag});

            if(res.status == 202)
            throw new Error(res.data)
        } catch (error) {
          console.log(error)
        }
    }

    
    socket.off('receiveMessage').on('receiveMessage',async(smail,message)=>{
      
      // let audio = new Audio(tune)
      // audio.play();

      let newMsg = {
        sender:"you",
        message:message
      }
      if(smail === chatData.email){

        let temp = [...chat,newMsg]
        await changeCount(smail,userDetails.email,0);
        await setChat(temp)
      }
    
})


const sendMessage = async(e) => {
  try {

    e.preventDefault();
    let message = document.getElementById("sendMessage-input").value;
    document.getElementById("sendMessage-input").value = "";
    
    let key1 = "sadasdas";

    //console.log("shiva")
    socket.emit("sendMessage", userDetails.email, chatData.email, message,key1);

    let newMsg = {
      sender:"me",
      message:message
    }

    changeCount(chatData.email,userDetails.email,1);
    let temp = [...chat,newMsg]
    setChat(temp)
  } catch (err) {
    
      console.log(err);
  }
};


React.useEffect( () => {
  scrollBottom();
}, [chat]);

    const close=()=>{
      document.querySelector('.chat').style.display = 'none'
    }
  return (
    <div className="chat">
      <div className="chat-head">
        <div className="chat-head-left" style={{display:"inline-flex"}}>
        <Avatar
          sx={{
            margin: "0px 10px",
            backgroundColor: getRandomColor(),
          }}
          alt={chatData.name}
          src={`http://localhost:5000/getimg/${chatData.email}`}
        />
        {chatData.name}
        </div>
        <span style={{ float: "right",display:"inline-block",margin:"20px"}} onClick={close}>
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>
      <Divider/>
      <div className="chat-body">
        {chat?.map((i)=>{
            return <div className={i.sender}>{i.message}</div>
        })}
      </div>
      {chatData.dealId?<Button
      fullWidth
      variant="outlined"
      color="success"
      onClick={e=>confirmDeal()}
      >
        Confirm Deal
      </Button>:""}
      <div className="chat-send" >
        <input type="text" id="sendMessage-input" className="form-control mx-1" placeholder="Type your message" aria-label="message" aria-describedby="basic-addon1"/>
        <SendIcon sx={{
            fontSize:"30px",
            marginRight:"10px"
        }} onClick={e=>sendMessage(e)}/>
      </div>
    </div>
  );
};

export default Chat;
