import { Avatar } from "@mui/material";
import { Box, Container, height } from "@mui/system";
import { useSelector } from "react-redux/es/exports";
import React from "react";
import { getRandomColor } from "../methods/styling";

const Profile = () => {

  let userDetails = useSelector((state)=>state.userR)
 console.log(userDetails)
  return (
    <Box
      component="div"
      id="profile"
      sx={{
        border: "2px solid #dacfcf",
        padding: "0px !important",
        marginTop: "10px",
        borderRadius: "6px",
        width:"20vw",
        height:"300px",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
      }}
    >
        <div className="profile-upper"></div>
        <Avatar 
        
        sx={{
            width:"90px",
            height:"90px",
            position:"relative",
            bottom:"45px",
            backgroundColor:"white"
        }}

        >
            <Avatar src={`http://localhost:5000/getimg/${userDetails.email}`} 
            alt={userDetails.name}
            sx={{
                height:"88px",
                width:"88px",
                backgroundColor:getRandomColor()
            }}
            
            />
        </Avatar>
        <div className="profile-lower">

            <h5>{userDetails.name}</h5>
            <div>{userDetails.email}</div>
            <div>successful Deals :</div>
            <b>{userDetails.successfulDeals}</b>
        </div>
    </Box>
  );
};

export default Profile;
