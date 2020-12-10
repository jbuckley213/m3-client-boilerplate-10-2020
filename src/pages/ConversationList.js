import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import { withAuth } from "./../context/auth-context";
import { Link } from "react-router-dom";

class Conversation extends Component {
  state = {
    conversations: [],
  };

  componentDidMount() {
    this.getConversations();
  }

  getConversations = () => {
    conversationService
      .getConversations()
      .then((apiResponse) => {
        console.log(apiResponse);
        this.setState({ conversations: apiResponse.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  filterCurrentUser = (userArr) => {
    const conversations = this.state.conversations;
    const filteredUserArr = userArr.filter((user) => {
      if (user._id === this.props.user._id) {
        return false;
      } else {
        return true;
      }
    });
    return filteredUserArr[0];
  };
  render() {
    const conversations = this.state.conversations;
    console.log(conversations);
    return (
      <div>
        <h1>Conversations</h1>
        {conversations.map((conversation) => {
          const user = this.filterCurrentUser(conversation.users);
          return (
            <div>
              <p>
                <Link to={`/conversation-details/${conversation._id}`}>
                  {user && user.firstName} {user && user.lastName}
                </Link>
              </p>
            </div>
          );
        })}
      </div>
    );
  }
}
export default withAuth(Conversation);
