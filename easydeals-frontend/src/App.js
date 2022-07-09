import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Verify from './components/Verify';
import Deal from './components/Deal';
import Profile from './components/Profile';
import Home from './components/Home';
import UploadDeal from './components/UploadDeal'
import ChatList from './components/ChatList';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chat from './components/Chat'
import { actionCreators } from "./state";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import transport from './methods/transport';
import Landing from './components/Landing';
import {socket} from './methods/socket'
import Editprofile from './components/Editprofile';
import Mydeals from './components/Mydeals';
import Footer from './components/Footer';
import { LinearProgress } from '@mui/material';
import Forgot from './components/Forgot';
import History from './components/HIstory';

function App() {

  const notify = (type,message) =>{
    if(type == 'error')
    toast.error(message)
    else
    toast.success(message)
  };

  const dispatch = useDispatch();
  const authenticated = useSelector((state)=>state.authenticated);
  const {setAuthenticated,setUserDetails} = bindActionCreators(actionCreators,dispatch)
  useEffect(async() => {
    try {
      let res = await transport.post('http://localhost:5000/verifyuser')

      if(res.status !== 202)
      {
        setUserDetails(res.data);
        socket.emit('connected',res.data.email);
        setAuthenticated(true);
      }


    } catch (error) {
      console.log(error.message);
    }
          
  }, [])
  
  
  return (
    <div className="App">
      
      <BrowserRouter>
      <Navbar notify={notify}/>

        <ToastContainer/>
        <LinearProgress id='progress' sx={{position: "sticky",
    top: 0,
    zIndex: 30}}/>
        <Routes>
          <Route path='/' element={authenticated?<Home notify={notify}/>:<Landing/>}/>
          <Route path='/:id' element={authenticated?<Home notify={notify}/>:<Landing/>}/>
          <Route path='/login' element={<Login notify={notify}/>}/>
          <Route path='/signup'  element={<Signup notify={notify}/>}/>
          <Route path='/editprofile'  element={<Editprofile notify={notify}/>}/>
          <Route path='/mydeals'  element={<Mydeals notify={notify}/>}/>
          <Route path='/forgot'  element={<Forgot notify={notify}/>}/>
          <Route path='/history'  element={<History notify={notify}/>}/>
        </Routes>
        <div className="chatContainer">
        <Chat notify={notify}/>
        <ChatList/>
      </div>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
