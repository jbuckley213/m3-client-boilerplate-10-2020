import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import ConversationList from "./ConversationList";
import { withAuth } from "./../context/auth-context";
import { Theme } from "./../styles/themes";

class ConversationDetails extends Component {
  state = {
    conversation: {},
    messages: [],
    sendMessage: "",
    intervalId: "",
    userContact: {},
  };

  componentDidMount() {
    this.getConversation();

    this.setTimerFromApiCall();
    this.seenMessage();
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  seenMessage = () => {
    const { conversationId } = this.props.match.params;

    conversationService
      .messageSeen(conversationId)
      .then((apiResponse) => {})
      .catch((err) => console.log(err));
  };

  getConversation = () => {
    const { conversationId } = this.props.match.params;
    conversationService
      .getConversationOne(conversationId)
      .then((apiResponse) => {
        this.setState({ conversation: apiResponse.data });
        this.getMessages();
        this.filterCurrentUser();
        this.seenMessage();
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
    const userContactId = this.state.userContact._id;
    console.log(userContactId);
    conversationService
      .sendMessage(conversationId, sendMessage, userContactId)
      .then((apiResponse) => {
        this.setState({ sendMessage: "" });
        this.getConversation();
      })
      .catch((err) => console.log(err));
  };

  filterCurrentUser = () => {
    const userArr = this.state.conversation.users;
    const filteredUserArr = userArr.filter((user) => {
      if (user._id === this.props.user._id) {
        return false;
      } else {
        return true;
      }
    });
    this.setState({ userContact: filteredUserArr[0] });
    return filteredUserArr[0];
  };

  isAdmin = (userId) => {
    if (userId === this.props.user._id) {
      return true;
    } else {
      return false;
    }
  };

  setTimerFromApiCall = () => {
    const intervalId = setInterval(() => {
      this.getConversation();
    }, 5000);
    this.setState({ intervalId: intervalId });
  };

  componentWillUnmount() {
    console.log("unmont");
    clearInterval(this.state.intervalId);
    this.seenMessage(); // LookLater
  }

  render() {
    let user;
    // if (this.state.conversation.users) {
    //   user = this.filterCurrentUser(this.state.conversation.users);
    // }
    if (this.state.conversation.notifications) {
      console.log(this.state.conversation.notifications.length);
    }
    return (
      <Theme dark={this.props.isDark}>
        <h1>
          Messages: {user && user.firstName} {user && user.lastName}
        </h1>

        {this.state.messages.map((message) => {
          return (
            <div key={message._id}>
              {this.isAdmin(message.userSent._id) ? (
                <div className="admin-message">
                  <p>
                    {message.userSent.firstName}: {message.messageContent}{" "}
                  </p>
                </div>
              ) : (
                <div className="user-message">
                  <p>
                    {message.userSent.firstName}: {message.messageContent}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {this.state.conversation.notifications &&
        this.state.conversation.notifications.length === 0
          ? "Seen"
          : null}
        <div
          ref={(el) => {
            this.el = el;
          }}
        ></div>
        <form onSubmit={this.handleSubmit}>
          <label>Send Message</label>
          <input
            value={this.state.sendMessage}
            name="sendMessage"
            onChange={this.handleInput}
            required
          />
          <button type="submit">Send</button>
        </form>
      </Theme>
    );
  }
}

export default withAuth(ConversationDetails);
