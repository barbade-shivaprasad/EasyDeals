import { Avatar, List ,Badge} from "@mui/material";
import React from "react";
import { getRandomColor } from "../methods/styling";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import transport from '../methods/transport'
import { bindActionCreators } from "redux";
import {actionCreators} from '../state';
import { useSelector,useDispatch } from "react-redux";
import { socket } from "../methods/socket";
 
const ChatList = () => {

  const [selectedIndex, setselectedIndex] = React.useState("")
  let dispatch = useDispatch()

  const {setChatList,setChatData} = bindActionCreators(actionCreators,dispatch)
  const chatList = useSelector((state)=>state.chatList)
  const userDetails = useSelector((state)=>state.userR);

  const changeCount=async(remail,email,flag)=>{
    try {
        let res = await transport.post('http://localhost:5000/changeunreadcount',{remail:remail,email:email,flag:flag});

        if(res.status !== 202)
        throw new Error(res.data)
    } catch (error) {
      console.log(error)
    }
}
  const getfriends = async()=>{
      try {
        let res = await transport.post('http://localhost:5000/getfriends')
        
        if(res.status !== 202)
        setChatList(res.data)
      } catch (error) {
        console.log(error);
      }
  }

  const close=()=>{
    document.querySelector('.chatList').style.display = 'none';
  }
  React.useEffect(()=>{
      getfriends();
  },[])

  socket.off('updatefriends').on('updatefriends',getfriends);
const getchat=async(item)=>{
  try {
          
    let res2 = await transport.post('http://localhost:5000/getchat',{remail:item.email})
    
    if(res2.status !== 202)
    setChatData(res2.data.chat);

    console.log(res2.data)
  } catch (error) {
    console.log(error);
  }

  document.querySelector('.chat').style.display = 'block';
}
  
  return (
    <div className="chatList">
      <div className="chatlist-top">
        <span style={{display:"inline-block",margin:"20px",fontWeight:"bold"}}>Messaging</span>
        <span style={{ float: "right",display:"inline-block",margin:"20px"}}>
          <i class="fa-solid fa-xmark" onClick={e=>close()}></i>
        </span>
      </div>
      <Divider/>
      <div className="chatlist-body">
        <List>
          {chatList?.map((item,index) => {
            return <ListItem disablePadding>
              <ListItemButton selected={selectedIndex === index} onClick={e=> {setselectedIndex(index);getchat(item);changeCount(item.email,userDetails.email,0);getfriends()}} >
                <ListItemIcon>
                <Avatar
                    sx={{
                      margin: "0px 10px",
                      backgroundColor: getRandomColor(),
                    }}
                    alt={item.name}
                    src={`http://localhost:5000/getimg/${item.email}`}
                    />
                    
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
              <span style={{display:"inline-block",marginLeft:"20px"}}><Badge color="secondary" badgeContent={item.unreadCount} sx={{marginLeft:"-30px"}}></Badge></span>
              <Divider/>
            </ListItem>;
          })}
        </List>
      </div>
    </div>
  );
};

export default ChatList;
