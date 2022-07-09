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
import { useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import { display } from "../methods/styling";
import { Link as Lk } from "react-router-dom";


const theme = createTheme();

export default function Login({ notify }) {
  const dispatch = useDispatch();

  const Input = styled("input")({
    display: "none",
  });

  const { setUserDetails } = bindActionCreators(actionCreators, dispatch);
  const [verifyotp, setverifyotp] = useState(false);
  const [file,setFile] = useState("")

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

  const submitHandler = async (data) => {
    console.log(data.email);
    data.successfulDeals = 0;
    display('progress','block')
    // let uploadData = new FormData(data);
    // console.log(uploadData);
    setUserDetails(data);
    // setUserDetails({
    //   email:data.email,
    //   name:data.name,
    //   password:data.password,
    //   phone:data.mobile
    // });

    try {
      let res = await axios.post("http://localhost:5000/sendmail", {
        email: data.email,
        shouldExist: false,
      });

      if (res.status !== 200) throw new Error(res.data);
      notify("success", `otp has been sent to ${data.email}`);
      setverifyotp(true);
      display('progress','none')
    } catch (err) {
      notify("error", err.message);
      display('progress','none')
    }
  };

  if (verifyotp) return <Verify notify={notify} file={file}/>;

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
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 1 }}
                onSubmit={handleSubmit(submitHandler)}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  aria-required
                  {...register("name")}
                  error={errors.name ? true : false}
                  helperText={errors.name?.message}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  aria-required
                  type="email"
                  {...register("email")}
                  error={errors.email ? true : false}
                  helperText={errors.email?.message}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label="Phone number"
                  name="phone number"
                  autoComplete="phone"
                  aria-required
                  {...register("mobile")}
                  error={errors.mobile ? true : false}
                  helperText={errors.mobile?.message}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  {...register("password")}
                  error={errors.password ? true : false}
                  helperText={errors.password?.message}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  id="confirm password"
                  label="Confirm password"
                  name="confirm password"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword ? true : false}
                  helperText={errors.confirmPassword?.message}
                />
                <label htmlFor="icon-button-file">
                  <Input accept="image/*" id="icon-button-file" type="file" onChange={(e) => setFile(e.target.files[0])}/>
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
                  Next
                </Button>
                <Grid container>
                  <Grid item>
                    <Lk to={'/login'}><Link variant="body2">{"Already have an account? "}</Link>
                    <Link variant="body2">Signin</Link></Lk>
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
