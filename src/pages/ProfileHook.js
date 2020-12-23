import React, { useState, useEffect } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import Post from "./../components/Posts/Post";
import Notifications from "./../components/Notifications/Notifications";
import Settings from "./../components/Settings/Settings";

import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { Theme } from "./../styles/themes";
import { ProfileButton } from "./../styles/profile-button";
import { motion, AnimateSharedLayout } from "framer-motion";

import UserPost from "./../components/UserPost/UserPost";
import axios from "axios";
import "bulma/css/bulma.css";

import { Link } from "react-router-dom";
import postService from "../lib/post-service";
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

const Profile = (props) => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [userId, setUserId] = useState("");
  const [showPosts, setShowPosts] = useState(true);
  const [showLikes, setShowLikes] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [postInput, setPostInput] = useState("");
  const [postPhoto, setPostPhoto] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [numberOfNotifications, setNumberOfNotifications] = useState(0);
  const [newNotification, setNewNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    handlePostApi(true);

    socket.on("notification", (response) => {
      const userId = response.userId.userId;
      const userLiked = response.userId.userLiked;
      console.log(userLiked);
      if (userId === props.user._id && userLiked !== props.user._id) {
        handlePostApi();
      }
    });
  }, []);

  const handlePostApi = (mount) => {
    const profileId = props.match.params.id;
    userService
      .getOne(profileId)
      .then((apiResponse) => {
        console.log("response");
        setUser(apiResponse.data.user);
        setIsAdmin(apiResponse.data.isAdmin);
        setUserId(profileId);
        setNewNotification(apiResponse.data.user.newNotification);
        if (mount) {
          displayPosts();
        }

        // checkFollow();
        // orderPosts();
        // filterFollowing();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    //checkFollow();
    orderPosts();
    //filterFollowing();
    setFollowing(user.following);
  }, [user]);

  const orderPosts = () => {
    const postsArr = [];
    console.log(user);
    if (Object.keys(user).length !== 0) {
      console.log("called");
      user.posts.forEach((post) => {
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

      setPosts(postsArr);
      setNumberOfNotifications(user.notifications.length);
    }
  };

  useEffect(() => {
    if (userId !== props.match.params.id) {
      handlePostApi();
    }
  }, [props.match.params.id]);

  const checkFollow = () => {
    user.followers.forEach((userFollowing) => {
      if (props.user._id === userFollowing) {
        setIsFollowed(true);
      }
    });
  };

  const socketFollow = () => {
    console.log("sockey run");
    socket.emit(
      "notification",
      { userId: user._id, userLiked: props.user._id },
      () => {
        console.log("socket called");
      }
    );
  };

  const handleFollow = () => {
    if (!isFollowed) {
      userService.follow(user._id).then((apiResponse) => {
        setIsFollowed(true);
        socketFollow();
      });
    } else if (isFollowed) {
      userService
        .unfollow(user._id)
        .then((apiResponse) => {
          console.log(apiResponse.data.following);
          setIsFollowed(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const deletePost = (postId) => {
    postService
      .delete(postId)
      .then((apiResponse) => {
        handlePostApi();
      })
      .catch((err) => console.log(err));
  };

  const displayPosts = () => {
    handlePostApi(false);

    setShowPosts(true);
    setShowLikes(false);
    setShowFollowing(false);
  };

  const displayLikes = () => {
    handlePostApi(false);

    setShowPosts(false);
    setShowLikes(true);
    setShowFollowing(false);
  };
  const displayFollowing = () => {
    handlePostApi(false);

    setShowPosts(false);
    setShowLikes(false);
    setShowFollowing(true);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    // this.setState({ [name]: value });
    setPostInput(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    postService
      .createPost(props.user._id, postInput, postPhoto)
      .then((createdPost) => {
        handlePostApi();
        setPostPhoto("");
        setPostInput("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleNotifications = () => {
    if (newNotification) {
      userService
        .seenNotification()
        .then((apiResponse) => {
          setNewNotification(false);
        })
        .catch((err) => console.log(err));
    }
    setShowNotifications(!showNotifications);
  };

  const reduceNotifications = () => {
    let notifications = numberOfNotifications;

    notifications--;
    setNumberOfNotifications(notifications);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const filterFollowing = () => {
    const following = user.following;
    const userProfile = user;
    const filteredFollowing = following.filter((user) => {
      if (user._id === userProfile._id) {
        return false;
      } else {
        return true;
      }
    });
    // this.setState({ following: filteredFollowing });
    setFollowing(filteredFollowing);
  };

  const handleFileUpload = (e) => {
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
        setPostPhoto(response.data.secure_url);
      })
      .catch((err) => {
        console.log("Error while uploading the file: ", err);
      });
  };
  const getNumberOfFollowers = () => {
    if (isAdmin) {
      if (isFollowed) {
        return user.following.length - 1;
      } else {
        return user.following.length;
      }
    } else {
      return user.following.length;
    }
  };
  const outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(1, 4).join(" ");

    return day;
  };

  const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30,
  };

  function onPan(event, info) {
    console.log(info.point.x, info.point.y);
  }

  console.log("posts", posts);
  // console.log(this.state.user);
  // if (this.state.user.following) {
  //   console.log(this.state.user.following.length);
  // }
  // const props = useSpring({
  //   to: { opacity: 1 },
  //   from: { opacity: 0 },
  // });
  return (
    <div className="profile">
      <Theme dark={props.isDark}>
        <div className="profile-header">
          <img src={user.image} alt="user profile" />
          <div>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <p className="join-date">Joined on {outputDate(user.created_at)}</p>
          </div>

          {isAdmin ? (
            <Settings userProfile={user} />
          ) : (
            <button
              className="button is-white is-size-7"
              onClick={handleFollow}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </button>
          )}
          <div className="notifications">
            {isAdmin ? (
              <div>
                {newNotification ? (
                  <div
                    onClick={toggleNotifications}
                    id="new-notification"
                    className="notification is-primary animated bounce"
                  >
                    You have a new notification
                  </div>
                ) : null}

                <div onClick={toggleNotifications}>
                  <Badge
                    badgeContent={numberOfNotifications}
                    color="primary"
                    max={10}
                  >
                    <NotificationsIcon />
                  </Badge>
                </div>
              </div>
            ) : null}
            {showNotifications ? (
              <Notifications
                toggleNotifications={toggleNotifications}
                notifications={user.notifications}
                reduceNotifications={reduceNotifications}
              />
            ) : null}
          </div>
        </div>

        <AnimateSharedLayout>
          <div className="button-group">
            <ProfileButton highlight={showPosts}>
              <div className="button is-white" onClick={displayPosts}>
                {" "}
                {showPosts && (
                  <motion.div
                    layoutId="outline"
                    className="outline"
                    initial={false}
                    animate={{ borderColor: "#22cc88" }}
                    transition={spring}
                  ></motion.div>
                )}
                Posts {posts && posts.length}
              </div>
            </ProfileButton>

            <ProfileButton highlight={showLikes}>
              <div className="button is-white" onClick={displayLikes}>
                {" "}
                {showLikes && (
                  <motion.div
                    layoutId="outline"
                    className="outline"
                    initial={false}
                    animate={{ borderColor: "#22cc88" }}
                    transition={spring}
                  ></motion.div>
                )}
                Likes {user.likes && user.likes.length}
              </div>
            </ProfileButton>
            <ProfileButton highlight={showFollowing}>
              <div className="button is-white" onClick={displayFollowing}>
                {showFollowing && (
                  <motion.div
                    layoutId="outline"
                    className="outline"
                    initial={false}
                    animate={{ borderColor: "#22cc88" }}
                    transition={spring}
                  ></motion.div>
                )}
                Following {user.following && user.following.length}
              </div>
            </ProfileButton>
          </div>
        </AnimateSharedLayout>

        {/* <motion.div
          drag
          onDrag={(event, info) => {
            console.log(info.point.x);
            if (info.point.x > 200) {
              displayLikes();
            }
          }}
        > */}
        {showPosts ? (
          <div className="animated fadeInUp">
            {isAdmin ? (
              <div>
                <form
                  className="profile-post-form post-form"
                  onSubmit={handleSubmit}
                >
                  <div className="post-main">
                    <div>
                      <img src={props.user.image} alt="user profile" />
                    </div>
                    <div className="post-section">
                      <div className="post-user-info">
                        <div className="post-user">
                          {" "}
                          {props.user && props.user.firstName}{" "}
                          {props.user && props.user.lastName}
                          {"   "}
                        </div>
                      </div>
                      {postPhoto === "" ? null : (
                        <span>
                          <img
                            style={{ width: "100px" }}
                            src={postPhoto && postPhoto}
                            alt=""
                          ></img>
                        </span>
                      )}
                      <textarea
                        className="post"
                        name="postInput"
                        value={postInput}
                        onChange={handleInput}
                        placeholder="Share you code..."
                        required
                      />
                      <div className="post-actions">
                        <input
                          name="postPhoto"
                          type="file"
                          // value={this.state.postPhoto}
                          onChange={handleFileUpload}
                        />
                        <button
                          className="button is-white s-size-7"
                          type="submit"
                        >
                          Post
                        </button>{" "}
                      </div>
                    </div>
                  </div>

                  {postPhoto === "" ? null : (
                    <span>
                      <img
                        style={{ width: "100px" }}
                        src={postPhoto && postPhoto}
                        alt=""
                      ></img>
                    </span>
                  )}
                </form>
              </div>
            ) : null}
            {posts &&
              posts.map((post) => {
                return (
                  <div key={post._id}>
                    {isAdmin ? (
                      <UserPost post={post} deletePost={deletePost} />
                    ) : (
                      <Post post={post} />
                    )}
                  </div>
                );
              })}{" "}
          </div>
        ) : null}

        {showLikes ? (
          <div className="animated fadeInUp">
            {user.likes.length === 0 ? (
              <h3 className="no-info">No likes yet</h3>
            ) : (
              user.likes.map((post) => {
                return <Post key={post._id} post={post} />;
              })
            )}
          </div>
        ) : null}

        {showFollowing ? (
          <div className="animated fadeInUp">
            {following.length === 0 ? (
              <h3 className="no-info">Not following anyone</h3>
            ) : (
              <table>
                <tbody>
                  {following.map((user) => {
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
        {/* </motion.div> */}
      </Theme>
    </div>
  );
};

export default withAuth(Profile);
