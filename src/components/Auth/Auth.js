import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./styles";
import Input from "./Input";
// import {GoogleLogin} from "react-google-login";
// import Icon from "./Icon";

import { signin, signup } from '../../actions/auth'

const initialState = {
  firstName: "",
  secondName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    if(isSignup) {
      dispatch(signup(formData, history))
    } else {
      dispatch(signin(formData, history))

    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const token = res?.credential;
    const result = jwt_decode(res?.credential);

    try {
      dispatch({ type: "AUTH", data: { result, token } });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const googleError = (error) => {
    console.log(error);
    alert("Google Sign In was unsuccessful. Try again later");
  };

  // const handleGoogleLogin = useGoogleLogin({
  //   onSuccess: (tokenResponse) => {
  //     console.log("tokenResponse", tokenResponse);
  //     const userObject = jwt_decode(tokenResponse?.access_token, {
  //       header: true,
  //     });
  //     console.log("decoded JWT", userObject);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     alert("Google Sign In was unsuccessful. Try again later");
  //   },
  // });

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          {/* <Button
            className={classes.googleButton}
            color="primary"
            fullWidth
            onClick={handleGoogleLogin}
            // disabled={renderProps.disabled}
            startIcon={<Icon />}
            variant="contained"
          >
            Google Sign In
          </Button> */}
          <Grid container justifyContent="center">
            <Grid item className={classes.googleButton}>
              <GoogleLogin
                // clientId="511124836151-t2fp1c509od005til6olsibrn1a8rnoh.apps.googleusercontent.com"
                // render={(renderProps) => (
                //   <Button
                //     className={classes.googleButton}
                //     color="primary"
                //     fullWidth
                //     onClick={renderProps.onClick}
                //     disabled={renderProps.disabled}
                //     startIcon={<Icon />}
                //     variant="contained"
                //   >
                //     Google Sign In
                //   </Button>
                // )}
                // width={'150px'}
                size="large"
                text="signin_with"
                shape="pill"
                // width='100%'
                onSuccess={googleSuccess}
                onFailure={googleError}
                // cookiePolicy={"single_host_origin"}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
