import React, { Component } from "react";
import conversationService from "./../lib/conversation-service";
import ConversationList from "./ConversationList";
import { withAuth } from "./../context/auth-context";
import { Theme, ThemeConversation } from "./../styles/themes";
import { MessageHeader } from "./../styles/message-header";
import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

class ConversationDetails extends Component {
  state = {
    conversation: {},
    messages: [],
    sendMessage: "",
    intervalId: "",
    userContact: {},
    newMessages: [],
    showDelete: false,
  };

  componentDidMount() {
    this.getConversationMount();
    // this.setTimerFromApiCall();
    this.seenMessage();
    this.scrollToBottom();
  }

  startSocket = () => {
    socket.emit(
      "join",
      { room: this.state.conversation._id, user: this.props.user._id },
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );

    socket.on("message", (message) => {
      console.log("socket called");
      // console.log(message.text);
      // const messages = [];
      // messages.push(message.text);
      // this.setState({ newMessages: messages });
      this.getConversation();
      this.seenMessage();
    });

    socket.on("online", (user) => {
      console.log("online");
    });

    this.sendDelete();
  };

  componentDidUpdate() {
    const messages = this.state.newMessages;

    // socket.once("message", (message) => {
    //   console.log("socket called");
    //   // console.log(message.text);
    //   // messages.push(message.text);
    //   // this.setState({ newMessages: messages });
    //   this.getConversation();
    //   this.seenMessage();
    // });

    // socket.on("online", (user) => {
    //   console.log("online");
    // });
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
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
        this.filterCurrentUser(); //maybe don't need

        // this.seenMessage();
      });
  };

  getConversationMount = () => {
    const { conversationId } = this.props.match.params;
    conversationService
      .getConversationOne(conversationId)
      .then((apiResponse) => {
        this.setState({ conversation: apiResponse.data });
        this.getMessages();
        this.filterCurrentUser();
        this.startSocket();
      });
  };

  sendMessage = () => {
    const message = this.state.sendMessage;
    const conversationId = this.state.conversation._id;
    console.log(message);
    const sendObj = { conversationId, message };
    if (message) {
      socket.emit("sendMessage", sendObj, () => {
        console.log("MessageSent");
        this.setState({ sendMessage: "" });
      });
    }
  };

  sendDelete = () => {
    const conversationId = this.state.conversation._id;

    const sendObj = { conversationId, message: "" };

    socket.emit("sendMessage", sendObj, () => {
      console.log("MessageSent");
      this.setState({ sendMessage: "" });
    });
  };

  getMessages = () => {
    const messages = this.state.conversation.messages;
    if (messages.length !== this.state.messages.length) {
      this.setState({ messages });
      this.scrollToBottom();
    }
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
        // this.setState({ sendMessage: "" });
        this.getConversation();
        this.sendMessage();

        // this.getConversation();
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
    clearInterval(this.state.intervalId);
    this.seenMessage(); // LookLater
  }

  outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(0, 3).join(" ");

    const time = date.toLocaleString().split(" ").reverse()[0].slice(0, 5);
    return time + " " + day;
  };

  checkSeen = () => {
    const notificationsArr = this.state.conversation.notifications;
    const messagesArr = this.state.conversation.messages;
    const lastMessage = this.state.conversation.messages.length - 1;

    if (
      notificationsArr.length === 0 &&
      messagesArr.length !== 0 &&
      messagesArr[lastMessage].userSent._id === this.props.user._id
    ) {
      return "Seen";
    } else {
      return null;
    }
  };

  deleteMessage = (messageId) => {
    const { conversationId } = this.props.match.params;
    conversationService
      .deleteMessage(conversationId, messageId)
      .then((apiResponse) => {
        this.getConversation();
        this.sendDelete();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  };

  render() {
    // if (this.state.conversation.users) {
    //   user = this.filterCurrentUser(this.state.conversation.users);
    // }
    let classes = "";
    if (this.state.showDelete) {
      classes = "slide-message";
    }

    return (
      <div className="conversation-details">
        <ThemeConversation dark={this.props.isDark} className="isMessages">
          <MessageHeader>
            <img src={this.state.userContact.image} />
            <h3>
              {this.state.userContact.firstName}{" "}
              {this.state.userContact.lastName}
            </h3>
          </MessageHeader>

          {this.state.messages.map((message) => {
            return (
              <div key={message._id}>
                {this.isAdmin(message.userSent._id) ? (
                  <div>
                    <div
                      onClick={this.toggleDelete}
                      className={`admin-message ${classes}`}
                    >
                      <div>{this.outputDate(message.created_at)}</div>
                      <p>
                        <p>
                          {message.userSent.firstName}: {message.messageContent}{" "}
                        </p>
                      </p>
                    </div>
                    {this.state.showDelete ? (
                      <button
                        className="delete delete-message"
                        onClick={() => this.deleteMessage(message._id)}
                      ></button>
                    ) : null}
                  </div>
                ) : (
                  <div className="user-message">
                    <div>{this.outputDate(message.created_at)}</div>

                    <p>
                      {message.userSent.firstName}: {message.messageContent}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          {/* <div>
            {this.state.newMessages.map((message) => {
              return <p>{message}</p>;
            })}
          </div> */}

          <div className="seen">
            {this.state.conversation.notifications && this.checkSeen()}
          </div>

          <div
            ref={(el) => {
              this.el = el;
            }}
          ></div>
          <form onSubmit={this.handleSubmit} className="send-message">
            <input
              className="input is-info"
              value={this.state.sendMessage}
              name="sendMessage"
              onChange={this.handleInput}
              required
            />
            <button className="button" type="submit">
              Send
            </button>
          </form>
        </ThemeConversation>
      </div>
    );
  }
}

export default withAuth(ConversationDetails);
