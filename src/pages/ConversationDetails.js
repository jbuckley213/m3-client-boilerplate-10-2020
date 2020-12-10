import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import ConversationList from "./ConversationList";
import { withAuth } from "./../context/auth-context";

class ConversationDetails extends Component {
  state = {
    conversation: {},
    messages: [],
    sendMessage: "",
  };

  componentDidMount() {
    this.getConversation();
  }

  getConversation = () => {
    const { conversationId } = this.props.match.params;
    conversationService
      .getConversationOne(conversationId)
      .then((apiResponse) => {
        this.setState({ conversation: apiResponse.data });
        this.getMessages();
      });
  };

  getMessages = () => {
    const messages = this.state.conversation.messages;

    this.setState({ messages });
  };

  handleInput = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { conversationId } = this.props.match.params;
    const sendMessage = this.state.sendMessage;
    conversationService
      .sendMessage(conversationId, sendMessage)
      .then((apiResponse) => {
        this.setState({ sendMessage: "" });
        this.getConversation();
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

  isAdmin = (userId) => {
    if (userId === this.props.user._id) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    let user;
    if (this.state.conversation.users) {
      user = this.filterCurrentUser(this.state.conversation.users);
    }

    return (
      <div>
        <h1>
          Messages: {user && user.firstName} {user && user.lastName}
        </h1>

        {this.state.messages.map((message) => {
          return (
            <div key={message._id}>
              {this.isAdmin(message.userSent._id) ? (
                <p className="admin-message">
                  {message.userSent.firstName}:{message.messageContent}
                </p>
              ) : (
                <p className="user-message">
                  {message.userSent.firstName}:{message.messageContent}
                </p>
              )}
            </div>
          );
        })}
        <form onSubmit={this.handleSubmit}>
          <label>Send Message</label>
          <input
            value={this.sendMessage}
            name="sendMessage"
            onChange={this.handleInput}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default withAuth(ConversationDetails);
