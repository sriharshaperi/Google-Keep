import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import "./EditLabelsDialogContent.css";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

function EditLabelsDialogContent() {
  const [labelsArray, setLabelsArray] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [newLabelLeftButton, setNewLabelLeftButton] = useState("AddIcon");
  const [newLabelRightButton, setNewLabelRightButton] = useState(null);
  const [existingLabelTrigger, setExistingLabelTrigger] = useState(false);
  const [existingLabelId, setExistingLabelId] = useState("");

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("labels")
        .onSnapshot((snapshot) =>
          setLabelsArray(snapshot.docs.map((document) => document.data()))
        );
    }
  }, []);

  const saveNewLabel = (event) => {
    event.preventDefault();

    if (newLabel !== "") {
      if (existingLabelTrigger) {
        db.collection("users")
          .doc(user?.uid)
          .collection("labels")
          .doc(existingLabelId)
          .set({
            id: existingLabelId,
            label: newLabel,
          })
          .then(() => {
            setNewLabel("");
            setExistingLabelId("");
            setNewLabelLeftButton("AddIcon");
            setNewLabelRightButton(null);
            setExistingLabelTrigger(false);
          });
      } else {
        db.collection("users")
          .doc(user?.uid)
          .collection("labels")
          .add({
            label: newLabel,
          })
          .then((document) => {
            document.set({ id: document.id }, { merge: true });
            setNewLabel("");
            setNewLabelLeftButton("AddIcon");
            setNewLabelRightButton(null);
          });
        console.log("new label saved");
      }
    }
  };

  const editLabel = (event) => {
    setNewLabel(event.currentTarget.value);
    setExistingLabelId(event.currentTarget.id);
    document.getElementById("label__input").setAttribute("value", newLabel);
    document.getElementById("label__input").focus();
    setExistingLabelTrigger(true);
  };

  const onNewLabelInputFocus = () => {
    setNewLabelLeftButton("ClearIcon");
    setNewLabelRightButton("CheckIcon");
    document.getElementById("label__input").focus();
  };

  const onNewLabelInputBlur = () => {
    setNewLabel("");
    setNewLabelLeftButton("AddIcon");
    setNewLabelRightButton(null);
    document.getElementById("label__input").blur();
  };

  const deleteExistingLabel = (event) => {
    event.preventDefault();
    db.collection("users")
      .doc(user?.uid)
      .collection("labels")
      .doc(event.currentTarget.id)
      .delete();
  };

  return (
    <div className="edit__labels__content">
      <form className="new__label__form">
        {newLabelLeftButton === "AddIcon" ? (
          <IconButton
            onClick={onNewLabelInputFocus}
            style={{ outline: "none", border: "none" }}
          >
            <AddIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={onNewLabelInputBlur}
            style={{ outline: "none", border: "none" }}
          >
            <ClearIcon />
          </IconButton>
        )}
        <input
          id="label__input"
          type="text"
          onChange={(e) => setNewLabel(e.target.value)}
          value={newLabel}
          onFocus={onNewLabelInputFocus}
          placeholder="Create/Edit Label"
        />
        {newLabelRightButton ? (
          <IconButton
            type="submit"
            onClick={saveNewLabel}
            style={{ outline: "none", border: "none" }}
          >
            <CheckIcon />
          </IconButton>
        ) : null}
      </form>
      {labelsArray.map((label) => (
        <div className="display__labels">
          <IconButton
            type="submit"
            id={label.id}
            onClick={deleteExistingLabel}
            style={{ outline: "none", border: "none" }}
          >
            <DeleteRoundedIcon />
          </IconButton>
          <input
            type="text"
            className="display__label__input"
            readOnly
            value={label.label}
          />
          {/* <p>{label.label}</p> */}
          <IconButton
            type="submit"
            id={label.id}
            value={label.label}
            onClick={editLabel}
            style={{ outline: "none", border: "none" }}
          >
            <EditRoundedIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}

export default EditLabelsDialogContent;
