import React, { useEffect, useState } from "react";
import "./Header.css";
import MenuIcon from "@material-ui/icons/Menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  SwipeableDrawer,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import clsx from "clsx";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import GridOnIcon from "@material-ui/icons/GridOn";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import EditIcon from "@material-ui/icons/Edit";
import ArchiveIcon from "@material-ui/icons/Archive";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth, db } from "./firebase";
import EditLabelsDialogContent from "./EditLabelsDialogContent";
import useDarkMode from "use-dark-mode";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import DnsIcon from "@material-ui/icons/Dns";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

function Header() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [{ user, view, mode }, dispatch] = useStateValue();
  const [labelsDialog, setLabelsDialog] = useState(false);
  //useHistory() to redirect to routes
  const history = useHistory();

  const darkMode = useDarkMode(false);

  const [progress, setProgress] = useState(false);

  //fires once per component mount
  useEffect(() => {
    //this event fires on auth state change - signIn/signOut event
    auth.onAuthStateChanged((authUser) => {
      console.log("User is ", authUser);
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

  if (user) {
    console.log(user.displayName);
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [searchContent, setSearchContent] = useState("");
  const getSearchResults = () => {
    console.log("search results found for ==> ", searchContent);
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <img
            className="header__brand__logo header__options__left__item"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Google_Keep_icon.svg/1024px-Google_Keep_icon.svg.png"
            alt="header brand"
          />
          <h2 className="header__brand__name header__options__left__item">
            Keep
          </h2>
        </ListItem>
        <Divider />
        <Link to="/notes" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <EmojiObjectsIcon />
            </ListItemIcon>
            <ListItemText>Notes</ListItemText>
          </ListItem>
        </Link>
        <Link
          to="/reminders"
          style={{ textDecoration: "none", color: "black" }}
        >
          <ListItem button>
            <ListItemIcon>
              <AddAlertIcon />
            </ListItemIcon>
            <ListItemText>Reminders</ListItemText>
          </ListItem>
        </Link>
        <ListItem button onClick={() => setLabelsDialog(true)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit Labels</ListItemText>
        </ListItem>
        <Link to="/archives" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText>Archives</ListItemText>
          </ListItem>
        </Link>
        <Link to="/trash" style={{ textDecoration: "none", color: "black" }}>
          <ListItem button>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Trash</ListItemText>
          </ListItem>
        </Link>
      </List>
    </div>
  );

  const signOutUser = () => {
    auth.signOut().then(() => history.push("/login"));
  };

  const toggleListAndGridView = () => {
    if (view === "grid") {
      dispatch({
        type: "SET_VIEW",
        view: "list",
      });
    } else if (view === "list") {
      dispatch({
        type: "SET_VIEW",
        view: "grid",
      });
    }
  };

  const refresh = () => {
    setProgress(true);
    setTimeout(() => {
      setProgress(false);
    }, 1000);
  };

  const toggleLightAndDarkMode = () => {
    if (mode === "light") {
      dispatch({
        type: "SET_MODE",
        mode: "dark",
      });
    } else if (mode === "dark") {
      dispatch({
        type: "SET_MODE",
        mode: "light",
      });
    }
  };

  return (
    <div className="header">
      <SwipeableDrawer
        anchor="left"
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
      >
        {list("left")}
      </SwipeableDrawer>

      <Dialog
        open={labelsDialog}
        onClose={() => setLabelsDialog(false)}
        maxWidth="lg"
        scroll="paper"
      >
        <DialogTitle>Edit Labels</DialogTitle>
        <DialogContent>
          <EditLabelsDialogContent />
        </DialogContent>
      </Dialog>

      <div className="header__options">
        <div className="header__options__left__corner">
          <IconButton
            onClick={toggleDrawer("left", true)}
            className="header__menu__toggler header__options__left__item"
            style={{ outline: "none", border: "none" }}
          >
            <MenuIcon />
          </IconButton>
          <img
            className="header__brand__logo header__options__left__item"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Google_Keep_icon.svg/1024px-Google_Keep_icon.svg.png"
            alt="header brand"
          />
          <h2 className="header__brand__name header__options__left__item">
            Keep
          </h2>
          <SearchBar
            className="header__searchbar header__options__left__item"
            value={searchContent}
            onChange={(value) => setSearchContent(value)}
            onRequestSearch={getSearchResults}
          />
        </div>
        <div className="header__options__right__corner">
          {progress ? (
            <CircularProgress />
          ) : (
            <IconButton
              className="header__refresh"
              onClick={refresh}
              style={{ outline: "none", border: "none" }}
            >
              <CloudDoneIcon />
            </IconButton>
          )}
          <IconButton
            className="header__display__toggler"
            onClick={toggleListAndGridView}
            style={{ outline: "none", border: "none" }}
          >
            {view === "grid" ? <DnsIcon /> : <GridOnIcon />}
          </IconButton>
          <IconButton
            className="header__darkmode__toggler"
            onClick={toggleLightAndDarkMode}
            style={{ outline: "none", border: "none" }}
          >
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <IconButton
            className="header__signout"
            onClick={signOutUser}
            style={{ outline: "none", border: "none" }}
          >
            <AccountCircleIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Header;
