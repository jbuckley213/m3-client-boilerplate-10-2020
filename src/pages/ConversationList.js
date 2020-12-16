import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import { withAuth } from "./../context/auth-context";
import { Link } from "react-router-dom";
import { MessagePreview } from "./../styles/message-preview";
import { Theme } from "./../styles/themes";
import ConversationListItem from "../components/ConversationListItem/ConversationListItem";

import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

class Conversation extends Component {
  state = {
    conversations: [],
    online: [],
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getConversations();
    socket.emit("join-main", { user: this.props.user._id }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    socket.on("online", (users) => {
      // console.log("online");
      // console.log(users);
      const userIdArr = Object.values(users.users);

      this.setState({ online: userIdArr });
    });
  }

  componentDidUpdate() {
    // socket.on("online", (user) => {});
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
        <div className="conversation-list">
          <h1 className="subtitle is-4">Conversations</h1>
          {conversations && conversations.length === 0 ? (
            <p className="zero-conversation">
              You have no conversations. Search for developers to chat with!
            </p>
          ) : (
            conversations.map((conversation) => {
              const user = this.filterCurrentUser(conversation.users);

              const messageArrLength = conversation.messages.length - 1;

              return (
                <div key={conversation._id}>
                  <Link to={`/conversation-details/${conversation._id}`}>
                    <div className="conversations">
                      <MessagePreview>
                        <ConversationListItem
                          online={this.state.online}
                          conversation={conversation}
                          messageArrLength={messageArrLength}
                          receiverUser={user}
                        />
                      </MessagePreview>
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </Theme>
    );
  }
}
export default withAuth(Conversation);
