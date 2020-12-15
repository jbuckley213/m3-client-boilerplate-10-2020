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
import ConversationDetails from "./pages/ConversationDetails";
import SideNavbar from "./components/SideNavbar";
import AnonRoute from "./components/AnonRoute";
import PrivateRoute from "./components/PrivateRoute";

class App extends Component {
  render() {
    console.log(window.innerWidth < 1023);

    return (
      <div className="container">
        {/* {window.innerWidth < 1023 ? <Navbar /> : null} */}

        <div className="container-side-nav">
          <Navbar />
          {/* {window.innerWidth > 1023 ? <SideNavbar /> : null} */}
          <div className="side-nav-pages">
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
              <PrivateRoute
                exact
                path="/conversation-details/:conversationId"
                component={ConversationDetails}
              />
            </Switch>
          </div>
        </div>
        <div id="nav-space"></div>

        {/* {window.innerWidth < 1023 ? <Navbar /> : null} */}
        {/* <Navbar /> */}
      </div>
    );
  }
}

export default App;
