import { GridList } from "@material-ui/core";
import React, { Component, useEffect, useState } from "react";
import { db } from "./firebase";
import "./Notes.css";
import { useStateValue } from "./StateProvider";
import DisplayCardArchives from "./DisplayCardArchives";

const ArchiveData = ({
  archivedData,
  pinnedData,
  unpinnedData,
  setDisplayNoteIdInDeleteSnackBar,
  setDisplayNoteIdInUnarchiveSnackBar,
  displayDeletedSnackBarMessage,
  displayUnarchivedSnackBarMessage,
}) => {
  const [{ user }, dispatch] = useStateValue();
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

  return (
    <div className="notes">
      <div className="notes__display">
        {unpinnedData.length !== 0 && pinnedData.length !== 0 ? (
          <>
            <hr />
            <strong>
              <p>PINNED</p>
            </strong>
          </>
        ) : null}
        <GridList cols={3} cellHeight="auto">
          {pinnedData.map((note) => (
            <DisplayCardArchives
              key={note.id}
              id={note.id}
              previoustitle={note.title}
              previousnote={note.note}
              previousdisplayTags={note.labels}
              previousbackgroundColor={note.backgroundColor}
              previousreminderDate={note.reminderDate}
              previousreminderTime={note.reminderTime}
              previouspinnedStatus={note.isPinned}
              setDisplayNoteIdInDeleteSnackBar={(data) =>
                setDisplayNoteIdInDeleteSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              setDisplayNoteIdInUnarchiveSnackBar={(data) =>
                setDisplayNoteIdInUnarchiveSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              displayDeletedSnackBarMessage={() =>
                displayDeletedSnackBarMessage()
              }
              displayUnarchivedSnackBarMessage={() =>
                displayUnarchivedSnackBarMessage()
              }
            />
          ))}
        </GridList>

        {unpinnedData.length !== 0 && pinnedData.length !== 0 ? (
          <>
            <hr />
            <strong>
              <p>OTHERS</p>
            </strong>
          </>
        ) : null}
        <GridList cols={1} cellHeight="auto">
          {unpinnedData.map((note) => (
            <DisplayCardArchives
              key={note.id}
              id={note.id}
              previoustitle={note.title}
              previousnote={note.note}
              previousdisplayTags={note.labels}
              previousbackgroundColor={note.backgroundColor}
              previousreminderDate={note.reminderDate}
              previousreminderTime={note.reminderTime}
              previouspinnedStatus={note.isPinned}
              setDisplayNoteIdInDeleteSnackBar={(data) =>
                setDisplayNoteIdInDeleteSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              setDisplayNoteIdInUnarchiveSnackBar={(data) =>
                setDisplayNoteIdInUnarchiveSnackBar(
                  JSON.parse(JSON.stringify(data))
                )
              }
              displayDeletedSnackBarMessage={() =>
                displayDeletedSnackBarMessage()
              }
              displayUnarchivedSnackBarMessage={() =>
                displayUnarchivedSnackBarMessage()
              }
            />
          ))}
        </GridList>
      </div>
    </div>
  );
};

export default ArchiveData;
