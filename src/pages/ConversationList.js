import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import { withAuth } from "./../context/auth-context";
import { Link } from "react-router-dom";
import { MessagePreview } from "./../styles/message-preview";
import { Theme } from "./../styles/themes";
import ConversationListItem from "../components/ConversationListItem/ConversationListItem";

class Conversation extends Component {
  state = {
    conversations: [],
  };

  componentDidMount() {
    this.getConversations();
  }

  componentWillUnmount() {
    console.log("unmount");
  }

  getConversations = () => {
    conversationService
      .getConversations()
      .then((apiResponse) => {
        this.setState({ conversations: apiResponse.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  filterCurrentUser = (userArr) => {
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
    return (
      <Theme dark={this.props.isDark}>
        <h1>Conversations</h1>
        {conversations.map((conversation) => {
          const user = this.filterCurrentUser(conversation.users);

          const messageArrLength = conversation.messages.length - 1;

          return (
            <div key={conversation._id}>
              <Link to={`/conversation-details/${conversation._id}`}>
                <MessagePreview>
                  <ConversationListItem
                    conversation={conversation}
                    messageArrLength={messageArrLength}
                    receiverUser={user}
                  />
                </MessagePreview>
              </Link>
            </div>
          );
        })}
      </Theme>
    );
  }
}
export default withAuth(Conversation);
