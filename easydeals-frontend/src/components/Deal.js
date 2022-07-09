import { Container } from "@mui/system";
import React from "react";
import { Avatar, Badge } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { getRandomColor } from "../methods/styling";
import ShareIcon from "@mui/icons-material/Share";
import {useParams} from 'react-router-dom'
import transport from "../methods/transport";
import { useState,useEffect } from "react";
import { useSelector ,useDispatch} from "react-redux/es/exports";
import { actionCreators } from "../state";
import { bindActionCreators } from "redux";
import { socket } from "../methods/socket";
import {CopyToClipboard} from 'react-copy-to-clipboard';


const Deal = ({item,notify}) => {

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err}`);
  });

  const dispatch = useDispatch();
  const [data, setdata] = useState("")
  const userDetails = useSelector((state)=>state.userR)

  const {setChatData} = bindActionCreators(actionCreators,dispatch);
  const getUserData=async()=>{
    try {
      let res = await transport.post('http://localhost:5000/getuserdata',{email:item.email})
      if(res.status != 202)
      setdata(res.data);
      else
      throw new Error(res.data)
    } catch (error) {
      console.log(error);
    }
  }

  const [copy,setcopy] = useState("");

  useEffect(() => {
    getUserData();
  }, [])
  

  const changeCount=async(remail,email,flag)=>{
    try {
        let res = await transport.post('http://localhost:5000/changeunreadcount',{remail:remail,email:email,flag:flag});

        if(res.status !== 202)
        throw new Error(res.data)
    } catch (error) {
      console.log(error)
    }
}
  const makeDeal=async()=>{
    try {
      if(userDetails.email !== item.email){
        let res = await transport.post('http://localhost:5000/getfriends');
        let flag = 0;
        for(let i = 0;i<res.data.length;i++){
            if(res.data[i].email === item.email)
            flag =1;
        }

        if(flag == 0)
        {
          let res1 = await transport.post('http://localhost:5000/addfriend',{remail:item.email,name:userDetails.name});

          socket.emit('addfriend');
          console.log(res1.data);
        }

        socket.emit('updateDealId',item.email,userDetails.email,item.id)
        socket.emit('sendMessage',userDetails.email,item.email,`Regarding Deal ${item.title}`,'1233')
        changeCount(item.email,userDetails.email,1);

        try {
          
          let res2 = await transport.post('http://localhost:5000/getchat',{remail:item.email})
          
          if(res2.status !== 202)
          setChatData(res2.data.chat);
        } catch (error) {
          console.log(error);
        }

        document.querySelector('.chat').style.display = 'block';

      }
      
    } catch (error) {
      
    }
  }
  return (
    <Container
      maxWidth="xs"
      sx={{
        border: "2px solid #dacfcf",
        padding: "0px !important",
        margin:"10px 70px",
        marginTop: "10px",
        borderRadius: "6px",
      }}
    >
      <div className="dealTop">
        <Avatar
          sx={{ margin: "0px 20px", backgroundColor: getRandomColor() }}
          alt={data.name}
          src={`http://localhost:5000/getimg/${item.email}`}
        />
        <div className="dealCreator">{data.name}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <hr style={{ margin: "0px", width: "90%" }} />
      </div>
      <div className="dealContent">
          <h5>{item.title}</h5>
          <pre>{item.description} </pre>
      </div>
      <div className="dealBody">
        <img src={`http://localhost:5000/getimg/${item.id}`} alt="" />
      </div>
      <div className="dealBottom" >
        <div className="dealButton" onClick={e=>makeDeal()}>
          <i
            class="fa fa-handshake-o"
            style={{ fontSize: "30px", margin: "5px 10px" }}
            aria-hidden="true"
          ></i>
          <div className="dealIcon" > Make Deal</div>
        </div>
        <CopyToClipboard text={copy}
          onCopy={()=>{setcopy(`http://localhost:3000/${item.id}`);notify('success',"link copied to clipboard")}}
        >
        <span id="shareIcon"><ShareIcon sx={{ float: "right", margin: "20px" }} /></span>
        </CopyToClipboard>
      </div>
    </Container>
  );
};

export default Deal;
