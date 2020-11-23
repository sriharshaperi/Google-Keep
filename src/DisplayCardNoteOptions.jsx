import React, { useEffect, useState } from "react";
import "./NoteOptions.css";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import {
  Avatar,
  ClickAwayListener,
  GridList,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import LabelIcon from "@material-ui/icons/Label";
import PaletteSharpIcon from "@material-ui/icons/PaletteSharp";
import ArchiveRoundedIcon from "@material-ui/icons/ArchiveRounded";
import UndoRoundedIcon from "@material-ui/icons/UndoRounded";
import { useStateValue } from "./StateProvider";
import DeleteIcon from "@material-ui/icons/Delete";
import { db } from "./firebase";

const DisplayCardNoteOptions = ({
  setBackgroundColorValue,
  addToDisplayTags,
  setReminderDateValue,
  setReminderTimeValue,
  reminderDate,
  reminderTime,
  undoData,
  deleteNote,
  archiveNote,
}) => {
  // const classes = useStyles();
  const [reminderPopupMenu, setReminderPopupMenu] = React.useState(false);
  const [labelsPopupMenu, setLabelsPopupMenu] = React.useState(false);
  const [palettePopupMenu, setPalettePopupMenu] = React.useState(false);
  const anchorRefReminderPopup = React.useRef(null);
  const anchorRefLabelsPopup = React.useRef(null);
  const anchorRefPalettePopup = React.useRef(null);

  const [{ user }] = useStateValue();
  const [labelsArray, setLabelsArray] = useState([]);

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

  const handleToggleReminderPopup = () => {
    setReminderPopupMenu((prevOpenReminderPopup) => !prevOpenReminderPopup);
  };

  const handleCloseReminderPopup = (event) => {
    if (
      anchorRefReminderPopup.current &&
      anchorRefReminderPopup.current.contains(event.target)
    ) {
      return;
    }
    setReminderPopupMenu(false);
  };

  function handleListKeyDownReminderPopup(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setReminderPopupMenu(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpenReminderPopup = React.useRef(reminderPopupMenu);
  React.useEffect(() => {
    if (prevOpenReminderPopup.current === true && reminderPopupMenu === false) {
      anchorRefReminderPopup.current.focus();
    }

    prevOpenReminderPopup.current = reminderPopupMenu;
  }, [reminderPopupMenu]);

  const handleToggleLabelsPopup = () => {
    setLabelsPopupMenu((prevOpenLabelsPopup) => !prevOpenLabelsPopup);
  };

  const handleCloseLabelsPopup = (event) => {
    if (
      anchorRefLabelsPopup.current &&
      anchorRefLabelsPopup.current.contains(event.target)
    ) {
      return;
    }
    setLabelsPopupMenu(false);
  };

  function handleListKeyDownLabelsPopup(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setLabelsPopupMenu(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpenLabelsPopup = React.useRef(labelsPopupMenu);
  React.useEffect(() => {
    if (prevOpenLabelsPopup.current === true && labelsPopupMenu === false) {
      anchorRefLabelsPopup.current.focus();
    }

    prevOpenLabelsPopup.current = labelsPopupMenu;
  }, [labelsPopupMenu]);

  const handleTogglePalettePopup = () => {
    setPalettePopupMenu((prevOpenPalettePopup) => !prevOpenPalettePopup);
  };

  const handleClosePalettePopup = (event) => {
    if (
      anchorRefPalettePopup.current &&
      anchorRefPalettePopup.current.contains(event.target)
    ) {
      return;
    }
    setPalettePopupMenu(false);
  };

  function handleListKeyDownPalettePopup(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setPalettePopupMenu(false);
    }
  }

  const prevOpenPalettePopup = React.useRef(palettePopupMenu);
  React.useEffect(() => {
    if (prevOpenPalettePopup.current === true && palettePopupMenu === false) {
      anchorRefPalettePopup.current.focus();
    }

    prevOpenPalettePopup.current = labelsPopupMenu;
  }, [palettePopupMenu]);

  const deleteThisNote = () => {
    deleteNote();
  };

  const archiveThisNote = () => {
    archiveNote();
  };

  return (
    <div className="button__options">
      <div className="button__options__left">
        <IconButton
          ref={anchorRefReminderPopup}
          aria-controls={
            reminderPopupMenu ? "reminder-menu-list-grow" : undefined
          }
          aria-haspopup="true"
          onClick={handleToggleReminderPopup}
          style={{ outline: "none", border: "none" }}
        >
          <AddAlertIcon />
        </IconButton>

        <Popper
          open={reminderPopupMenu}
          anchorEl={anchorRefReminderPopup.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseReminderPopup}>
                  <MenuList
                    autoFocusItem={reminderPopupMenu}
                    id="reminder-menu-list-grow"
                    onKeyDown={handleListKeyDownReminderPopup}
                  >
                    <MenuItem>
                      <input
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDateValue(e.target.value)}
                      />
                    </MenuItem>
                    <MenuItem>
                      <input
                        type="time"
                        onChange={(e) => setReminderTimeValue(e.target.value)}
                        value={reminderTime}
                      />
                    </MenuItem>
                    <MenuItem onClick={handleCloseReminderPopup}>
                      Close
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <IconButton
          ref={anchorRefLabelsPopup}
          aria-controls={labelsPopupMenu ? "labels-menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggleLabelsPopup}
          style={{ outline: "none", border: "none" }}
        >
          <LabelIcon />
        </IconButton>

        <Popper
          open={labelsPopupMenu}
          anchorEl={anchorRefLabelsPopup.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseLabelsPopup}>
                  <MenuList
                    autoFocusItem={labelsPopupMenu}
                    id="labels-menu-list-grow"
                    onKeyDown={handleListKeyDownLabelsPopup}
                  >
                    {labelsArray.map((label) => (
                      <MenuItem
                        button
                        onClick={(event) => {
                          addToDisplayTags(event.currentTarget.innerText);
                          handleCloseLabelsPopup(event);
                        }}
                      >
                        {label.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <IconButton
          ref={anchorRefPalettePopup}
          aria-controls={
            palettePopupMenu ? "palette-menu-list-grow" : undefined
          }
          aria-haspopup="true"
          onClick={handleTogglePalettePopup}
          style={{ outline: "none", border: "none" }}
        >
          <PaletteSharpIcon />
        </IconButton>

        <Popper
          open={palettePopupMenu}
          anchorEl={anchorRefPalettePopup.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClosePalettePopup}>
                  <GridList
                    autoFocusItem={palettePopupMenu}
                    id="palette-menu-list-grow"
                    onKeyDown={handleListKeyDownPalettePopup}
                    cols={10}
                    cellHeight="auto"
                  >
                    {[
                      "transparent",
                      "lightblue",
                      "blanchedalmond",
                      "plum",
                      "wheat",
                      "lightgreen",
                      "goldenrod",
                      "pink",
                      "lightskyblue",
                      "lightsalmon",
                    ].map((color, index) => (
                      <MenuItem
                        key={index}
                        id={index}
                        button
                        onClick={(event) => {
                          setBackgroundColorValue(
                            event.currentTarget.attributes.getNamedItem("value")
                              .nodeValue
                          );
                        }}
                        value={color}
                      >
                        <Avatar
                          style={{
                            backgroundColor: color,
                            color: color,
                            border: "1px solid lightgray",
                          }}
                        />
                      </MenuItem>
                    ))}
                  </GridList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <IconButton
          onClick={archiveThisNote}
          style={{ outline: "none", border: "none" }}
        >
          <ArchiveRoundedIcon />
        </IconButton>
        <IconButton
          onClick={() => undoData()}
          style={{ outline: "none", border: "none" }}
        >
          <UndoRoundedIcon />
        </IconButton>
      </div>
      <IconButton
        onClick={deleteThisNote}
        style={{ outline: "none", border: "none" }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default DisplayCardNoteOptions;
