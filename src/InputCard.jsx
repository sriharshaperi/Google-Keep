import {
  Checkbox,
  Chip,
  ClickAwayListener,
  FormControlLabel,
  TextareaAutosize,
} from "@material-ui/core";
import React, { useState } from "react";
import "./InputCard.css";
import NoteOptions from "./NoteOptions";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import RoomIcon from "@material-ui/icons/Room";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

const InputCard = ({
  closeCardComponent,
  setNewNoteIdInArchiveSnackBar,
  displayNewNoteArchiveSnackbarMessage,
}) => {
  const [{ user }] = useStateValue();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [displayTags, setDisplayTags] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [pinnedStatus, setPinedStatus] = useState(false);

  const remindBy = (date, time) => {
    if (date !== "" && time !== "") return "dateAndTime";
    else if (date !== "" && time === "") return "date";
    else if (date === "" && time !== "") return "time";
    else return "";
  };

  const saveNote = () => {
    if (
      !(
        title === "" &&
        note === "" &&
        displayTags.length === 0 &&
        backgroundColor === "transparent" &&
        reminderTime === "" &&
        reminderDate === ""
      )
    ) {
      db.collection("users")
        .doc(user?.uid)
        .collection("notes")
        .add({
          title: title.trim() !== "" ? title : "Empty Note",
          note: note.trim() !== "" ? note : "Empty Note",
          labels: displayTags,
          reminderDate: reminderDate,
          reminderTime: reminderTime,
          remindBy: remindBy(reminderDate, reminderTime),
          backgroundColor: backgroundColor,
          isPinned: pinnedStatus,
        })
        .then((document) => document.set({ id: document.id }, { merge: true }))
        .catch((error) => {
          throw error;
        });
    }
    closeCardComponent();
  };

  const handleClick = () => {
    console.log("chip was clicked");
  };

  const handleDelete = () => {
    if (reminderDate !== "" && reminderTime !== "") {
      setReminderDate("");
      setReminderTime("");
    } else if (reminderDate !== "" && reminderTime === "") setReminderDate("");
    else if (reminderTime !== "" && reminderDate === "") setReminderTime("");
  };

  const addToDisplayTags = (value) => {
    const displayTagsArray = [...displayTags];
    if (!displayTagsArray.includes(value)) displayTagsArray.push(value);
    setDisplayTags(displayTagsArray);
  };

  const handleTagClick = () => {
    console.log("tag was clicked");
  };

  const handleTagDelete = (tag) => {
    const displayTagsArray = [...displayTags];
    const tagIndex = displayTagsArray.indexOf(tag);
    displayTagsArray.splice(tagIndex, 1);
    setDisplayTags(displayTagsArray);
  };

  const undoData = () => {
    setTitle("");
    setNote("");
    setReminderTime("");
    setReminderDate("");
    setDisplayTags([]);
    setBackgroundColor("transparent");
    setPinedStatus(false);
  };

  const closeCard = () => {
    closeCardComponent();
  };

  const archiveNote = () => {
    if (
      !(
        title === "" &&
        note === "" &&
        displayTags.length === 0 &&
        backgroundColor === "transparent" &&
        reminderTime === "" &&
        reminderDate === ""
      )
    ) {
      db.collection("users")
        .doc(user?.uid)
        .collection("archives")
        .add({
          title: title.trim() !== "" ? title : "Empty Note",
          note: note.trim() !== "" ? note : "Empty Note",
          labels: displayTags,
          reminderDate: reminderDate,
          reminderTime: reminderTime,
          remindBy: remindBy(reminderDate, reminderTime),
          backgroundColor: backgroundColor,
          isPinned: pinnedStatus,
        })
        .then((document) => {
          document.set({ id: document.id }, { merge: true });
          setNewNoteIdInArchiveSnackBar({
            id: document.id,
            title: title.trim() !== "" ? title : "Empty Note",
            note: note.trim() !== "" ? note : "Empty Note",
            labels: displayTags,
            reminderDate: reminderDate,
            reminderTime: reminderTime,
            remindBy: remindBy(reminderDate, reminderTime),
            backgroundColor: backgroundColor,
            isPinned: pinnedStatus,
          });
          undoData();
        })
        .catch((error) => {
          throw error;
        });
      displayNewNoteArchiveSnackbarMessage();
    }
  };

  return (
    <ClickAwayListener onClickAway={saveNote}>
      <div
        className="card__component"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="input__card">
          <div className="title__component">
            <TextareaAutosize
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className="title__input inputfield"
              value={title}
              autoFocus
              style={{ backgroundColor: backgroundColor }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="default"
                  id="pinned"
                  icon={<CheckBoxOutlineBlankIcon />}
                  checkedIcon={<RoomIcon />}
                  onChange={() => setPinedStatus(!pinnedStatus)}
                  checked={pinnedStatus}
                />
              }
            />
          </div>
          <TextareaAutosize
            placeholder="Take a note..."
            onChange={(e) => setNote(e.target.value)}
            className="note__input inputfield"
            value={note}
            style={{ backgroundColor: backgroundColor }}
          />
          <div className="customizations">
            {reminderDate !== "" && reminderTime !== "" ? (
              <Chip
                icon={<EventAvailableIcon />}
                label={reminderDate + " at " + reminderTime}
                onClick={handleClick}
                onDelete={handleDelete}
              />
            ) : reminderDate !== "" && reminderTime === "" ? (
              <Chip
                icon={<CalendarTodayIcon />}
                label={reminderDate}
                onClick={handleClick}
                onDelete={handleDelete}
              />
            ) : reminderTime !== "" && reminderDate === "" ? (
              <Chip
                icon={<ScheduleIcon />}
                label={reminderTime}
                onClick={handleClick}
                onDelete={handleDelete}
              />
            ) : null}

            {displayTags.length !== 0
              ? displayTags.map((tag) => (
                  <Chip
                    label={tag}
                    onClick={handleTagClick}
                    onDelete={() => handleTagDelete(tag)}
                  />
                ))
              : null}
          </div>
          <NoteOptions
            setBackgroundColorValue={(value) => setBackgroundColor(value)}
            addToDisplayTags={(value) => addToDisplayTags(value)}
            setReminderDateValue={(value) => setReminderDate(value)}
            setReminderTimeValue={(value) => setReminderTime(value)}
            reminderDate={reminderDate}
            reminderTime={reminderTime}
            undoData={() => undoData()}
            closeCard={() => closeCard()}
            archiveNote={() => archiveNote()}
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default InputCard;
