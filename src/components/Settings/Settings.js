import React, { Component } from "react";
import EditProfile from "./../EditProfile/EditProfile";
import userService from "./../../lib/user-service";
import { withAuth } from "./../../context/auth-context";

class Settings extends Component {
  state = {
    showEdit: false,
    isFollowed: false,
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
    console.log(this.props);

    this.props.user.followers.forEach((userFollowing) => {
      if (this.props.user._id === userFollowing) {
        this.setState({ isFollowed: true });
      }
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleEdit}>Edit Photo</button>
        {this.state.showEdit ? <EditProfile /> : null}

        {true ? (
          <div>
            <h4 onClick={this.props.logout}>Logout</h4>

            <button onClick={this.handleFollow}>
              {this.state.isFollowed
                ? "Hide Posts on My Dashboard"
                : "Show Posts on My Dashboard"}
            </button>
          </div>
        ) : (
          <button onClick={this.handleFollow}>
            {this.state.isFollowed ? "Unfollow" : "Follow"}
          </button>
        )}

        <button onClick={this.props.toggleTheme}>Toggle dark mode</button>
      </div>
    );
  }
}

export default withAuth(Settings);
