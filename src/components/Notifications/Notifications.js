import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import { Link } from "react-router-dom";

class Notifications extends Component {
  state = {
    notifications: [],
  };
  //   this.props.user.notifications.reverse().slice(0, 5)
  componentDidMount() {
    this.filterLikes();
  }
  filterLikes = () => {
    const filteredLikes = this.props.user.notifications.filter(
      (notification) => {
        if (notification.user._id === this.props.user._id) {
          return false;
        } else {
          return true;
        }
      }
    );
    this.setState({ notifications: filteredLikes.reverse().slice(0, 5) });
  };
  render() {
    const notifications = this.state.notifications;
    console.log(notifications);
    return (
      <div>
        {notifications.map((notification) => {
          return notification.info === "Liked" ? (
            <div key={notification._id}>
              <Link to={`/postdetails/${notification.post._id}`}>
                <p>
                  {notification.user.firstName} {notification.user.lastName}{" "}
                  liked your post
                </p>
              </Link>
            </div>
          ) : (
            <div key={notification._id}>
              <Link to={`/postdetails/${notification.post._id}`}>
                <p>
                  {notification.user.firstName} {notification.user.lastName}{" "}
                  commented on your post
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withAuth(Notifications);
