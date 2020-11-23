import React, { useState, useEffect } from "react";
import "./Archives.css";
import { useStateValue } from "./StateProvider";
import ArchiveIcon from "@material-ui/icons/Archive";
import { db } from "./firebase";
import ArchiveData from "./ArchiveData";
import { IconButton, makeStyles, Snackbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

function Archives() {
  const [{ user }] = useStateValue();
  const [archives, setArchives] = useState([]);
  const [pinnedData, setPinnedData] = useState([]);
  const [unpinnedData, setUnpinnedData] = useState([]);

  const history = useHistory();
  if (!user) history.push("/login");

  const [
    displayNoteIdInDeleteSnackBar,
    setDisplayNoteIdInDeleteSnackBar,
  ] = useState("");
  const [
    displayNoteIdInUnarchiveSnackBar,
    setDisplayNoteIdInUnarchiveSnackBar,
  ] = useState("");

  const [snackPackUndoArchive, setSnackPackUndoArchive] = React.useState([]);
  const [openUndoArchiveSnackBar, setOpenUndoArchiveSnackBar] = React.useState(
    false
  );
  const [messageInfoUndoArchive, setMessageInfoUndoArchive] = React.useState(
    undefined
  );

  const [snackPackUndoDelete, setSnackPackUndoDelete] = React.useState([]);
  const [openUndoDeleteSnackBar, setOpenUndoDeleteSnackBar] = React.useState(
    false
  );
  const [messageInfoUndoDelete, setMessageInfoUndoDelete] = React.useState(
    undefined
  );

  const [snackPackDelete, setSnackPackDelete] = React.useState([]);
  const [openDeleteSnackBar, setOpenDeleteSnackBar] = React.useState(false);
  const [messageInfoDelete, setMessageInfoDelete] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPackUndoArchive.length && !messageInfoUndoArchive) {
      // Set a new snack when we don't have an active one
      setMessageInfoUndoArchive({ ...snackPackUndoArchive[0] });
      setSnackPackUndoArchive((prev) => prev.slice(1));
      setOpenUndoArchiveSnackBar(true);
    } else if (
      snackPackUndoArchive.length &&
      messageInfoUndoArchive &&
      openUndoArchiveSnackBar
    ) {
      // Close an active snack when a new one is added
      setOpenUndoArchiveSnackBar(false);
    }
  }, [snackPackUndoArchive, messageInfoUndoArchive, openUndoArchiveSnackBar]);

  const handleClickUndoArchive = (message) => () => {
    setSnackPackUndoArchive((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
  };

  const handleCloseUndoArchive = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenUndoArchiveSnackBar(false);
  };

  const handleExitedUndoArchive = () => {
    setMessageInfoUndoArchive(undefined);
  };

  React.useEffect(() => {
    if (snackPackUndoDelete.length && !messageInfoUndoDelete) {
      // Set a new snack when we don't have an active one
      setMessageInfoUndoDelete({ ...snackPackUndoDelete[0] });
      setSnackPackUndoDelete((prev) => prev.slice(1));
      setOpenUndoDeleteSnackBar(true);
    } else if (
      snackPackUndoDelete.length &&
      messageInfoUndoDelete &&
      openUndoDeleteSnackBar
    ) {
      // Close an active snack when a new one is added
      setOpenUndoDeleteSnackBar(false);
    }
  }, [snackPackUndoDelete, messageInfoUndoDelete, openUndoDeleteSnackBar]);

  const handleClickUndoDelete = (message) => () => {
    handleCloseDelete();
    setSnackPackUndoDelete((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
    db.collection("users")
      .doc(user?.uid)
      .collection("archives")
      .doc(displayNoteIdInDeleteSnackBar.id)
      .set(displayNoteIdInDeleteSnackBar);
    db.collection("users")
      .doc(user?.uid)
      .collection("trash")
      .doc(displayNoteIdInDeleteSnackBar.id)
      .delete();
  };

  const handleCloseUndoDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenUndoDeleteSnackBar(false);
  };

  const handleExitedUndoDelete = () => {
    setMessageInfoUndoDelete(undefined);
  };

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

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("archives")
        .onSnapshot((snapshot) =>
          setArchives(snapshot.docs.map((note) => note.data()))
        );

      db.collection("users")
        .doc(user?.uid)
        .collection("archives")
        .where("isPinned", "==", true)
        .onSnapshot((snapshot) =>
          setPinnedData(snapshot.docs.map((note) => note.data()))
        );

      db.collection("users")
        .doc(user?.uid)
        .collection("archives")
        .where("isPinned", "==", false)
        .onSnapshot((snapshot) =>
          setUnpinnedData(snapshot.docs.map((note) => note.data()))
        );
    }
  }, [user]);

  return (
    <div className="archived__notes">
      {archives.length !== 0 ? (
        <div className="display__archived__notes">
          <ArchiveData
            archivedData={archives}
            pinnedData={pinnedData}
            unpinnedData={unpinnedData}
            displayUnarchivedSnackBarMessage={handleClickUndoArchive(
              "Note Unarchived"
            )}
            setDisplayNoteIdInDeleteSnackBar={(data) =>
              setDisplayNoteIdInDeleteSnackBar(JSON.parse(JSON.stringify(data)))
            }
            setDisplayNoteIdInUnarchiveSnackBar={(data) =>
              setDisplayNoteIdInUnarchiveSnackBar(
                JSON.parse(JSON.stringify(data))
              )
            }
            displayDeletedSnackBarMessage={handleClickDelete("Moved to trash")}
          />
        </div>
      ) : (
        <span className="no__archives__placeholder">
          <ArchiveIcon
            style={{
              fontSize: "10rem",
              opacity: "0.3",
              display: "block",
              margin: "auto",
              width: "50%",
            }}
          />
          <h1>Your archived notes appear here</h1>
        </span>
      )}

      <Snackbar
        key={messageInfoUndoArchive ? messageInfoUndoArchive.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openUndoArchiveSnackBar}
        autoHideDuration={5000}
        onClose={handleCloseUndoArchive}
        onExited={handleExitedUndoArchive}
        message={
          messageInfoUndoArchive ? messageInfoUndoArchive.message : undefined
        }
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={handleCloseUndoArchive}
              style={{ border: "none", outline: "none" }}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />

      <Snackbar
        key={messageInfoUndoDelete ? messageInfoUndoDelete.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openUndoDeleteSnackBar}
        autoHideDuration={5000}
        onClose={handleCloseUndoDelete}
        onExited={handleExitedUndoDelete}
        message={
          messageInfoUndoDelete ? messageInfoUndoDelete.message : undefined
        }
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={handleCloseUndoDelete}
              style={{ border: "none", outline: "none" }}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />

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
            <Button
              color="inherit"
              size="small"
              onClick={handleClickUndoDelete("Restored from trash")}
              style={{ border: "none", outline: "none" }}
            >
              UNDO
            </Button>
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

export default Archives;
