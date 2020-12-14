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
import { useSpring, animated } from "react-spring";

import { Theme } from "./../styles/themes";
import { ProfileButton } from "./../styles/profile-button";

import UserPost from "./../components/UserPost/UserPost";
import axios from "axios";
import "bulma/css/bulma.css";

import { Link } from "react-router-dom";
import postService from "../lib/post-service";
import authService from "../lib/auth-service";

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
    following: [],
  };

  componentDidMount() {
    window.scrollTo(0, 0);

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
        this.setFollowing();
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

    this.setState({
      posts: postsArr,
      numberOfNotifications: this.props.user.notifications.length,
    });
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

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  };

  setFollowing = () => {
    const following = this.state.user.following;
    const userProfile = this.state.user;
    const filteredFollowing = following.filter((user) => {
      if (user._id === userProfile._id) {
        return false;
      } else {
        return true;
      }
    });
    this.setState({ following: filteredFollowing });
  };

  handleFileUpload = (e) => {
    console.log("The file to be uploaded is: ", e.target.files);
    const file = e.target.files[0];

    const uploadData = new FormData();
    // image => this name has to be the same as in the model since we pass
    // req.body to .create() method when creating a new project in '/api/projects' POST route
    uploadData.append("image", file);

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/posts/upload`, uploadData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("response is: ", response);
        // after the console.log we can see that response carries 'secure_url' which we can use to update the state
        this.setState({ postPhoto: response.data.secure_url });
      })
      .catch((err) => {
        console.log("Error while uploading the file: ", err);
      });
  };
  getNumberOfFollowers = () => {
    const isAdmin = this.state.isAdmin;
    if (isAdmin) {
      if (this.state.isFollowed) {
        return this.state.user.following.length - 1;
      } else {
        return this.state.user.following.length;
      }
    } else {
      return this.state.user.following.length;
    }
  };
  outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(1, 4).join(" ");

    return day;
  };

  render() {
    // console.log(this.state.user);
    // if (this.state.user.following) {
    //   console.log(this.state.user.following.length);
    // }
    // const props = useSpring({
    //   to: { opacity: 1 },
    //   from: { opacity: 0 },
    // });
    const user = this.state.user;
    return (
      <div className="profile">
        <Theme dark={this.props.isDark}>
          <div className="profile-header">
            <img src={this.state.user.image} alt="user profile" />
            <div>
              <p>
                {this.state.user.firstName} {this.state.user.lastName}
              </p>
              <p className="join-date">
                Joined on {this.outputDate(this.state.user.created_at)}
              </p>
            </div>

            {this.state.isAdmin ? (
              <Settings userProfile={this.state.user} />
            ) : (
              <button
                className="button is-white is-size-7"
                onClick={this.handleFollow}
              >
                {this.state.isFollowed ? "Unfollow" : "Follow"}
              </button>
            )}
            <div className="notifications">
              {this.state.isAdmin ? (
                <div>
                  {this.state.newNotification ? (
                    <div
                      onMouseEnter={this.toggleNotifications}
                      id="new-notification"
                      className="notification is-primary animated bounce"
                    >
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
                  toggleNotifications={this.toggleNotifications}
                  notifications={this.state.user.notifications}
                  reduceNotifications={this.reduceNotifications}
                />
              ) : null}
            </div>
          </div>

          <div className="button-group">
            <ProfileButton highlight={this.state.showPosts}>
              <div className="button is-white" onClick={this.displayPosts}>
                {" "}
                Posts {this.state.posts && this.state.posts.length}
              </div>
            </ProfileButton>

            <ProfileButton highlight={this.state.showLikes}>
              <div className="button is-white" onClick={this.displayLikes}>
                {" "}
                Likes {this.state.user.likes && this.state.user.likes.length}
              </div>
            </ProfileButton>
            <ProfileButton highlight={this.state.showFollowing}>
              <div className="button is-white" onClick={this.displayFollowing}>
                Following{" "}
                {this.state.user.following && this.state.following.length}
              </div>
            </ProfileButton>
          </div>

          {this.state.showPosts ? (
            <div className="animated fadeInUp">
              {this.state.isAdmin ? (
                <form className="post-form" onSubmit={this.handleSubmit}>
                  <textarea
                    className="post"
                    name="postInput"
                    value={this.state.postInput}
                    onChange={this.handleInput}
                    required
                  />
                  <br />
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

                  <button className="button is-white s-size-7" type="submit">
                    Post
                  </button>
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
            </div>
          ) : null}

          {/* <animated.div style={props}>
            {this.state.showLikes ? (
              <div>
                {this.state.user.likes &&
                  this.state.user.likes.map((post) => {
                    return <Post key={post._id} post={post} />;
                  })}
              </div>
            ) : null}
          </animated.div> */}

          {this.state.showLikes ? (
            <div className="animated fadeInUp">
              {this.state.user.likes &&
                this.state.user.likes.map((post) => {
                  return <Post key={post._id} post={post} />;
                })}
            </div>
          ) : null}
          {this.state.showFollowing ? (
            <div className="animated fadeInUp">
              {this.state.following.length === 0 ? (
                <h3>Not following anyone</h3>
              ) : (
                <table>
                  <tbody>
                    {this.state.following.map((user) => {
                      return (
                        <tr key={user._id} className="following-link">
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
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : null}
        </Theme>
      </div>
    );
  }
}

export default withAuth(Profile);
