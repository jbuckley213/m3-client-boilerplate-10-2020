import React, { Component } from "react";
import EditProfile from "./../EditProfile/EditProfile";
import userService from "./../../lib/user-service";
import { withAuth } from "./../../context/auth-context";
import SettingsIcon from "@material-ui/icons/Settings";

import "bulma/css/bulma.css";

class Settings extends Component {
  state = {
    showEdit: false,
    isFollowed: false,
    showSettings: false,
  };

  componentDidMount() {
    this.checkFollow();
  }

  toggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  handleFollow = () => {
    if (!this.state.isFollowed) {
      userService.follow(this.props.user._id).then((apiResponse) => {
        this.setState({ isFollowed: true });
      });
    } else if (this.state.isFollowed) {
      userService
        .unfollow(this.props.user._id)
        .then((apiResponse) => {
          console.log(apiResponse.data.following);
          this.setState({ isFollowed: false });
        })
        .catch((err) => console.log(err));
    }
  };

  checkFollow = () => {
    this.props.user.followers.forEach((userFollowing) => {
      if (this.props.user._id === userFollowing) {
        this.setState({ isFollowed: true });
      }
    });
  };
  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  };

  render() {
    return (
      <div className="settings">
        <div onClick={this.toggleSettings}>
          <SettingsIcon />
        </div>
        {this.state.showSettings ? (
          <div className="settings-menu">
            <button
              className="is-size-7	 button is-white"
              onClick={this.toggleEdit}
            >
              Edit Photo
            </button>
            {this.state.showEdit ? <EditProfile /> : null}

            <button
              className="is-size-7	 button is-white"
              onClick={this.props.logout}
            >
              Logout
            </button>

            <button
              className="is-size-7	 button is-white"
              onClick={this.props.toggleTheme}
            >
              Toggle dark mode{" "}
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withAuth(Settings);
