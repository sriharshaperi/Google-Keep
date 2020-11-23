import React from "react";
import "./App.css";
import Header from "./Header";
import { Route, Switch } from "react-router-dom";
import Notes from "./Notes";
import Login from "./Login";
import Register from "./Register";
import Archives from "./Archives";
import Trash from "./Trash";
import Reminders from "./Reminders";
import PageNotFound from "./PageNotFound";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/reminders">
          <Header />
          <Reminders />
        </Route>
        <Route path="/archives">
          <Header />
          <Archives />
        </Route>
        <Route path="/trash">
          <Header />
          <Trash />
        </Route>
        <Route path="/notes">
          <Header />
          <Notes />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Header />
          <Notes />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
