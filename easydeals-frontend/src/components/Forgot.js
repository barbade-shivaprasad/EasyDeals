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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import transport from "../methods/transport";
import { display } from "../methods/styling";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actionCreators } from "../state";
import { bindActionCreators } from "redux";
import { useState } from "react";
import Verify1 from "./Verify1";

const theme = createTheme();

export default function Forgot({ notify }) {

    const dispatch = useDispatch()


  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });


  const {setUserDetails} = bindActionCreators(actionCreators,dispatch);

  const [verifyotp,setverifyotp] = useState(false)

  const submitHandler = async (data) => {
    try {

      display('progress','block');
      setUserDetails(data)
      let res = await transport.post("http://localhost:5000/sendmail", {email:data.email,shouldExist:true});

      if (res.status != 200) throw new Error(res.data);

      notify("success", "Successfuly sent otp!");
      display('progress','none');
      setverifyotp(true);
    } catch (error) {
      display('progress','none');
      notify("error", error.message);
    }
  };

  if(verifyotp)
  return <Verify1 notify={notify}/>
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
                marginTop: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Forgot Password
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 5 }}
                onSubmit={handleSubmit(submitHandler)}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  aria-required
                  {...register("email")}
                  error={errors.email ? true : false}
                  helperText={errors.email?.message}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 9 }}
                >
                  Next
                </Button>
                
              </Box>
            </Box>
          </div>
        </Container>
      </ThemeProvider>
    </>
  );
}
