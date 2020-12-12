import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import { Link } from "react-router-dom";
import userService from "./../../lib/user-service";

class Notifications extends Component {
  state = {
    notifications: [],
  };
  //   this.props.user.notifications.reverse().slice(0, 5)
  componentDidMount() {
    //this.filterLikes();
    this.setState({
      notifications: this.props.notifications.reverse().slice(0, 5),
    });
  }
  // filterLikes = () => {
  //   const filteredLikes = this.props.notifications.filter((notification) => {
  //     if (notification.userActivity._id === this.props.user._id) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });
  //   this.setState({ notifications: filteredLikes.reverse().slice(0, 5) });
  // };

  filterNotifications = (notificationId) => {
    const filteredNotifications = this.state.notifications.filter(
      (notification) => {
        if (notificationId === notification._id) {
          return false;
        } else {
          return true;
        }
      }
    );

    this.setState({ notifications: filteredNotifications });
  };

  deleteNotification = (notificationId) => {
    userService
      .deleteNotification(notificationId)
      .then((apiResponse) => {
        this.filterNotifications(notificationId);
        this.props.reduceNotifications();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const notifications = this.state.notifications;
    return (
      <div className="notifications-menu">
        {notifications.map((notification) => {
          return notification.notificationInfo === "like" ? (
            <div key={notification._id}>
              <Link to={`/postdetails/${notification.post}`}>
                <p>
                  {notification.userActivity.firstName}{" "}
                  {notification.userActivity.lastName} liked your post
                </p>
              </Link>
              <button onClick={() => this.deleteNotification(notification._id)}>
                Delete
              </button>
            </div>
          ) : (
            <div key={notification._id}>
              <Link to={`/postdetails/${notification.post}`}>
                <p>
                  {notification.userActivity.firstName}{" "}
                  {notification.userActivity.lastName} commented on your post
                </p>
                <button
                  onClick={() => this.deleteNotification(notification._id)}
                >
                  Delete
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withAuth(Notifications);
