import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import UserService from "./../../lib/user-service";
import conversationService from "./../../lib/conversation-service";

import { Link } from "react-router-dom";
import "./SearchResult.css";

class SearchResult extends Component {
  state = {
    isFollowing: false,
    hasConversation: false,
    conversationId: "",
    user: {},
    isCurrentUser: false,
  };

  componentDidMount() {
    this.checkFollow();
    this.checkConversation();
    this.handleIsCurrentUser();
  }

  handleIsCurrentUser = () => {
    const userSearch = this.props.userSearch;
    const currentUser = this.props.user;
    console.log(typeof userSearch._id, typeof currentUser._id);
    if (userSearch._id === currentUser._id) {
      this.setState({ isCurrentUser: true });
    }
  };

  checkFollow = () => {
    const currentUserFollowing = this.props.user.following;
    console.log(currentUserFollowing);
    const userSearchId = this.props.userSearch._id;
    let isFollowing = false;
    currentUserFollowing.forEach((user) => {
      if (user === userSearchId) {
        isFollowing = true;
      }
    });
    this.setState({ isFollowing });
  };

  checkConversation = () => {
    const currentUserConversations = this.props.user.conversations;
    console.log(currentUserConversations);
    const userSearchId = this.props.userSearch._id;

    let hasConversation = false;

    if (currentUserConversations.length === 0) {
      this.setState({ hasConversation });
      return;
    }

    currentUserConversations.forEach((conversation) => {
      if (conversation.users.includes(userSearchId)) {
        hasConversation = true;
        this.setState({ conversationId: conversation._id });
      }
    });

    this.setState({ hasConversation });
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

  createConversation = () => {
    const userSearchId = this.props.userSearch._id;

    conversationService.createConversation(userSearchId).then((apiResponse) => {
      console.log(apiResponse);
      const conversationId = apiResponse.data;

      this.setState({ hasConversation: true, conversationId });
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
          <Link className="search-name" to={`/profile/${userSearch._id}`}>
            <p>{userSearch && userSearch.firstName} </p>
            <p>{userSearch && userSearch.lastName}</p>
          </Link>
        </td>
        <td className="following-column">
          {this.state.isCurrentUser ? null : this.state.isFollowing ? (
            <button
              className="button is-white is-light is-size-7"
              onClick={this.handleUnfollow}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="button is-success is-light is-size-7"
              onClick={this.handleFollow}
            >
              Follow
            </button>
          )}
        </td>

        <td>
          {this.state.isCurrentUser ? null : this.state.hasConversation ? (
            <Link
              className="button is-success is-light is-size-7"
              to={`/conversation-details/${this.state.conversationId}`}
            >
              Go to chat
            </Link>
          ) : (
            <button
              className="button is-white is-light is-size-7"
              onClick={this.createConversation}
            >
              Start Chat
            </button>
          )}
        </td>
      </tr>
    );
  }
}

export default withAuth(SearchResult);
