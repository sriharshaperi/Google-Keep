import {
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  TextareaAutosize,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./DisplayCard.css";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import RoomIcon from "@material-ui/icons/Room";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

function DisplayCardTrash({
  id,
  previoustitle,
  previousnote,
  previousdisplayTags,
  previousbackgroundColor,
  previousreminderDate,
  previousreminderTime,
  previouspinnedStatus,
  deleteForeverNote,
  displayRestoreSnackBarMessage,
}) {
  const [{ user, view }] = useStateValue();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [displayTags, setDisplayTags] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [pinnedStatus, setPinedStatus] = useState(false);

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

  const restoreThisNote = () => {
    db.collection("users")
      .doc(user?.uid)
      .collection("notes")
      .doc(id)
      .set({
        id: id,
        title: title,
        note: note,
        labels: displayTags,
        reminderDate: reminderDate,
        reminderTime: reminderTime,
        remindBy: remindBy(reminderDate, reminderTime),
        backgroundColor: backgroundColor,
        isPinned: pinnedStatus,
      });

    db.collection("users").doc(user?.uid).collection("trash").doc(id).delete();
    displayRestoreSnackBarMessage();
  };

  const deleteForeverThisNote = () => {
    deleteForeverNote(id);
  };

  return (
    <div
      className="display__card"
      style={{
        backgroundColor: backgroundColor,
        width: view === "list" ? "100%" : "300px",
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
            readOnly
          />
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                id="display__pinned"
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<RoomIcon />}
                onChange={() => setPinedStatus(!pinnedStatus)}
                checked={pinnedStatus}
                disabled
              />
            }
          />
        </div>
        <TextareaAutosize
          placeholder="Take a note..."
          onChange={(e) => setNote(e.target.value)}
          className="display__note__input"
          value={note}
          style={{ backgroundColor: backgroundColor }}
          readOnly
        />
      </div>
      <div className="tags__data">
        {reminderDate !== "" && reminderTime !== "" ? (
          <Chip
            icon={<EventAvailableIcon />}
            label={reminderDate + " at " + reminderTime}
            size="small"
            disabled
          />
        ) : reminderDate !== "" && reminderTime === "" ? (
          <Chip
            icon={<CalendarTodayIcon />}
            label={reminderDate}
            size="small"
            disabled
          />
        ) : reminderTime !== "" && reminderDate === "" ? (
          <Chip
            icon={<ScheduleIcon />}
            label={reminderTime}
            size="small"
            disabled
          />
        ) : null}

        {displayTags.length !== 0
          ? displayTags.map((tag) => <Chip label={tag} size="small" disabled />)
          : null}
      </div>
      <div className="button__options">
        <IconButton
          onClick={restoreThisNote}
          style={{ outline: "none", border: "none" }}
        >
          <RestoreFromTrashIcon />
        </IconButton>
        <IconButton
          onClick={deleteForeverThisNote}
          style={{ outline: "none", border: "none" }}
        >
          <DeleteForeverIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default DisplayCardTrash;
