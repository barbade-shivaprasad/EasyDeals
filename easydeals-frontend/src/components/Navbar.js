import React from "react";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ForumIcon from "@mui/icons-material/Forum";
import { useSelector , useDispatch} from "react-redux/es/exports";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import transport from '../methods/transport'
import {display} from '../methods/styling'
import { bindActionCreators } from "redux";
import {actionCreators} from '../state'



const Navbar = ({ notify }) => {

  const dispatch = useDispatch();

  const {setAuthenticated} = bindActionCreators(actionCreators,dispatch)

  const changeBlock = () => {
    document.querySelector(".chatList").style.display = "block";
  };


  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout=async()=>{

      try {

        display('progress','block')
        let res = await transport.post('http://localhost:5000/logout')
        
        if(res.status != 202){
          notify('success','successfully logged out')
          setAuthenticated(false)
          navigate('/')
          display('progress','none')
        }
      } catch (error) {
        notify('error','something went wrong!')
        display('progress','none')
      }
  }


  let authenticated = useSelector((state) => state.authenticated);
  let userDetails = useSelector((state)=>state.userR)
  return (
    <nav className="navbar navbar-light bg-light">
      <span className="navbar-brand mb-0 h1 mx-2">
        <Link to="/"><span style={{ fontFamily: "Caveat, cursive", color: "#990000" }}>
          Easy{" "}
          <span style={{ fontFamily: "Comfortaa,cursive", color: "#00008B" }}>
            Deals
          </span>
        </span>
        </Link>
        <form
          class="form-inline my-2 my-lg-0"
          style={{
            display: "inline-flex",
            marginLeft: "20px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={{ border: "none" }}
          />
          <div className="searchIcon mr-sm-2">
            <SearchIcon />
          </div>
        </form>
      </span>
      {authenticated ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i
            className="far fa-comment-dots"
            style={{ marginRight: "10px", fontSize: "30px" }}
            onClick={(e) => changeBlock()}
          ></i>
          <Avatar
            src={`http://localhost:5000/getimg/${userDetails.email}`}
            sx={{ margin: "0 20px" }}

            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          ></Avatar>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}

            sx={{
              margin:"10px -20px"
            }}
          >
            <MenuItem onClick={e=>{handleClose();navigate('/editprofile')}}>Edit profile</MenuItem>
            <MenuItem onClick={e=>{handleClose();navigate('/mydeals')}}>My Deals</MenuItem>
            <MenuItem onClick={e=>{handleClose();navigate('/history')}}>History</MenuItem>
            <MenuItem onClick={e=>{handleClose();logout()}}>Logout</MenuItem>
          </Menu>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <Button variant="contained" size="small" sx={{ margin: "10px" }}>
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="small" variant="contained" color="success">
              Signup
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
