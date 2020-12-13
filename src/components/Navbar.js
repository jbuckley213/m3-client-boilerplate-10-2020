import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { withAuth } from "./../context/auth-context";
import ChatIcon from "@material-ui/icons/Chat";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import "bulma/css/bulma.css";

class Navbar extends Component {
  render() {
    // const { user, logout, isLoggedin } = this.props;
    return (
      <nav className="navbar">
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
            >
              <PersonIcon />
            </NavLink>
            <NavLink
              className="btn"
              activeClassName="nav-link"
              to={"/conversations"}
            >
              <ChatIcon />
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
