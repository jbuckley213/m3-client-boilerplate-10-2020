import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import UserService from "./../../lib/user-service";
import conversationService from "./../../lib/conversation-service";

import { Link } from "react-router-dom";

class SearchResult extends Component {
  state = {
    isFollowing: false,
    hasConversation: false,
    conversationId: "",
  };

  componentDidMount() {
    this.checkFollow();
    this.checkConversation();
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

  checkConversation = () => {
    const currentUserConversations = this.props.user.conversations;
    const userSearchId = this.props.userSearch._id;
    let hasConversation = false;
    if (currentUserConversations.length === 0) {
      this.setState({ hasConversation });
      return;
    }
    currentUserConversations.forEach((conversation) => {
      console.log(conversation.users, userSearchId);
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
      this.checkFollow();
      this.checkConversation();
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
        <td>
          {this.state.hasConversation ? (
            <Link to={`/conversation-details/${this.state.conversationId}`}>
              Go to chat
            </Link>
          ) : (
            <button onClick={this.createConversation}>Start Chat</button>
          )}
        </td>
      </tr>
    );
  }
}

export default withAuth(SearchResult);
