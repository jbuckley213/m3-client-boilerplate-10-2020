import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import { withAuth } from "./../context/auth-context";
import { Link } from "react-router-dom";
import { MessagePreview } from "./../styles/message-preview";
import { Theme } from "./../styles/themes";
import ConversationListItem from "../components/ConversationListItem/ConversationListItem";
import ConversationDetailsDesktop from "./../components/ConversationDetailsDesktop/ConversationDetailsDesktop";

import "animate.css/source/animate.css";

import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

class Conversation extends Component {
  state = {
    conversations: [],
    online: [],
    conversationId: "",
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

  sortConversations = () => {
    const sortedConversation = [...this.state.conversations];

    sortedConversation.sort((a, b) => {
      if (a.updated_at > b.updated_at) {
        return -1;
      } else if (a.updated_at > b.updated_at) {
        return 1;
      }
      return 0;
    });

    this.setState({ conversations: sortedConversation });
  };

  componentDidUpdate() {
    // socket.on("online", (user) => {});
  }

  getConversations = () => {
    conversationService
      .getConversations()
      .then((apiResponse) => {
        this.setState({ conversations: apiResponse.data });
        this.sortConversations();
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

  handleConversationChoosen = (conversationId) => {
    console.log(conversationId);
    this.setState({ conversationId });
  };

  render() {
    const conversations = this.state.conversations;

    return (
      <Theme dark={this.props.isDark}>
        <div className="conversation-list-and-details">
          <div className="conversation-list">
            <h1 className="subtitle is-4">Conversations</h1>
            {conversations && conversations.length === 0 ? (
              <p className="zero-conversation animated fadeIn">
                You have no conversations. Search for developers to chat with!
              </p>
            ) : (
              conversations.map((conversation) => {
                const user = this.filterCurrentUser(conversation.users);

                const messageArrLength = conversation.messages.length - 1;

                return (
                  <div className="animated fadeInUp" key={conversation._id}>
                    <Link
                      className="link-to-conversation"
                      to={`/conversation-details/${conversation._id}`}
                    >
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
                    <div
                      onClick={() => {
                        this.handleConversationChoosen(conversation._id);
                      }}
                      className="conversations link-to-desktop-conversations"
                    >
                      <MessagePreview>
                        <ConversationListItem
                          selected={this.state.conversationId}
                          online={this.state.online}
                          conversation={conversation}
                          messageArrLength={messageArrLength}
                          receiverUser={user}
                        />
                      </MessagePreview>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="link-to-desktop-conversations">
            {this.state.conversationId === "" ? (
              <h2 className="link-to-desktop-conversations subtitle is-4">
                Choose your Conversation
              </h2>
            ) : (
              <ConversationDetailsDesktop
                conversationId={this.state.conversationId}
              />
            )}
          </div>
        </div>
      </Theme>
    );
  }
}
export default withAuth(Conversation);
