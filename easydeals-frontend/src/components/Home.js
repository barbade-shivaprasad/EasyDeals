import { Container } from "@mui/system";
import React from "react";
import ChatList from "./ChatList";
import Deal from "./Deal";
import Profile from "./Profile";
import UploadDeal from "./UploadDeal";
import Chat from './Chat'
import transport from "../methods/transport";
import { useDispatch,useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useState } from "react";
import { display } from "../methods/styling";
import { socket } from "../methods/socket";
import { useNavigate } from "react-router-dom";



const Home = ({notify}) => {

  const {id} = useParams();
  
  const dispatch = useDispatch();
  const {setAllDeals} = bindActionCreators(actionCreators,dispatch);
  const allDeals = useSelector((state)=>state.allDeals);
  const userDetails = useSelector((state)=>state.userR)

  const navigate = useNavigate()
  const [flag,setFlag] = useState(false);
  const getallDeals=async()=>{
      try {
        document.getElementById('alldeals').scrollTop=0;
        display('progress','block');
        setFlag(false)
        let res = await transport.post('http://localhost:5000/getalldeals');
        console.log(res.data)
        if(res.status !== 202){
          setAllDeals(res.data);
          display('progress','none')
        }
        else
        throw new Error(res.data)
      } catch (error) {
        display('progress','none')
        notify('error',error.message);
      }
  }

  

  const getDeal=async()=>{
    try {
      let res = await transport.post('http://localhost:5000/getdealdata',{id:id});
      console.log(res.data)
      if(res.status !== 202)
      setAllDeals(res.data);
    } catch (error) {
      notify('error',error.message);
    }
  }

  React.useEffect(() => {

    if(!id){
      getallDeals();
    }
    else{
      setFlag(true)
      getDeal();
    }
  }, [])
  
  

  return (
    <Container
      maxWidth="xl"
      sx={{
        // border: "2px solid #dacfcf",
        // paddingLeft: "6em !important",
        marginTop: "10px",
        borderRadius: "6px",
        display:"flex",
        justifyContent:"center"
      }}
    >

      <Profile/>
      <div style={{maxHeight:"90vh",overflow:"scroll",minWidth:"600px"}} id="alldeals">
      {allDeals?.map((item)=>{
        return <>{item.createdBy != userDetails._id?<Deal item={item} notify={notify}/>:""}</>
      })}
      {flag?<center><Button 
       variant="contained"
       color="success"

       onClick={e=>{navigate('/');getallDeals()}}
       >
        Show all deals
      </Button></center>:""}
        {allDeals.length == 0?<center><h2 style={{margin:"20px"}}>No deals available</h2></center>:""}
      </div>
      <UploadDeal notify={notify}/>


      
    </Container>
  );
};

export default Home;
