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
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import transport from "../methods/transport";
import { useState } from "react";
import Update from "./Update";
import { Link as Lk } from "react-router-dom";
import { display } from "../methods/styling";

const theme = createTheme();

export default function Verify1({ notify,file }) {

    
 const [next,setNext] = useState(false)
  const navigate = useNavigate();
  const userR = useSelector((state) => state.userR);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {

      display('progress','block')
      let otp = document.getElementById("otp").value;
      let res = await axios.post("http://localhost:5000/verify", {
        email: userR.email,
        otp: otp,
      });

      if (res.status !== 200) throw new Error(res.data);

      notify("success", "verified");
      display('progress','none')
      setNext(true);
    } catch (error) {
      display('progress','none')
      notify("error", error.message);
    }
  };

  const resendOtp = async () => {
    try {
      let res = await axios.post("http://localhost:5000/sendmail", {
        email: userR.email,
        shouldExist: true,
      });

      if (res.status !== 200) throw new Error(res.data);

      notify("success", `otp has been sent to ${userR.email}`);
    } catch (err) {
      notify("error", err.message);
    }
  };

  if(next)
  return <Update notify={notify}/>

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          maxWidth="xs"
          style={{ marginBottom: "6rem" }}
          sx={{minHeight:"70vh"}}
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
                Verify OTP
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 1 }}
                onSubmit={(e) => submitHandler(e)}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoComplete="otp"
                  autoFocus
                  aria-required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Verify
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Lk to={'#'}><Link variant="body2" onClick={resendOtp}>
                      Resend Otp
                    </Link></Lk>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </div>
        </Container>
      </ThemeProvider>
    </>
  );
}
