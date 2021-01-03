import React, { useState, useEffect } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import Post from "./../components/Posts/Post";
import PostHook from "./../components/Posts/PostHook";

import Notifications from "./../components/Notifications/Notifications";
import Settings from "./../components/Settings/Settings";
import PostInput from "./../components/PostInput/PostInput";

import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { Theme } from "./../styles/themes";
import { ProfileButton } from "./../styles/profile-button";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";

import UserPost from "./../components/UserPost/UserPost";
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
    if (Object.keys(user).length !== 0) {
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

  const handleComponentSubmit = () => {
    handlePostApi();
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
            <AnimatePresence>
              {showNotifications ? (
                <Notifications
                  toggleNotifications={toggleNotifications}
                  notifications={user.notifications}
                  reduceNotifications={reduceNotifications}
                />
              ) : null}
            </AnimatePresence>
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
                <PostInput handleComponentSubmit={handleComponentSubmit} />
              </div>
            ) : null}
            {posts &&
              posts.map((post) => {
                return (
                  <div key={post._id}>
                    {isAdmin ? (
                      <UserPost post={post} deletePost={deletePost} />
                    ) : (
                      <PostHook post={post} />
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
                return <PostHook key={post._id} post={post} />;
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
