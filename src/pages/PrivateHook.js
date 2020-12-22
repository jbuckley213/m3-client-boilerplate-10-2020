import React, { useState, useEffect, useReducer } from "react";
import { withAuth } from "./../context/auth-context";
import postService from "./../lib/post-service";
import Post from "./../components/Posts/PostHook";
import "bulma/css/bulma.css";
import "animate.css/source/animate.css";

import { Theme } from "./../styles/themes";
import { Fade } from "./../styles/fade";
import axios from "axios";
import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

const Private = (props) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [input, setInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      post: "",
      postPhoto: "",
    }
  );

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
        //orderPosts();
      })
      .catch((err) => setUsers([]));
  };

  useEffect(() => {
    orderPosts();
  }, [users]);

  const orderPosts = () => {
    //const postsArr = [...this.props.user.posts];

    const postsArr = [...newPosts, ...props.user.posts];
    console.log("orderPosts users", newPosts);
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
    console.log(postsArr);

    setPosts([...postsArr]);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInput({ [name]: value });
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
        setInput({ postPhoto: response.data.secure_url });
      })
      .catch((err) => {
        console.log("Error while uploading the file: ", err);
      });
  };

  // componentDidUpdate() {
  //   // socket.on("postIncoming", () => {
  //   //   console.log("new post");
  //   //   this.handlePostsFollowedApi();
  //   // });
  // }

  const postWithSocket = () => {
    socket.emit("post", {}, () => {});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    postWithSocket();

    postService
      .createPost(props.user._id, input.post, input.postPhoto)
      .then((createdPost) => {
        console.log(createdPost);
        const newPostsCreated = [...newPosts];
        newPostsCreated.push(createdPost.data);

        setInput({ postPhoto: "", post: "" });
        setNewPosts([...newPostsCreated]);
        handlePostsFollowedApi();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("users", users);
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

        {/* <PostInput
            handlePostsFollowedApi={this.props.handlePostsFollowedApi}
            handleSubmit={this.props.handleSubmit}
          /> */}

        <form className="post-form" onSubmit={handleSubmit}>
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
              {/* {this.state.postPhoto === "" ? null : (
                  <span>
                    <img
                      style={{ width: "50px" }}
                      src={this.state.postPhoto && this.state.postPhoto}
                      alt=""
                    ></img>
                  </span>
                )} */}
              <textarea
                className="post"
                name="post"
                value={input.post}
                onChange={handleInput}
                placeholder="Share your code..."
                required
              />
              <div className="post-actions">
                <input
                  name="postPhoto"
                  type="file"
                  // value={this.state.postPhoto}
                  onChange={handleFileUpload}
                />
                <button className="button is-white s-size-7" type="submit">
                  Post
                </button>{" "}
              </div>
            </div>
          </div>

          {input.postPhoto === "" ? null : (
            <span>
              <img
                style={{ width: "100px" }}
                src={input.postPhoto && input.postPhoto}
                alt=""
              ></img>
            </span>
          )}
        </form>
        <Fade>
          {posts.map((post) => {
            return <Post key={post._id} post={post} />;
          })}
        </Fade>
      </Theme>
    </div>
  );
};

export default withAuth(Private);
