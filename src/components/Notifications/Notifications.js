import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import { Link } from "react-router-dom";
import userService from "./../../lib/user-service";
import "./Notifications.css";

class Notifications extends Component {
  state = {
    notifications: [],
  };
  //   this.props.user.notifications.reverse().slice(0, 5)
  componentDidMount() {
    //this.filterLikes();
    this.setState({
      notifications: [...this.props.notifications].reverse().slice(0, 10),
    });
  }

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
        <div className="notification animated zoomIn">
          <p className="delete" onClick={this.props.toggleNotifications}></p>
          <table className="notification-table">
            <tbody>
              {/* <div className="notification-item" key={notification._id}> */}

              {notifications.map((notification) => {
                return notification.notificationInfo !== "follow" ? (
                  <tr>
                    <td className="notifications-info">
                      <img
                        src={`${notification.userActivity.image}`}
                        alt="user profile"
                      />
                      <Link to={`/postdetails/${notification.post}`}>
                        <p>
                          {notification.userActivity.firstName}{" "}
                          {notification.userActivity.lastName}{" "}
                          {notification.notificationInfo} your post
                        </p>
                      </Link>
                    </td>
                    <td className="notifications-btn-delete">
                      <button
                        className="delete notification-delete"
                        onClick={() =>
                          this.deleteNotification(notification._id)
                        }
                      ></button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="notifications-info">
                      <img
                        src={`${notification.userActivity.image}`}
                        alt="user profile"
                      />
                      <Link
                        onClick={this.props.toggleNotifications}
                        to={`/profile/${notification.userActivity._id}`}
                      >
                        {" "}
                        <p>
                          {notification.userActivity.firstName}{" "}
                          {notification.userActivity.lastName} started following
                          you
                        </p>
                      </Link>
                    </td>
                    <td className="notifications-btn-delete">
                      <button
                        className="delete"
                        onClick={() =>
                          this.deleteNotification(notification._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withAuth(Notifications);
