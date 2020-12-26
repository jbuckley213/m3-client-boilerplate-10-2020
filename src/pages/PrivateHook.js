import React, { useState, useEffect, useReducer } from "react";
import { withAuth } from "./../context/auth-context";
import postService from "./../lib/post-service";
import Post from "./../components/Posts/PostHook";
import PostInput from "./../components/PostInput/PostInput";
import NewUserPopup from "./../components/NewUserPopup/NewUserPopup";
import "bulma/css/bulma.css";
import "animate.css/source/animate.css";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";

import { Theme } from "./../styles/themes";

import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

const Private = (props) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newUser, setNewUser] = useState(true);

  const [newPosts, setNewPosts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    handlePostsFollowedApi();
    socket.emit("join-main", { user: props.user._id }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    // socket.on("online", (user) => {});
    socket.on("postIncoming", () => {
      console.log("new post");
      handlePostsFollowedApi();
    });
  }, []);

  const handlePostsFollowedApi = () => {
    postService
      .getAllPostsByFollowedUsers()
      .then((apiResponse) => {
        console.log(...apiResponse.data);
        setUsers(apiResponse.data);
      })
      .catch((err) => setUsers([]));
  };

  useEffect(() => {
    orderPosts();
  }, [users]);

  const orderPosts = () => {
    const postsArr = [...newPosts, ...props.user.posts];
    users.forEach((user) => {
      postsArr.push(...user.posts);
    });
    postsArr.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });

    setPosts([...postsArr]);
  };

  const postWithSocket = () => {
    socket.emit("post", {}, () => {});
  };

  const handleComponentSubmit = (createdPost) => {
    postWithSocket();

    const newPostsCreated = [...newPosts];
    newPostsCreated.push(createdPost.data);
    setNewPosts([...newPostsCreated]);
    handlePostsFollowedApi();
  };

  const closeNewUserMessage = () => {
    setNewUser(false);
  };

  return (
    <div className="dashboard">
      <Theme dark={props.isDark}>
        <div className="dashboard-header">
          <img src={props.user.image} alt="user profile" />
          <div>
            <h2>Welcome {props.user && props.user.firstName}</h2>
            <p>See New Posts Here!</p>
          </div>
        </div>

        {newUser ? (
          <NewUserPopup closeNewUserMessage={closeNewUserMessage} />
        ) : null}

        <PostInput handleComponentSubmit={handleComponentSubmit} />

        <AnimateSharedLayout>
          <motion.ul layout initial={{ borderRadius: 25 }}>
            {posts.map((post) => {
              return <Post key={post._id} post={post} />;
            })}
          </motion.ul>
        </AnimateSharedLayout>
      </Theme>
    </div>
  );
};

export default withAuth(Private);
