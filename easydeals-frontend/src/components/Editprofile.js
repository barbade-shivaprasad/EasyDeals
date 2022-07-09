import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { actionCreators } from "../state";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Verify from "./Verify";
import React, { useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import transport from "../methods/transport";
import { display } from "../methods/styling";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Editprofile({ notify }) {
  const dispatch = useDispatch();

  const [file, setFile] = useState("");

  const Input = styled("input")({
    display: "none",
  });


  const navigate = useNavigate();
    const { setUserDetails } = bindActionCreators(actionCreators, dispatch);
  const [verifyotp, setverifyotp] = useState(false);
  const userDetails = useSelector((state) => state.userR);

  const getuserdata = async () => {
    try {
      let res = await transport.post("http://localhost:5000/getpersonaldata");
      console.log(res.data);
      // if(res.status !== 202)
      setUserDetails(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = useSelector((state)=>state.authenticated)
  React.useEffect(() => {

    if(!isAuthenticated)
    navigate('/');

    getuserdata();
  }, [isAuthenticated]);

  const phoneRegExp = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Fullname is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(phoneRegExp, "phone number is not valid"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });


 

  const submitHandler = async (e) => {
    try {

      display('progress','block')
      e.preventDefault();
          
      const uploadData = new FormData();
      uploadData.append("name", userDetails.name);
      uploadData.append("email", userDetails.email);
      uploadData.append("password", userDetails.password);
      uploadData.append("phone", userDetails.phone);
      uploadData.append('successfulDeals',userDetails.successfulDeals)
      uploadData.append("file", file);

      let res = await transport.post(
        "http://localhost:5000/editprofile",
        uploadData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      if (res.status !== 202) {notify("success", "Profile updated successfully");
      display('progress','none')
      navigate('/')
      window.location.reload();
      }
      else
      throw new Error(res.data)
    } catch (error) {
      display('progress','none')
      notify("error", "something went wrong!");
    }
  };


  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          maxWidth="xs"
          style={{ marginBottom: "6rem" }}
        >
          <div className="loginContainer">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 0.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
              <Typography component="h1" variant="h5">
                Edit Profile
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 1,width:"320px",margin:"2px solid black"}}
                onSubmit={e=>submitHandler(e)}
                id="editprofile"
              >
                <div class="form-group">
                  <label for="exampleInputEmail1">Full name</label>
                  <input
                    type="text"
                    class="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    {...register("name")}
                    value={userDetails.name}
                    onChange={e=>setUserDetails({...userDetails,name:e.target.value})}
                  />
                  <small id="emailHelp" class="form-text text-muted">
                    {errors.name?.message}
                  </small>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input
                    type="text"
                    class="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    disabled={true}
                    {...register("email")}
                    value={userDetails.email}
                    onChange={e=>setUserDetails({...userDetails,email:e.target.value})}
                  />
                  <small id="emailHelp" class="form-text text-muted">
                    {errors.email?.message}
                  </small>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Phone</label>
                  <input
                    type="number"
                    class="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter phone"
                    {...register("phone")}
                    value={userDetails.phone}
                    onChange={e=>setUserDetails({...userDetails,phone:e.target.value})}
                  />
                  <small id="emailHelp" class="form-text text-muted">
                    {errors.phone?.message}
                  </small>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter password"
                    {...register("password")}
                    value={userDetails.password}
                    onChange={e=>setUserDetails({...userDetails,password:e.target.value})}
                  />
                  <small id="emailHelp" class="form-text text-muted">
                    {errors.password?.message}
                  </small>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Confirm password</label>
                  <input
                    type="text"
                    class="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter confirm password"
                    {...register("confirmPassword")}
                  />
                  <small id="emailHelp" class="form-text text-muted">
                    {errors.confirmPassword?.message}
                  </small>
                </div>

                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                  add Image
                </label>
                <div>
                  <small color="blue">{file.name}</small>
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, border: "none", outline: "none" }}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </div>
        </Container>
      </ThemeProvider>
    </>
  );
}
