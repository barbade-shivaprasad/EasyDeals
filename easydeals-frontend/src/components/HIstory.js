import React, { useEffect, useState } from 'react'
import { Table } from "@mui/material";
import { TableBody } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableContainer } from "@mui/material";
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useSelector } from 'react-redux';
import transport from '../methods/transport';
import {Container} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HIstory = () => {

    const navigate = useNavigate();
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));


      const userDetails = useSelector((state)=>state.userR);

      const [history,setHistory] = useState([]);

      console.log(history)

      const getHistory=async()=>{
            try {
                let res = await transport.post('http://localhost:5000/gethistory',{id:userDetails._id})

                if(res.status !== 202)
                {
                    setHistory(res.data);
                }
                else 
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
      }


      const isAuthenticated = useSelector((state)=>state.authenticated)

      useEffect(()=>{

        getHistory()
      },[userDetails])

      useEffect(()=>{
        if(!isAuthenticated)
    navigate('/');
      },[])



  return (
    <Container maxWidth="md" id="top" sx={{minHeight:"70vh"}}>
      <center><h2 style={{margin:"40px"}}>History</h2></center>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell >TITLE</StyledTableCell>
            <StyledTableCell >CREATED BY</StyledTableCell>
            <StyledTableCell >MADE WITH</StyledTableCell>
            <StyledTableCell >STATUS</StyledTableCell>
            <StyledTableCell >DATE</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {history?.map((item)=>{
              return (
                <StyledTableRow key={4555}>
                <StyledTableCell >{item.title}</StyledTableCell>
                <StyledTableCell >{item.email}</StyledTableCell>
                <StyledTableCell >{item.dealer?item.dealer:"-"}</StyledTableCell>
                <StyledTableCell >{item.status}</StyledTableCell>
                <StyledTableCell >{item.dealDate?item.dealDate:"-"}</StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    {!history.length?<center><h3 style={{margin:"30px"}}>No Deals made</h3></center>:""}
    </Container>
  )
}

export default HIstory