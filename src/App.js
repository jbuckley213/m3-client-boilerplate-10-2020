import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Private from "./pages/Private";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import PostDetails from "./pages/PostDetails";
import ConversationList from "./pages/ConversationList";

import AnonRoute from "./components/AnonRoute";
import PrivateRoute from "./components/PrivateRoute";

class App extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />

          <AnonRoute exact path="/signup" component={Signup} />
          <AnonRoute exact path="/login" component={Login} />

          <PrivateRoute exact path="/private" component={Private} />
          <PrivateRoute exact path="/search" component={Search} />
          <PrivateRoute exact path="/profile/:id" component={Profile} />
          <PrivateRoute
            exact
            path="/postdetails/:postId"
            component={PostDetails}
          />
          <PrivateRoute
            exact
            path="/conversations"
            component={ConversationList}
          />
        </Switch>
        <Navbar />
      </div>
    );
  }
}

export default App;
