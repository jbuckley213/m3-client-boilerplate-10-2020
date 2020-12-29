import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import { MessagePreviewSelected } from "./../../styles/message-preview";
import CheckIcon from "@material-ui/icons/Check";
import "bulma/css/bulma.css";
import "./ConversationListItem.css";

class ConversationListItem extends Component {
  state = {
    unreadMessages: 0,
    isOnline: false,
    isSelected: false,
    conversationSelected: "",
  };
  outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(0, 3).join(" ");

    const time = date.toLocaleString().split(" ").reverse()[0].slice(0, 5);
    return time + " " + day;
  };

  componentDidMount() {
    this.checkNotifications();
    const conversationSelected = this.props.selected;
    this.setState({ conversationSelected });
  }

  componentDidUpdate() {
    const conversationSelected = this.props.selected;

    const currentConversation = this.state.conversationSelected;

    if (conversationSelected !== currentConversation) {
      // this.handleSelected();
    }
  }

  checkOnline = () => {
    const onlineArr = this.props.online;
    let online = false;
    const receiverUserId = this.props.receiverUser._id;
    onlineArr.forEach((onlineUser) => {
      if (onlineUser === receiverUserId) {
        online = true;
      }
    });

    return online;
  };

  checkNotifications = () => {
    const currentUserId = this.props.user._id;
    const conversation = this.props.conversation;

    // conversation.notifications.forEach((userId)=>{
    //     if(currentUserId === userId){
    //         this.setState({unreadMessages: conversation.notifications.length})
    //         break
    //     }
    // })

    if (conversation.notifications[0] === currentUserId) {
      console.log(
        "notications",
        conversation.notifications.length,
        conversation._id
      );
      this.setState({ unreadMessages: conversation.notifications.length });
    }
  };

  handleSelected = () => {
    const currentConversation = this.props.conversation._id;
    const conversationSelected = this.props.selected;
    console.log("Called", currentConversation);
    if (conversationSelected !== currentConversation) {
      // this.setState({ isSelected: true });
    }
  };
  render() {
    const { conversation, messageArrLength, receiverUser } = this.props;
    // console.log(this.state.unreadMessages);
    // console.log("isOnline", this.checkOnline());
    console.log(this.state.isSelected);
    return (
      <MessagePreviewSelected isSelected={this.state.isSelected}>
        <div className="message-preview">
          <img src={`${receiverUser && receiverUser.image}`} alt="profile" />
          <div className="message-name">
            <h3>
              {receiverUser && receiverUser.firstName}{" "}
              {receiverUser && receiverUser.lastName}{" "}
              {this.checkOnline() ? (
                <CheckIcon className="online animated bounce" />
              ) : null}
            </h3>
            {/* <CheckIcon className="offline" /> */}
            <div className="message-info">
              <div>
                {this.state.unreadMessages === 0 ? null : (
                  <div className="unread">
                    <p>{this.state.unreadMessages}</p>
                  </div>
                )}
                <div className="preview-message-content">
                  {conversation.messages[messageArrLength] &&
                    conversation.messages[messageArrLength].userSent.firstName}
                  :{" "}
                  {conversation.messages[messageArrLength] &&
                    conversation.messages[messageArrLength].messageContent}
                </div>
              </div>
              <p className="message-date">
                {this.outputDate(
                  conversation.messages[messageArrLength] &&
                    conversation.messages[messageArrLength].updated_at
                )}
              </p>
            </div>
          </div>
        </div>
      </MessagePreviewSelected>
    );
  }
}

export default withAuth(ConversationListItem);
