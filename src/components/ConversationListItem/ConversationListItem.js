import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";

class ConversationListItem extends Component {
  state = {
    unreadMessages: 0,
  };
  outputDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString().split(" ").reverse().join(" ");
  };

  componentDidMount() {
    this.checkNotifications();
  }

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
      console.log("notications");
      this.setState({ unreadMessages: conversation.notifications.length });
    }
  };
  render() {
    const { conversation, messageArrLength, receiverUser } = this.props;
    return (
      <div className="message-preview">
        <img
          src={`${receiverUser && receiverUser.image}`}
          alt="profile image"
        />
        <div>
          <h3>
            {receiverUser && receiverUser.firstName}{" "}
            {receiverUser && receiverUser.lastName}{" "}
            {this.state.unreadMessages === 0 ? null : this.state.unreadMessages}
          </h3>

          <p>
            {conversation.messages[messageArrLength] &&
              conversation.messages[messageArrLength].userSent.firstName}
            :{" "}
            {conversation.messages[messageArrLength] &&
              conversation.messages[messageArrLength].messageContent}
            {this.outputDate(
              conversation.messages[messageArrLength] &&
                conversation.messages[messageArrLength].updated_at
            )}
          </p>
        </div>
      </div>
    );
  }
}

export default withAuth(ConversationListItem);
