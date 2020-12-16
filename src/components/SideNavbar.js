import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { withAuth } from "./../context/auth-context";
import ChatIcon from "@material-ui/icons/Chat";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import Badge from "@material-ui/core/Badge";

import "bulma/css/bulma.css";

import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

class Navbar extends Component {
  state = {
    newMessages: 0,
    newNotification: 0,
  };
  componentDidMount() {
    if (this.props.user) {
      this.startSocket();
    }
  }

  startSocket = () => {
    const conversations = this.props.user.conversations;

    conversations.forEach((conversation) => {
      socket.emit(
        "join",
        { room: conversation._id, user: this.props.user._id },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );

      socket.on("message", (message) => {
        let newMessages = this.state.newMessages;
        newMessages++;
        this.setState({ newMessages });
      });
    });

    socket.on("notification", (response) => {
      const userId = response.userId.userId;

      if (userId === this.props.user._id) {
        let newNotification = this.state.newNotification;
        newNotification++;
        this.setState({ newNotification });
      }
    });
  };

  getMessageNotification = () => {
    const conversations = this.props.user.conversations;
    const notification = this.state.newMessages / conversations.length;
    console.log(notification);
    return notification;
  };
  setMessagesZero = () => {
    this.setState({ newMessages: 0 });
  };
  setNotificationsZero = () => {
    this.setState({ newNotification: 0 });
  };

  render() {
    // const { user, logout, isLoggedin } = this.props;
    return (
      <nav className="side-navbar">
        {this.props.isLoggedIn ? (
          <>
            <NavLink
              className="btn "
              activeClassName="nav-link"
              to={"/private"}
            >
              <HomeIcon />
            </NavLink>
            <NavLink className="btn" activeClassName="nav-link" to="/search">
              <SearchIcon />
            </NavLink>
            <NavLink
              className="btn"
              activeClassName="nav-link"
              to={`/profile/${this.props.user._id}`}
              onClick={this.setNotificationsZero}
            >
              <Badge
                badgeContent={this.state.newNotification}
                color="primary"
                max={10}
              >
                <PersonIcon />
              </Badge>
              {/* {this.state.newNotification === 0
                ? null
                : this.state.newNotification} */}
            </NavLink>
            <NavLink
              className="btn"
              activeClassName="nav-link"
              to={"/conversations"}
              onClick={this.setMessagesZero}
            >
              <ChatIcon />
              {this.getMessageNotification() === 0
                ? null
                : this.getMessageNotification()}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <button
                className="button btn nav-home-btn"
                activeClassName="nav-link"
              >
                Login
              </button>{" "}
            </NavLink>
            <br />
            <NavLink to="/signup">
              <button
                className="button nav-home-btn"
                activeClassName="nav-link"
              >
                Sign Up
              </button>{" "}
            </NavLink>
          </>
        )}
      </nav>
    );
  }
}

export default withAuth(Navbar);