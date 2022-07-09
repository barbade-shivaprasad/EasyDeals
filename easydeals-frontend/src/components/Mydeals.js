import { Container } from '@mui/system'
import React, { useEffect } from 'react'
import transport from '../methods/transport'
import { bindActionCreators } from 'redux'
import {actionCreators} from '../state'
import { useSelector,useDispatch } from 'react-redux'
import { MyDeal } from './MyDeal'
import { Grid } from '@mui/material'
import { socket } from '../methods/socket'
import { useNavigate } from 'react-router-dom'

const Mydeals = ({notify}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {setAllDeals} = bindActionCreators(actionCreators,dispatch);
    const userDetails = useSelector((state)=>state.userR);
    const deals = useSelector((state)=>state.allDeals)

    console.log(deals)

    const getDeals=async()=>{
        console.log(userDetails)
        try{
            let res = await transport.post('http://localhost:5000/getmydeals',{id:userDetails._id});
            if(res.status !== 202)
            setAllDeals(res.data);
        }
        catch(err){
            console.log(err);
        }
    }
    const isAuthenticated = useSelector((state)=>state.authenticated)
    useEffect(()=>{

    if(!isAuthenticated)
    navigate('/');

    getDeals();
    },[userDetails])


    socket.off('updateMyDeals').on('updateMyDeals',getDeals);
  return (
    <Container maxWidth="lg" sx={{minHeight:"70vh"}}>
        <center><h2 style={{margin:"20px"}}>My Deals</h2></center>
        <Grid container spacing={2}>
        {deals?.map((item)=>{
        return <Grid item xs={6}>
            <MyDeal item={item} notify={notify}/>
        </Grid>
        })}
        </Grid>
        {deals.length == 0?<h4>No deals</h4>:""}    
        
    </Container>
  )
}

export default Mydeals