import { GridList } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DisplayCard from "./DisplayCard";
import { db } from "./firebase";
import "./Notes.css";
import { useStateValue } from "./StateProvider";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

const RemindersDisplayCards = ({
  reminderDateDocs,
  reminderTimeDocs,
  reminderDateTimeDocs,
}) => {
  const [snackPackArchive, setSnackPackArchive] = React.useState([]);
  const [openArchiveSnackBar, setOpenArchiveSnackBar] = React.useState(false);
  const [messageInfoArchive, setMessageInfoArchive] = React.useState(undefined);

  const [snackPackNewNoteArchive, setSnackPackNewNoteArchive] = React.useState(
    []
  );
  const [
    openNewNoteArchiveSnackBar,
    setOpenNewNoteArchiveSnackBar,
  ] = React.useState(false);
  const [
    messageInfoNewNoteArchive,
    setMessageInfoNewNoteArchive,
  ] = React.useState(undefined);

  const [
    snackPackUndoNewNoteArchive,
    setSnackPackUndoNewNoteArchive,
  ] = React.useState([]);
  const [
    openUndoNewNoteArchiveSnackBar,
    setOpenUndoNewNoteArchiveSnackBar,
  ] = React.useState(false);
  const [
    messageInfoUndoNewNoteArchive,
    setMessageInfoUndoNewNoteArchive,
  ] = React.useState(undefined);

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

  const [{ user }, dispatch] = useStateValue();
  const [notes, setNotes] = useState([]);

  const [newNoteIdInArchiveSnackBar, setNewNoteIdInArchiveSnackBar] = useState(
    {}
  );
  const [
    displayNoteIdInArchiveSnackBar,
    setDisplayNoteIdInArchiveSnackBar,
  ] = useState({});
  const [
    displayNoteIdInDeleteSnackBar,
    setDisplayNoteIdInDeleteSnackBar,
  ] = useState({});

  React.useEffect(() => {
    if (snackPackArchive.length && !messageInfoArchive) {
      // Set a new snack when we don't have an active one
      setMessageInfoArchive({ ...snackPackArchive[0] });
      setSnackPackArchive((prev) => prev.slice(1));
      setOpenArchiveSnackBar(true);
    } else if (
      snackPackArchive.length &&
      messageInfoArchive &&
      openArchiveSnackBar
    ) {
      // Close an active snack when a new one is added
      setOpenArchiveSnackBar(false);
    }
  }, [snackPackArchive, messageInfoArchive, openArchiveSnackBar]);

  const handleClickArchive = (message) => () => {
    setSnackPackArchive((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
  };

  const handleCloseArchive = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenArchiveSnackBar(false);
  };

  const handleExitedArchive = () => {
    setMessageInfoArchive(undefined);
  };

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
    handleCloseArchive();
    setSnackPackUndoArchive((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
    db.collection("users")
      .doc(user?.uid)
      .collection("notes")
      .doc(displayNoteIdInArchiveSnackBar.id)
      .set(displayNoteIdInArchiveSnackBar);
    db.collection("users")
      .doc(user?.uid)
      .collection("archives")
      .doc(displayNoteIdInArchiveSnackBar.id)
      .delete();
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
      .collection("notes")
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

  React.useEffect(() => {
    if (snackPackNewNoteArchive.length && !messageInfoNewNoteArchive) {
      // Set a new snack when we don't have an active one
      setMessageInfoNewNoteArchive({ ...snackPackNewNoteArchive[0] });
      setSnackPackNewNoteArchive((prev) => prev.slice(1));
      setOpenNewNoteArchiveSnackBar(true);
    } else if (
      snackPackNewNoteArchive.length &&
      messageInfoNewNoteArchive &&
      openNewNoteArchiveSnackBar
    ) {
      // Close an active snack when a new one is added
      setOpenNewNoteArchiveSnackBar(false);
    }
  }, [
    snackPackNewNoteArchive,
    messageInfoNewNoteArchive,
    openNewNoteArchiveSnackBar,
  ]);

  const handleClickNewNoteArchive = (message) => () => {
    setSnackPackNewNoteArchive((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
  };

  const handleCloseNewNoteArchive = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenNewNoteArchiveSnackBar(false);
  };

  const handleExitedNewNoteArchive = () => {
    setMessageInfoNewNoteArchive(undefined);
  };

  React.useEffect(() => {
    if (snackPackNewNoteArchive.length && !messageInfoNewNoteArchive) {
      // Set a new snack when we don't have an active one
      setMessageInfoUndoNewNoteArchive({ ...snackPackUndoNewNoteArchive[0] });
      setSnackPackUndoNewNoteArchive((prev) => prev.slice(1));
      setOpenUndoNewNoteArchiveSnackBar(true);
    } else if (
      snackPackUndoNewNoteArchive.length &&
      messageInfoUndoNewNoteArchive &&
      openUndoNewNoteArchiveSnackBar
    ) {
      // Close an active snack when a new one is added
      setOpenUndoNewNoteArchiveSnackBar(false);
    }
  }, [
    snackPackUndoNewNoteArchive,
    messageInfoUndoNewNoteArchive,
    openUndoNewNoteArchiveSnackBar,
  ]);

  const handleClickUndoNewNoteArchive = (message) => () => {
    handleCloseUndoNewNoteArchive();
    setSnackPackUndoNewNoteArchive((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
    db.collection("users")
      .doc(user?.uid)
      .collection("notes")
      .doc(newNoteIdInArchiveSnackBar.id)
      .set(newNoteIdInArchiveSnackBar);
    db.collection("users")
      .doc(user?.uid)
      .collection("archives")
      .doc(newNoteIdInArchiveSnackBar.id)
      .delete();
  };

  const handleCloseUndoNewNoteArchive = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenUndoNewNoteArchiveSnackBar(false);
  };

  const handleExitedUndoNewNoteArchive = () => {
    setMessageInfoUndoNewNoteArchive(undefined);
  };

  const classes = useStyles();

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("notes")
        .onSnapshot((snapshot) =>
          setNotes(snapshot.docs.map((note) => note.data()))
        );
    }
  }, [user]);

  console.log(notes);

  return (
    <div className="notes">
      <div className="notes__display">
        {reminderDateTimeDocs.length !== 0 ? (
          <>
            <hr />
            <strong>
              <p>DATE AND TIME</p>
            </strong>
          </>
        ) : null}
        <GridList cols={1} cellHeight="auto">
          {reminderDateTimeDocs.map((note) => (
            <DisplayCard
              key={note.id}
              id={note.id}
              previoustitle={note.title}
              previousnote={note.note}
              previousdisplayTags={note.labels}
              previousbackgroundColor={note.backgroundColor}
              previousreminderDate={note.reminderDate}
              previousreminderTime={note.reminderTime}
              previouspinnedStatus={note.isPinned}
              displayDeletedSnackBarMessage={handleClickDelete(
                "Moved to trash"
              )}
              setDisplayNoteIdInDeleteSnackBar={(data) =>
                setDisplayNoteIdInDeleteSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              setDisplayNoteIdInArchiveSnackBar={(data) =>
                setDisplayNoteIdInArchiveSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              displayArchivedSnackBarMessage={handleClickArchive(
                "Note Archived"
              )}
            />
          ))}
        </GridList>
        {reminderDateDocs.length !== 0 ? (
          <>
            <hr />
            <strong>
              <p>DATE</p>
            </strong>
          </>
        ) : null}
        <GridList cols={1} cellHeight="auto">
          {reminderDateDocs.map((note) => (
            <DisplayCard
              key={note.id}
              id={note.id}
              previoustitle={note.title}
              previousnote={note.note}
              previousdisplayTags={note.labels}
              previousbackgroundColor={note.backgroundColor}
              previousreminderDate={note.reminderDate}
              previousreminderTime={note.reminderTime}
              previouspinnedStatus={note.isPinned}
              displayDeletedSnackBarMessage={handleClickDelete(
                "Moved to trash"
              )}
              setDisplayNoteIdInDeleteSnackBar={(data) =>
                setDisplayNoteIdInDeleteSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              setDisplayNoteIdInArchiveSnackBar={(data) =>
                setDisplayNoteIdInArchiveSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              displayArchivedSnackBarMessage={handleClickArchive(
                "Note Archived"
              )}
            />
          ))}
        </GridList>
        {reminderTimeDocs.length !== 0 ? (
          <>
            <hr />
            <strong>
              <p>TIME</p>
            </strong>
          </>
        ) : null}
        <GridList cols={1} cellHeight="auto">
          {reminderTimeDocs.map((note) => (
            <DisplayCard
              key={note.id}
              id={note.id}
              previoustitle={note.title}
              previousnote={note.note}
              previousdisplayTags={note.labels}
              previousbackgroundColor={note.backgroundColor}
              previousreminderDate={note.reminderDate}
              previousreminderTime={note.reminderTime}
              previouspinnedStatus={note.isPinned}
              displayDeletedSnackBarMessage={handleClickDelete(
                "Moved to trash"
              )}
              setDisplayNoteIdInDeleteSnackBar={(data) =>
                setDisplayNoteIdInDeleteSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              setDisplayNoteIdInArchiveSnackBar={(data) =>
                setDisplayNoteIdInArchiveSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              displayArchivedSnackBarMessage={handleClickArchive(
                "Note Archived"
              )}
            />
          ))}
        </GridList>
        <Snackbar
          key={messageInfoArchive ? messageInfoArchive.key : undefined}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={openArchiveSnackBar}
          autoHideDuration={5000}
          onClose={handleCloseArchive}
          onExited={handleExitedArchive}
          message={messageInfoArchive ? messageInfoArchive.message : undefined}
          action={
            <React.Fragment>
              <Button
                color="inherit"
                size="small"
                onClick={handleClickUndoArchive("Note Unarchived")}
                style={{ border: "none", outline: "none" }}
              >
                UNDO
              </Button>
              <IconButton
                aria-label="close"
                color="inherit"
                className={classes.close}
                onClick={handleCloseArchive}
                style={{ border: "none", outline: "none" }}
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        />

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

        <Snackbar
          key={
            messageInfoNewNoteArchive
              ? messageInfoNewNoteArchive.key
              : undefined
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={openNewNoteArchiveSnackBar}
          autoHideDuration={5000}
          onClose={handleCloseNewNoteArchive}
          onExited={handleExitedNewNoteArchive}
          message={
            messageInfoNewNoteArchive
              ? messageInfoNewNoteArchive.message
              : undefined
          }
          action={
            <React.Fragment>
              <Button
                color="inherit"
                size="small"
                onClick={handleClickUndoNewNoteArchive("Note Unarchived")}
                style={{ border: "none", outline: "none" }}
              >
                UNDO
              </Button>
              <IconButton
                aria-label="close"
                color="inherit"
                className={classes.close}
                onClick={handleCloseNewNoteArchive}
                style={{ border: "none", outline: "none" }}
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        />

        <Snackbar
          key={
            messageInfoUndoNewNoteArchive
              ? messageInfoUndoNewNoteArchive.key
              : undefined
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={openUndoNewNoteArchiveSnackBar}
          autoHideDuration={5000}
          onClose={handleCloseUndoNewNoteArchive}
          onExited={handleExitedUndoNewNoteArchive}
          message={
            messageInfoUndoNewNoteArchive
              ? messageInfoUndoNewNoteArchive.message
              : undefined
          }
          action={
            <React.Fragment>
              <IconButton
                aria-label="close"
                color="inherit"
                className={classes.close}
                onClick={handleCloseUndoNewNoteArchive}
                style={{ border: "none", outline: "none" }}
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    </div>
  );
};

export default RemindersDisplayCards;
