import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import "./Trash.css";
import { useStateValue } from "./StateProvider";
import TrashData from "./TrashData";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { db } from "./firebase";
import { useStyles } from "@material-ui/pickers/views/Calendar/SlideTransition";
import { useHistory } from "react-router-dom";

function Trash() {
  const [{ user }] = useStateValue();
  const [trash, setTrash] = useState([]);

  const history = useHistory();
  if (!user) history.push("/login");

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("trash")
        .onSnapshot((snapshot) =>
          setTrash(snapshot.docs.map((note) => note.data()))
        );
    }
  }, [user]);

  const [snackPackDelete, setSnackPackDelete] = React.useState([]);
  const [openDeleteSnackBar, setOpenDeleteSnackBar] = React.useState(false);
  const [messageInfoDelete, setMessageInfoDelete] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPackDelete.length && !messageInfoDelete) {
      // Set a new snack when we don't have an active one
      setMessageInfoDelete({ ...snackPackDelete[0] });
      setSnackPackDelete((prev) => prev.slice(1));
      setOpenDeleteSnackBar(true);
    } else if (
      snackPackDelete.length &&
      messageInfoDelete &&
      openDeleteSnackBar
    ) {
      // Close an active snack when a new one is added
      setOpenDeleteSnackBar(false);
    }
  }, [snackPackDelete, messageInfoDelete, openDeleteSnackBar]);

  const handleClickDelete = (message) => () => {
    setSnackPackDelete((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
  };

  const handleCloseDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteSnackBar(false);
  };

  const handleExitedDelete = () => {
    setMessageInfoDelete(undefined);
  };

  const classes = useStyles();

  return (
    <div className="trash__notes">
      <center>
        <h5 className="trash__message">
          Notes in trash are deleted after 7 days
        </h5>
      </center>
      {trash.length !== 0 ? (
        <div className="display__trash__notes">
          <TrashData
            trashData={trash}
            trash={true}
            displayRestoreSnackBarMessage={handleClickDelete(
              "Restored from trash"
            )}
          />
        </div>
      ) : (
        <span className="no__trash__placeholder">
          <DeleteIcon
            style={{
              fontSize: "10rem",
              opacity: "0.3",
              display: "block",
              margin: "auto",
              width: "50%",
            }}
          />
          <h1>No notes in trash</h1>
        </span>
      )}

      <Snackbar
        key={messageInfoDelete ? messageInfoDelete.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openDeleteSnackBar}
        autoHideDuration={5000}
        onClose={handleCloseDelete}
        onExited={handleExitedDelete}
        message={messageInfoDelete ? messageInfoDelete.message : undefined}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={handleCloseDelete}
              style={{ border: "none", outline: "none" }}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default Trash;
