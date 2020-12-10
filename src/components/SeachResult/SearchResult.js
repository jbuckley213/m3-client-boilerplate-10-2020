import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import UserService from "./../../lib/user-service";
import { Link } from "react-router-dom";

class SearchResult extends Component {
  state = {
    isFollowing: false,
  };

  componentDidMount() {
    this.checkFollow();
  }
  checkFollow = () => {
    const currentUserFollowing = this.props.user.following;
    const userSearchId = this.props.userSearch._id;
    let isFollowing = false;
    currentUserFollowing.forEach((user) => {
      if (user === userSearchId) {
        isFollowing = true;
      }
    });
    this.setState({ isFollowing });
  };

  handleFollow = () => {
    UserService.follow(this.props.userSearch._id).then((apiResponse) => {
      console.log(apiResponse);
      this.setState({ isFollowing: true });
    });
  };

  handleUnfollow = () => {
    UserService.unfollow(this.props.userSearch._id).then((apiResponse) => {
      console.log(apiResponse);
      this.setState({ isFollowing: false });
    });
  };
  render() {
    const { userSearch } = this.props;
    return (
      <tr className="profile-link">
        <td>
          <img src={userSearch.image} alt="user profile" />
        </td>

        <td>
          <Link to={`/profile/${userSearch._id}`}>
            <p>{userSearch && userSearch.firstName} </p>
            <p>{userSearch && userSearch.lastName}</p>
          </Link>
        </td>
        <td>
          {this.state.isFollowing ? (
            <button onClick={this.handleUnfollow}>Unfollow</button>
          ) : (
            <button onClick={this.handleFollow}>Follow</button>
          )}
        </td>
      </tr>
    );
  }
}

export default withAuth(SearchResult);
