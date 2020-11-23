import React, { useState, useEffect } from "react";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";
import "./Reminders.css";
import RemindersDisplayCards from "./RemindersDisplayCards";
import { useHistory } from "react-router-dom";

function Reminders() {
  const [{ user }] = useStateValue();

  const history = useHistory();
  if (!user) history.push("/login");

  const [reminderDate, setReminderDate] = useState([]);
  const [reminderTime, setReminderTime] = useState([]);
  const [reminderDateTime, setReminderDateTime] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("notes")
        .where("remindBy", "==", "date")
        .onSnapshot((snapshot) =>
          setReminderDate(snapshot.docs.map((note) => note.data()))
        );

      db.collection("users")
        .doc(user?.uid)
        .collection("notes")
        .where("remindBy", "==", "time")
        .onSnapshot((snapshot) =>
          setReminderTime(snapshot.docs.map((note) => note.data()))
        );

      db.collection("users")
        .doc(user?.uid)
        .collection("notes")
        .where("remindBy", "==", "dateAndTime")
        .onSnapshot((snapshot) =>
          setReminderDateTime(snapshot.docs.map((note) => note.data()))
        );
    }
  }, [user]);

  console.log(reminderTime);
  console.log(reminderDate);

  return (
    <div className="reminders__notes">
      {reminderTime.length !== 0 ||
      reminderDate.length !== 0 ||
      reminderDateTime.length !== 0 ? (
        <div className="display__reminders__notes">
          <RemindersDisplayCards
            reminderDateDocs={reminderDate}
            reminderTimeDocs={reminderTime}
            reminderDateTimeDocs={reminderDateTime}
          />
        </div>
      ) : (
        <span className="no__reminders__placeholder">
          <NotificationsIcon
            style={{
              fontSize: "10rem",
              opacity: "0.3",
              display: "block",
              margin: "auto",
              width: "50%",
            }}
          />
          <h1>Notes with upcoming reminders appear here</h1>
        </span>
      )}
    </div>
  );
}

export default Reminders;
