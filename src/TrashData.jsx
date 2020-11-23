import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  GridList,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import "./Notes.css";
import { useStateValue } from "./StateProvider";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DisplayCardTrash from "./DisplayCardTrash";

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

const TrashData = ({ trashData, displayRestoreSnackBarMessage }) => {
  const [deleteForeverDialog, setDeleteForeverDialog] = useState(false);
  const [deleteForeverNoteId, setDeleteForeverNoteId] = useState("");

  const [{ user }] = useStateValue();
  const [notes, setNotes] = useState([]);

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

  const deleteForeverNote = (id) => {
    setDeleteForeverNoteId(id);
    setDeleteForeverDialog(true);
  };

  const deleteForever = () => {
    db.collection("users")
      .doc(user?.uid)
      .collection("trash")
      .doc(deleteForeverNoteId)
      .delete();
    setDeleteForeverDialog(false);
  };

  return (
    <div className="notes">
      <div className="notes__display">
        <GridList cols={1} cellHeight="auto">
          {trashData.map((note) => (
            <DisplayCardTrash
              key={note.id}
              id={note.id}
              previoustitle={note.title}
              previousnote={note.note}
              previousdisplayTags={note.labels}
              previousbackgroundColor={note.backgroundColor}
              previousreminderDate={note.reminderDate}
              previousreminderTime={note.reminderTime}
              previouspinnedStatus={note.isPinned}
              deleteForeverNote={(id) => deleteForeverNote(id)}
              displayRestoreSnackBarMessage={() =>
                displayRestoreSnackBarMessage()
              }
            />
          ))}
        </GridList>
        <Dialog
          open={deleteForeverDialog}
          onClose={() => setDeleteForeverDialog(false)}
        >
          <DialogTitle>Delete Note</DialogTitle>
          <DialogContent>
            Deleting note from trash would remove it permanently. Would you like
            to continue?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={deleteForever}
              style={{ border: "none", outline: "none" }}
            >
              Delete
            </Button>
            <Button
              onClick={() => setDeleteForeverDialog(false)}
              style={{ border: "none", outline: "none" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default TrashData;
