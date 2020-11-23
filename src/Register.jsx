import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import { db, auth } from "./firebase";
import { Link, useHistory } from "react-router-dom";
import "./Register.css";
import { Button, TextField } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

function Register() {
  const [{}, dispatch] = useStateValue();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [usernameInvalid, setUsernameInvalid] = useState(false);

  const [firstnameValid, setFirstnameValid] = useState(false);
  const [lastnameValid, setLastnameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);

  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [firstnameEmpty, setFirstnameEmpty] = useState(false);
  const [lastnameEmpty, setLastnameEmpty] = useState(false);

  const [emailExists, setEmailExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const [userDoc, setUserDoc] = useState([]);

  const [progress, setProgress] = useState(null);

  //useHistory() to redirect to routes
  const history = useHistory();

  //fires once per component mount
  useEffect(() => {
    //this event fires on auth state change - signIn/signOut event
    auth.onAuthStateChanged((authUser) => {
      console.log("User is ", authUser);
      if (authUser) {
        //user has logged in/ state is maintained

        db.collection("users").onSnapshot((snapshot) =>
          setUserDoc(snapshot.docs.map((document) => document.data()))
        );

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

  //this event fires on user registering up
  const signUpUser = (event) => {
    event.preventDefault();

    if (
      firstnameValid &&
      lastnameValid &&
      emailValid &&
      usernameValid &&
      passwordValid
    ) {
      //registering user with email and password
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          setProgress(<LinearProgress style={{ width: "95%" }} />);
          if (authUser) {
            authUser.user
              .updateProfile({
                displayName: username,
              })
              .then(() => {
                db.collection("users").doc(authUser.user.uid).set({
                  uid: authUser.user.uid,
                  firstname: firstname,
                  lastname: lastname,
                  email: email,
                  username: username,
                });
                setTimeout(() => {
                  history.push("/login");
                }, 3000);
              });
          }
        })
        .catch((error) => alert(error.message));
    } else {
      if (firstname.trim() === "") setFirstnameEmpty(true);
      else setFirstnameValid(true);

      if (lastname.trim() === "") setLastnameEmpty(true);
      else setLastnameValid(true);

      if (email.trim() === "") setEmailEmpty(true);
      else if (!email.includes("@") || !email.endsWith(".com"))
        setEmailInvalid(true);
      else {
        let exists = false;
        userDoc.map((doc) => {
          if (doc.email === email) exists = true;
        });
        if (exists) setEmailExists(true);
        else setEmailValid(true);
      }

      if (username.trim() === "") setUsernameEmpty(true);
      else {
        let exists = false;
        userDoc.map((doc) => {
          if (doc.username === username) exists = true;
        });
        if (exists) setUsernameExists(true);
        else setUsernameValid(true);
      }

      if (password.trim() === "") setPasswordEmpty(true);
      else if (password.length < 6 || !password.includes(/[a-zA-Z0-9]/g))
        setPasswordInvalid(true);
      else setPasswordValid(true);
    }

    console.log("user has registered succesfully");
  };

  return (
    <div className="register__block">
      {progress}
      <div className="register">
        <div className="register__left">
          <div className="register__page__title__section">
            <img
              className="register__page__logo"
              src="https://logo-logos.com/wp-content/uploads/2016/11/Google_logo_logotype.png"
              alt="registerpagelogo"
            />
            <h4>Create your Google Account</h4>
          </div>
          <form className="register__form">
            <div className="register__form__head">
              {!firstnameEmpty ? (
                <TextField
                  id="firstname__register"
                  label="First Name"
                  className="form__input"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setFirstname(e.target.value)}
                  defaultValue={firstname}
                  style={{ margin: "10px" }}
                  disabled={progress}
                />
              ) : (
                <TextField
                  error
                  variant="outlined"
                  label="First Name"
                  className="form__input"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="First Name is required"
                  onFocus={() => setFirstnameEmpty(false)}
                  onBlur={() => setFirstnameEmpty(false)}
                />
              )}

              {!lastnameEmpty ? (
                <TextField
                  id="lastname__register"
                  label="Last Name"
                  variant="outlined"
                  className="form__input"
                  size="small"
                  onChange={(e) => setLastname(e.target.value)}
                  defaultValue={lastname}
                  style={{ margin: "10px" }}
                  disabled={progress}
                />
              ) : (
                <TextField
                  error
                  variant="outlined"
                  label="Last Name"
                  className="form__input"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Last Name is required"
                  onFocus={() => setLastnameEmpty(false)}
                  onBlur={() => setLastnameEmpty(false)}
                />
              )}
            </div>
            <div className="register__form__body">
              {!emailEmpty && !emailInvalid && !emailExists ? (
                <TextField
                  id="email__register"
                  className="form-control form__input"
                  label="Your email address"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setEmail(e.target.value)}
                  defaultValue={email}
                  style={{ margin: "10px" }}
                  helperText="You can use letters, numbers & periods."
                  disabled={progress}
                />
              ) : emailEmpty ? (
                <TextField
                  error
                  variant="outlined"
                  label="Your email address"
                  className="form__input form-control"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Email is required"
                  onFocus={() => setEmailEmpty(false)}
                  onBlur={() => setEmailEmpty(false)}
                />
              ) : emailInvalid ? (
                <TextField
                  error
                  variant="outlined"
                  label="Your email address"
                  className="form__input form-control"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Enter a valid email"
                  onFocus={() => setEmailInvalid(false)}
                  onBlur={() => setEmailInvalid(false)}
                />
              ) : (
                <TextField
                  error
                  variant="outlined"
                  label="Your email address"
                  className="form__input form-control"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Email already exists"
                  onFocus={() => setEmailExists(false)}
                  onBlur={() => setEmailExists(false)}
                />
              )}
            </div>
            <div className="register__form__foot__top">
              {!usernameEmpty && !usernameInvalid && !usernameExists ? (
                <TextField
                  id="username__register"
                  label="Username"
                  variant="outlined"
                  className="form__input"
                  size="small"
                  onChange={(e) => setUsername(e.target.value)}
                  defaultValue={username}
                  style={{ margin: "10px" }}
                  disabled={progress}
                />
              ) : usernameEmpty ? (
                <TextField
                  error
                  variant="outlined"
                  label="Username"
                  className="form__input"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Username is required"
                  onFocus={() => setUsernameEmpty(false)}
                  onBlur={() => setUsernameEmpty(false)}
                />
              ) : usernameInvalid ? (
                <TextField
                  error
                  variant="outlined"
                  label="Username"
                  className="form__input"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Enter a valid username"
                  onFocus={() => setUsernameInvalid(false)}
                  onBlur={() => setUsernameInvalid(false)}
                />
              ) : (
                <TextField
                  error
                  variant="outlined"
                  label="Username"
                  className="form__input"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Username already exists"
                  onFocus={() => setUsernameExists(false)}
                  onBlur={() => setUsernameExists(false)}
                />
              )}
              {!passwordEmpty && !passwordInvalid ? (
                <TextField
                  id="password__register"
                  label="Password"
                  type="password"
                  variant="outlined"
                  className="form__input"
                  size="small"
                  onChange={(e) => setPassword(e.target.value)}
                  defaultValue={password}
                  style={{ margin: "10px" }}
                  disabled={progress}
                />
              ) : passwordEmpty ? (
                <TextField
                  error
                  variant="outlined"
                  label="Password"
                  className="form__input"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Password is required"
                  onFocus={() => setPasswordEmpty(false)}
                  onBlur={() => setPasswordEmpty(false)}
                />
              ) : (
                <TextField
                  error
                  variant="outlined"
                  label="Password"
                  className="form__input"
                  size="small"
                  style={{ margin: "10px" }}
                  helperText="Password is invalid"
                  onFocus={() => setPasswordInvalid(true)}
                  onBlur={() => setPasswordInvalid(true)}
                />
              )}
              <p
                className="password__helperText"
                style={{
                  marginLeft: "22px",
                  fontSize: "0.9rem",
                  color: "GrayText",
                  opacity: "0.9",
                }}
              >
                <small>
                  For password, use 8 or more characters with a mix of letters,
                  numbers & symbols.
                </small>
              </p>
            </div>
            <div className="register__form__foot__bottom">
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  color="primary"
                  size="small"
                  disabled={progress}
                  style={{ border: "none", outline: "none" }}
                >
                  Sign In Instead
                </Button>
              </Link>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={signUpUser}
                size="small"
                disabled={progress}
                style={{ border: "none", outline: "none" }}
              >
                Next
              </Button>
            </div>
          </form>
        </div>
        <div className="register__right">
          <img
            className="register__page__image"
            src="https://www.kindpng.com/picc/m/182-1822355_google-account-products-icons-google-account-icon-hd.png"
            alt="googleregisterlogo"
          />
          <p
            style={{
              marginLeft: "6rem",
              marginRight: "6rem",
              marginBottom: "0%",
            }}
          >
            One Account. All of Google
          </p>
          <p style={{ marginLeft: "9rem", marginRight: "9rem" }}>
            working for you.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
