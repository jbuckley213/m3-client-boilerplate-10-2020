import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import Post from "./../components/Posts/Post";
import Notifications from "./../components/Notifications/Notifications";
import EditProfile from "./../components/EditProfile/EditProfile";
import Settings from "./../components/Settings/Settings";

import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingsIcon from "@material-ui/icons/Settings";

import { Theme } from "./../styles/themes";
import { Fade } from "./../styles/fade";

import UserPost from "./../components/UserPost/UserPost";
import axios from "axios";
import "bulma/css/bulma.css";

import { Link } from "react-router-dom";
import postService from "../lib/post-service";

class Profile extends Component {
  state = {
    user: {},
    posts: [],
    isAdmin: false,
    isFollowed: false,
    showDelete: false,
    userId: "",
    showPosts: true,
    showLikes: false,
    showFollowing: false,
    postInput: "",
    postPhoto: "",
    showNotifications: false,
    numberOfNotifications: 0,
    newNotification: false,
    showSettings: false,
  };

  componentDidMount() {
    this.handlePostApi(true);
  }

  handlePostApi = (mount) => {
    const profileId = this.props.match.params.id;
    userService
      .getOne(profileId)
      .then((apiResponse) => {
        this.setState({
          user: apiResponse.data.user,
          isAdmin: apiResponse.data.isAdmin,
          userId: profileId,
          newNotification: apiResponse.data.user.newNotification,
        });
        if (mount) {
          this.displayPosts();
        }

        this.checkFollow();
        this.orderPosts();
        this.setNumberOfNotifications();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  orderPosts = () => {
    const postsArr = [];

    this.state.user.posts.forEach((post) => {
      postsArr.push(post);
    });
    postsArr.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });

    this.setState({ posts: postsArr });
  };

  componentDidUpdate = () => {
    if (this.state.userId !== this.props.match.params.id) {
      this.handlePostApi();
    }
  };

  checkFollow = () => {
    this.state.user.followers.forEach((userFollowing) => {
      if (this.props.user._id === userFollowing) {
        this.setState({ isFollowed: true });
      }
    });
  };

  handleFollow = () => {
    if (!this.state.isFollowed) {
      userService.follow(this.state.user._id).then((apiResponse) => {
        this.setState({ isFollowed: true });
      });
    } else if (this.state.isFollowed) {
      userService
        .unfollow(this.state.user._id)
        .then((apiResponse) => {
          console.log(apiResponse.data.following);
          this.setState({ isFollowed: false });
        })
        .catch((err) => console.log(err));
    }
  };

  deletePost = (postId) => {
    postService
      .delete(postId)
      .then((apiResponse) => {
        this.handlePostApi();
      })
      .catch((err) => console.log(err));
  };

  displayPosts = () => {
    this.handlePostApi(false);

    this.setState({ showPosts: true, showLikes: false, showFollowing: false });
  };
  displayLikes = () => {
    this.handlePostApi(false);

    this.setState({ showPosts: false, showLikes: true, showFollowing: false });
  };
  displayFollowing = () => {
    this.handlePostApi(false);

    this.setState({ showPosts: false, showLikes: false, showFollowing: true });
  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    postService
      .createPost(
        this.props.user._id,
        this.state.postInput,
        this.state.postPhoto
      )
      .then((createdPost) => {
        this.handlePostApi();
        this.setState({ postPhoto: "", postInput: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  showAdminFollowButton = () => {
    //////Not USED but backup if settings don't work
    return (
      <div>
        {this.state.isAdmin ? (
          <div>
            <h4 onClick={this.props.logout}>Logout</h4>

            <button onClick={this.handleFollow}>
              {this.state.isFollowed
                ? "Hide Posts on My Dashboard"
                : "Show Posts on My Dashboard"}
            </button>
          </div>
        ) : (
          <button onClick={this.handleFollow}>
            {this.state.isFollowed ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    );
  };

  toggleNotifications = () => {
    if (this.state.newNotification) {
      userService
        .seenNotification()
        .then((apiResponse) => {
          this.setState({ newNotification: false });
        })
        .catch((err) => console.log(err));
    }
    this.setState({ showNotifications: !this.state.showNotifications });
  };

  reduceNotifications = () => {
    let notifications = this.state.numberOfNotifications;

    notifications--;
    this.setState({ numberOfNotifications: notifications });
  };

  setNumberOfNotifications = () => {
    const numberOfNotifications = this.state.user.notifications.length;
    this.setState({ numberOfNotifications });
  };

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  };

  getNumberOfFollowers = () => {
    if (this.state.isFollowed) {
      return this.state.user.following.length - 1;
    } else {
      return this.state.user.following.length;
    }
  };

  render() {
    // console.log(this.state.user);
    // if (this.state.user.following) {
    //   console.log(this.state.user.following.length);
    // }
    const user = this.state.user;
    return (
      <div className="profile">
        <Theme dark={this.props.isDark}>
          <div className="profile-header">
            <img src={this.state.user.image} alt="user profile" />
            <p>
              {this.state.user.firstName} {this.state.user.lastName}
            </p>

            {this.state.isAdmin ? (
              <Settings userProfile={this.state.user} />
            ) : (
              <button onClick={this.handleFollow}>
                {this.state.isFollowed ? "Unfollow" : "Follow"}
              </button>
            )}
            <div className="notifications">
              {this.state.isAdmin ? (
                <div>
                  {this.state.newNotification ? (
                    <div class="notification is-primary">
                      You have a new notification
                    </div>
                  ) : null}

                  <div onClick={this.toggleNotifications}>
                    <Badge
                      badgeContent={this.state.numberOfNotifications}
                      color="primary"
                      max={10}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </div>
                </div>
              ) : null}
              {this.state.showNotifications ? (
                <Notifications
                  notifications={this.state.user.notifications}
                  reduceNotifications={this.reduceNotifications}
                />
              ) : null}
            </div>
          </div>

          <div className="button-group">
            <button className="button is-white" onClick={this.displayPosts}>
              Posts {this.state.posts && this.state.posts.length}
            </button>
            <button className="button is-white" onClick={this.displayLikes}>
              Likes {this.state.user.likes && this.state.user.likes.length}
            </button>
            <button className="button is-white" onClick={this.displayFollowing}>
              Following{" "}
              {this.state.user.following && this.getNumberOfFollowers()}
            </button>
          </div>

          {this.state.showPosts ? (
            <div>
              <Fade>
                {this.state.isAdmin ? (
                  <form onSubmit={this.handleSubmit}>
                    <input
                      name="postPhoto"
                      type="file"
                      // value={this.state.image}
                      onChange={this.handleFileUpload}
                    />
                    {this.state.postPhoto === "" ? null : (
                      <span>
                        <img
                          style={{ width: "100px" }}
                          src={this.state.postPhoto && this.state.postPhoto}
                          alt=""
                        ></img>
                      </span>
                    )}

                    <input
                      name="postInput"
                      value={this.state.postInput}
                      onChange={this.handleInput}
                      required
                    />
                    <button type="submit">Post</button>
                  </form>
                ) : null}
                {this.state.posts &&
                  this.state.posts.map((post) => {
                    return (
                      <div key={post._id}>
                        {this.state.isAdmin ? (
                          <UserPost post={post} deletePost={this.deletePost} />
                        ) : (
                          <Post post={post} />
                        )}
                      </div>
                    );
                  })}{" "}
              </Fade>
            </div>
          ) : null}

          {this.state.showLikes ? (
            <Fade>
              {this.state.user.likes &&
                this.state.user.likes.map((post) => {
                  return <Post key={post._id} post={post} />;
                })}
            </Fade>
          ) : null}

          {this.state.showFollowing ? (
            <Fade>
              {this.getNumberOfFollowers() === 0 ? (
                <h3>Not following anyone</h3>
              ) : (
                <table>
                  <tbody>
                    {this.state.user.following.map((user) => {
                      if (user._id === this.props.user._id) {
                        return null;
                      } else {
                        return (
                          <tr key={user._id} className="profile-link">
                            <td>
                              <img src={user.image} alt="user profile" />
                            </td>

                            <td>
                              <p>
                                <Link to={`/profile/${user._id}`}>
                                  {user.firstName} {user.lastName}
                                </Link>
                              </p>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              )}
            </Fade>
          ) : null}
        </Theme>
      </div>
    );
  }
}

export default withAuth(Profile);
