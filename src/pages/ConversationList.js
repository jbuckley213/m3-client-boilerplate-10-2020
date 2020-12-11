import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import { withAuth } from "./../context/auth-context";
import { Link } from "react-router-dom";
import { MessagePreview } from "./../styles/message-preview";

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

  outputDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString().split(" ").reverse().join(" ");
  };
  render() {
    const conversations = this.state.conversations;
    console.log(conversations);
    return (
      <div>
        <h1>Conversations</h1>
        {conversations.map((conversation) => {
          const user = this.filterCurrentUser(conversation.users);

          const messageArrLength = conversation.messages.length - 1;

          return (
            <div key={conversation._id}>
              <Link to={`/conversation-details/${conversation._id}`}>
                <MessagePreview>
                  <div>
                    <div className="message-preview">
                      <img src={`${user && user.image}`} alt="profile image" />
                      <div>
                        <h3>
                          {user && user.firstName} {user && user.lastName}
                        </h3>

                        <p>
                          {conversation.messages[messageArrLength] &&
                            conversation.messages[messageArrLength].userSent
                              .firstName}
                          :{" "}
                          {conversation.messages[messageArrLength] &&
                            conversation.messages[messageArrLength]
                              .messageContent}
                          {this.outputDate(
                            conversation.messages[messageArrLength] &&
                              conversation.messages[messageArrLength].updated_at
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </MessagePreview>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
}
export default withAuth(Conversation);
