import {
  Checkbox,
  Chip,
  ClickAwayListener,
  FormControlLabel,
  TextareaAutosize,
  Zoom,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./DisplayCard.css";
import DisplayCardNoteOptions from "./DisplayCardNoteOptions";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import RoomIcon from "@material-ui/icons/Room";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

function DisplayCard({
  id,
  previoustitle,
  previousnote,
  previousdisplayTags,
  previousbackgroundColor,
  previousreminderDate,
  previousreminderTime,
  previouspinnedStatus,
  displayDeletedSnackBarMessage,
  setDisplayNoteIdInDeleteSnackBar,
  setDisplayNoteIdInArchiveSnackBar,
  displayArchivedSnackBarMessage,
}) {
  const [{ user, view }] = useStateValue();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [displayTags, setDisplayTags] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [pinnedStatus, setPinedStatus] = useState(false);
  const [displayOptions, setDisplayOptions] = useState(false);

  useEffect(() => {
    if (user) {
      setTitle(previoustitle);
      setNote(previousnote);
      setDisplayTags(previousdisplayTags);
      setReminderDate(previousreminderDate);
      setReminderTime(previousreminderTime);
      setPinedStatus(previouspinnedStatus);
      setBackgroundColor(previousbackgroundColor);
    }
  }, []);

  const remindBy = (date, time) => {
    if (date !== "" && time !== "") return "dateAndTime";
    else if (date !== "" && time === "") return "date";
    else if (date === "" && time !== "") return "time";
    else return "";
  };

  const editExistingNote = () => {
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
        .doc(id)
        .set(
          {
            id: id,
            title: title.trim() !== "" ? title : "Empty Note",
            note: note.trim() !== "" ? note : "Empty Note",
            labels: displayTags,
            reminderDate: reminderDate,
            reminderTime: reminderTime,
            remindBy: remindBy(reminderDate, reminderTime),
            backgroundColor: backgroundColor,
            isPinned: pinnedStatus,
          },
          { merge: true }
        );
    }
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
    setTitle(previoustitle);
    setNote(previousnote);
    setReminderTime(previousreminderTime);
    setReminderDate(previousreminderDate);
    setDisplayTags(previousdisplayTags);
    setBackgroundColor(previousbackgroundColor);
    setPinedStatus(previouspinnedStatus);
  };

  const deleteNote = () => {
    db.collection("users")
      .doc(user?.uid)
      .collection("trash")
      .doc(id)
      .set(
        {
          id: id,
          title: title.trim() !== "" ? title : "Empty Note",
          note: note.trim() !== "" ? note : "Empty Note",
          labels: displayTags,
          reminderDate: reminderDate,
          reminderTime: reminderTime,
          remindBy: remindBy(reminderDate, reminderTime),
          backgroundColor: backgroundColor,
          isPinned: pinnedStatus,
        },
        { merge: true }
      );
    db.collection("users").doc(user?.uid).collection("notes").doc(id).delete();
    setDisplayNoteIdInDeleteSnackBar({
      id: id,
      title: title.trim() !== "" ? title : "Empty Note",
      note: note.trim() !== "" ? note : "Empty Note",
      labels: displayTags,
      reminderDate: reminderDate,
      reminderTime: reminderTime,
      remindBy: remindBy(reminderDate, reminderTime),
      backgroundColor: backgroundColor,
      isPinned: pinnedStatus,
    });
    displayDeletedSnackBarMessage();
  };

  const archiveNote = () => {
    db.collection("users")
      .doc(user?.uid)
      .collection("archives")
      .doc(id)
      .set(
        {
          id: id,
          title: title.trim() !== "" ? title : "Empty Note",
          note: note.trim() !== "" ? note : "Empty Note",
          labels: displayTags,
          reminderDate: reminderDate,
          reminderTime: reminderTime,
          remindBy: remindBy(reminderDate, reminderTime),
          backgroundColor: backgroundColor,
          isPinned: pinnedStatus,
        },
        { merge: true }
      );
    db.collection("users").doc(user?.uid).collection("notes").doc(id).delete();
    setDisplayNoteIdInArchiveSnackBar({
      id: id,
      title: title.trim() !== "" ? title : "Empty Note",
      note: note.trim() !== "" ? note : "Empty Note",
      labels: displayTags,
      reminderDate: reminderDate,
      reminderTime: reminderTime,
      remindBy: remindBy(reminderDate, reminderTime),
      backgroundColor: backgroundColor,
      isPinned: pinnedStatus,
    });
    displayArchivedSnackBarMessage();
  };

  return (
    <ClickAwayListener onClickAway={editExistingNote}>
      <div
        className="display__card"
        onMouseEnter={() => setDisplayOptions(true)}
        onMouseLeave={() => setDisplayOptions(false)}
        style={{
          backgroundColor: backgroundColor,
          width: view === "grid" ? "300px" : "100%",
        }}
      >
        <div className="text__data">
          <div className="display__card__title__component">
            <TextareaAutosize
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className="display__card__title__input"
              value={title}
              autoFocus
              style={{ backgroundColor: backgroundColor }}
            />
            <Zoom in={displayOptions}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="default"
                    id="display__pinned"
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<RoomIcon />}
                    onChange={() => setPinedStatus(!pinnedStatus)}
                    checked={pinnedStatus}
                  />
                }
              />
            </Zoom>
          </div>
          <TextareaAutosize
            placeholder="Take a note..."
            onChange={(e) => setNote(e.target.value)}
            className="display__note__input"
            value={note}
            style={{ backgroundColor: backgroundColor }}
          />
        </div>
        <div className="tags__data">
          {reminderDate !== "" && reminderTime !== "" ? (
            <Chip
              icon={<EventAvailableIcon />}
              label={reminderDate + " at " + reminderTime}
              onClick={handleClick}
              onDelete={handleDelete}
              size="small"
            />
          ) : reminderDate !== "" && reminderTime === "" ? (
            <Chip
              icon={<CalendarTodayIcon />}
              label={reminderDate}
              onClick={handleClick}
              onDelete={handleDelete}
              size="small"
            />
          ) : reminderTime !== "" && reminderDate === "" ? (
            <Chip
              icon={<ScheduleIcon />}
              label={reminderTime}
              onClick={handleClick}
              onDelete={handleDelete}
              size="small"
            />
          ) : null}

          {displayTags.length !== 0
            ? displayTags.map((tag) => (
                <Chip
                  label={tag}
                  onClick={handleTagClick}
                  onDelete={() => handleTagDelete(tag)}
                  size="small"
                />
              ))
            : null}
        </div>
        <Zoom in={displayOptions}>
          <div className="button__options">
            <DisplayCardNoteOptions
              setBackgroundColorValue={(value) => setBackgroundColor(value)}
              addToDisplayTags={(value) => addToDisplayTags(value)}
              setReminderDateValue={(value) => setReminderDate(value)}
              setReminderTimeValue={(value) => setReminderTime(value)}
              reminderDate={reminderDate}
              reminderTime={reminderTime}
              undoData={() => undoData()}
              deleteNote={deleteNote}
              archiveNote={archiveNote}
            />
          </div>
        </Zoom>
      </div>
    </ClickAwayListener>
  );
}

export default DisplayCard;
