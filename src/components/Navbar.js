import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { withAuth } from "./../context/auth-context";
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
              <h4>News Feed</h4>
            </NavLink>
            <NavLink className="btn" activeClassName="nav-link" to="/search">
              <h4>Search</h4>
            </NavLink>
            <NavLink
              className="btn"
              activeClassName="nav-link"
              to={`/profile/${this.props.user._id}`}
            >
              <h4>{this.props.user && this.props.user.firstName}</h4>
            </NavLink>
            <NavLink
              className="btn"
              activeClassName="nav-link"
              to={"/conversations"}
            >
              <h4>Chat</h4>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <button className="navbar-button">Login</button>{" "}
            </NavLink>
            <br />
            <NavLink to="/signup">
              <button className="navbar-button">Sign Up</button>{" "}
            </NavLink>
          </>
        )}
      </nav>
    );
  }
}

export default withAuth(Navbar);
