import React from 'react'
import { Container } from "@mui/system";
import { Avatar } from "@mui/material";
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

export const MyDeal = ({notify,item}) => {
    
    const userDetails = useSelector((state)=>state.userR)
    const [copy,setcopy] = useState("");
    const [color,setcolor] = useState("green");

    console.log(color)
      const initialColor=()=>{
        if(item.status === "incomplete")
        setcolor("red")
        else
        setcolor("green")
      }
    useEffect(()=>{
      initialColor();
    },[item])

    const deleteDeal = async(id)=>{
        try {
            let res = await transport.post('http://localhost:5000/deletedeal',{id:id})
            if(res.status !== 202){
                notify('success','success')
                socket.emit('deletedeal')
            }
            else
            throw new Error('res.data')
        } catch (error) {
            notify('error',error.message);
        }
    }

    return(<Container maxWidth="xs"
    sx={{
      border: "2px solid #dacfcf",
      padding: "0px !important",
      margin:"10px 70px",
      marginTop: "10px",
      borderRadius: "6px",
      height:"default"
    }}
  >
    <div className="dealTop">
      <Avatar
        sx={{ margin: "0px 20px", backgroundColor: getRandomColor() }}
        alt={item.email}
        src={`http://localhost:5000/getimg/${item.email}`}
      />
      <div className="dealCreator">{userDetails.name}</div>
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
      <div className="dealButton" >
        <i
          className="fa-solid fa-trash-can"
          style={{ fontSize: "30px", margin: "5px 10px" }}
          aria-hidden="true"
          onClick={e=>deleteDeal(item.id)}
        ></i>    
      <div style={{marginLeft:"10px"}}>status: </div>
      <b style={{display:"inline",marginLeft:"10px",color:color}}>{item.status}</b>
      </div>
      <CopyToClipboard text={copy}
        onCopy={()=>{setcopy(`http://localhost:3000/${item.id}`);notify('success',"link copied to clipboard")}}
      >
      <span id="shareIcon"><ShareIcon sx={{ float: "right", margin: "20px" }} /></span>
      </CopyToClipboard>
    </div>
  </Container>)
}
