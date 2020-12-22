import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import { withAuth } from "./context/auth-context";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Private from "./pages/Private";
import PrivateHook from "./pages/PrivateHook";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import PostDetails from "./pages/PostDetails";
import ConversationList from "./pages/ConversationList";
import ConversationDetails from "./pages/ConversationDetails";
import AnonRoute from "./components/AnonRoute";
import PrivateRoute from "./components/PrivateRoute";
import { Theme } from "./styles/themes";

class App extends Component {
  render() {
    console.log(window.innerWidth < 1023);

    return (
      <div className="container">
        <Theme dark={this.props.isDark}>
          <div className="container-side-nav">
            <Navbar />
            <div className="side-nav-pages">
              <Switch>
                <Route exact path="/" component={Home} />

                <AnonRoute exact path="/signup" component={Signup} />
                <AnonRoute exact path="/login" component={Login} />

                <PrivateRoute exact path="/private" component={PrivateHook} />
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
        </Theme>
      </div>
    );
  }
}

export default withAuth(App);
