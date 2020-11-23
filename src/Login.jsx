import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "./firebase";
import { useStateValue } from "./StateProvider";
import "./Login.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Avatar,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  TextField,
} from "@material-ui/core";
import clsx from "clsx";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const useStylesPasswordField = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "96.5%",
  },
}));

function Login() {
  const [{}, dispatch] = useStateValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [userDoc, setUserDoc] = useState([]);

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const [progress, setProgress] = useState(false);

  const classesPasswordField = useStylesPasswordField();
  const [values, setValues] = React.useState({
    password: password,
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const usernameComponent = () => {
    return (
      <div className="usernameDetailsComponent">
        <h4>Sign in</h4>
        <p className="username__component__title__msg">
          Use your Google Account
        </p>
        {!emailError && !invalidEmail ? (
          <TextField
            id="email__login"
            label="Your email address"
            className="inputfield"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={progress}
            style={{ border: "black" }}
          />
        ) : emailError ? (
          <TextField
            error
            id="email__error"
            label="Your email address"
            variant="outlined"
            className="inputfield"
            onFocus={() => setEmailError(false)}
            onBlur={() => setEmailError(false)}
            helperText={"Email is required"}
          />
        ) : (
          <TextField
            error
            id="invalid__email"
            label="Your email address"
            variant="outlined"
            className="inputfield"
            value={email}
            onFocus={() => setInvalidEmail(false)}
            onBlur={() => setInvalidEmail(false)}
            helperText={"Enter a valid email"}
          />
        )}
        <p classname="email__component__info">
          <small>Not your computer? Use Guest mode to sign in privately.</small>
        </p>
        <div className="learnmore__button">
          <Button
            size="small"
            color="primary"
            href="https://support.google.com/chrome/answer/6130773?hl=en-GB"
            disabled={progress}
            style={{ border: "none", outline: "none" }}
          >
            Learn more
          </Button>
        </div>
        <div className="username__component__options">
          <Link style={{ textDecoration: "none" }} to="/register">
            <Button
              size="small"
              color="primary"
              disabled={progress}
              style={{ border: "none", outline: "none" }}
            >
              Create Account
            </Button>
          </Link>
          <Button
            variant="contained"
            color="primary"
            onClick={validateUsername}
            disabled={progress}
            style={{ border: "none", outline: "none" }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const passwordComponent = () => {
    return (
      <div className="passwordDetailsComponent">
        <h4>Welcome</h4>
        <center>
          <Chip
            avatar={<Avatar />}
            label={email}
            onClick={handleBack}
            variant="outlined"
            style={{ marginBottom: "10%" }}
            disabled={progress}
          />
        </center>
        {!passwordError ? (
          <FormControl
            className={clsx(
              classesPasswordField.margin,
              classesPasswordField.textField
            )}
            variant="outlined"
            disabled={progress}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? "text" : "password"}
              onChange={handleChange("password")}
              value={values.password}
              className="inputfield"
              disabled={progress}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
        ) : (
          <FormControl
            className={clsx(
              classesPasswordField.margin,
              classesPasswordField.textField
            )}
            variant="outlined"
            // error
          >
            <InputLabel htmlFor="outlined-adornment-password-error">
              Password
            </InputLabel>
            <OutlinedInput
              error
              id="outlined-adornment-password-error"
              type={values.showPassword ? "text" : "password"}
              onFocus={() => setPasswordError(false)}
              className="inputfield"
              onBlur={() => setPasswordError(false)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
            <p style={{ color: "red", marginLeft: "5%", marginBottom: "0%" }}>
              <small>Password is required</small>
            </p>
          </FormControl>
        )}
        <div className="submit__button">
          <Button
            color="primary"
            variant="contained"
            onClick={validatePassword}
            disabled={progress}
            style={{ border: "none", outline: "none" }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getSteps() {
    return [usernameComponent, passwordComponent];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return usernameComponent();
      case 1:
        return passwordComponent();
      default:
        return "Unknown step";
    }
  }

  //useHistory() to redirect to routes
  const history = useHistory();

  //fires once per component mount
  useEffect(() => {
    //this event fires on auth state change - signIn/signOut event
    auth.onAuthStateChanged((authUser) => {
      console.log("User is ", authUser);

      db.collection("users").onSnapshot((snapshot) =>
        setUserDoc(snapshot.docs.map((doc) => doc.data()))
      );

      if (authUser) {
        //user has logged in/ state is maintained
        //dispatching/pushing user state to data layer
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        //user has logged out

        //dispatching/pushing user state to data layer
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  const signInUser = () => {
    if (email.trim() !== "" && password.trim() !== "") {
      //signIn user with email and password
      auth
        .signInWithEmailAndPassword(email, password)
        .then((authUser) => {
          if (authUser) history.push("/");
        })
        .catch((error) => {
          alert(error.message);
          history.push("/");
        });
      console.log("user logged in");
    }
  };

  const validateUsername = () => {
    if (email.trim() !== "") {
      let exists = false;
      userDoc.map((doc) => {
        if (doc.email === email) exists = true;
      });

      if (exists) {
        setProgress(true);
        setTimeout(() => {
          setProgress(false);
          handleNext();
        }, 2000);
      } else {
        setProgress(true);
        setTimeout(() => {
          setProgress(false);
          setEmail("");
          setInvalidEmail(true);
        }, 2000);
      }
    } else setEmailError(true);
  };

  const validatePassword = () => {
    if (password.trim() !== "") {
      setProgress(true);
      handleNext();
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="login__block">
      {progress ? (
        <LinearProgress
          style={{ display: "block", margin: "auto", width: "32%" }}
          color="primary"
        />
      ) : null}
      <div className="login">
        <img
          className="login__page__logo"
          src="https://logo-logos.com/wp-content/uploads/2016/11/Google_logo_logotype.png"
          alt="loginpagelogo"
        />
        {activeStep === steps.length ? (
          <>
            <center>
              <h2>Signing in</h2>
            </center>
            {signInUser()}
          </>
        ) : (
          getStepContent(activeStep)
        )}
      </div>
    </div>
  );
}

export default Login;
