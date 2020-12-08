import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withAuth } from "./../context/auth-context";

class Navbar extends Component {
  render() {
    // const { user, logout, isLoggedin } = this.props;
    return (
      <nav className="navbar">
        <Link to={"/private"} id="home-btn">
          <h4>News Feed</h4>
        </Link>
        {this.props.isLoggedIn ? (
          <>
            <button onClick={this.props.logout}>Logout</button>
            <Link to="/search">
              <h4>Search</h4>
            </Link>
            <Link to={`/profile/${this.props.user._id}`}>
              <h4>{this.props.user && this.props.user.firstName}</h4>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="navbar-button">Login</button>{" "}
            </Link>
            <br />
            <Link to="/signup">
              <button className="navbar-button">Sign Up</button>{" "}
            </Link>
          </>
        )}
      </nav>
    );
  }
}

export default withAuth(Navbar);
