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
import { useDispatch,useSelector } from "react-redux";
import { actionCreators } from "../state";
import { bindActionCreators } from "redux";
import Verify1 from "./Verify";

const theme = createTheme();

export default function Update({ notify }) {

    const dispatch = useDispatch()


  const navigate = useNavigate();

  const userDetails = useSelector((state)=>state.userR)

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
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
    try {

      display('progress','block');
      let res = await transport.post("http://localhost:5000/updatepassword", {email:userDetails.email,password:data.password});

      if (res.status != 200) throw new Error(res.data);

      notify("success", "Successfuly reset password please login!");
      display('progress','none');
      navigate('/')
      window.location.reload();
    } catch (error) {
      display('progress','none');
      notify("error", error.message);
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
                New Password
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update Password
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link variant="body2">Forgot password?</Link>
                  </Grid>
                  <Grid item>
                    <Link variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
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
