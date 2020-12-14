import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import { withTheme } from "./../context/theme-context";
import postService from "./../lib/post-service";
import Post from "./../components/Posts/Post";
import "bulma/css/bulma.css";
import "animate.css/source/animate.css";

import { Theme } from "./../styles/themes";
import { Fade } from "./../styles/fade";
import axios from "axios";
import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

class Private extends Component {
  state = {
    users: [],
    posts: [],
    post: "",
    postPhoto: "",
    newPosts: [],
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    this.handlePostsFollowedApi();
    socket.emit("join-main", { user: this.props.user._id }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    socket.on("online", (user) => {
      console.log("online");
      console.log(user);
    });
    socket.on("postIncoming", () => {
      console.log("new post");
      this.handlePostsFollowedApi();
    });
  }

  handlePostsFollowedApi = () => {
    postService
      .getAllPostsByFollowedUsers()
      .then((apiResponse) => {
        this.setState({ users: apiResponse.data });
        this.orderPosts();
      })
      .catch((err) => this.setState({ users: [] }));
  };

  orderPosts = () => {
    //const postsArr = [...this.props.user.posts];
    console.log("orderPosts");
    const postsArr = [...this.state.newPosts, ...this.props.user.posts];

    this.state.users.forEach((user) => {
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

    this.setState({ posts: postsArr });
  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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

  componentDidUpdate() {
    // socket.on("postIncoming", () => {
    //   console.log("new post");
    //   this.handlePostsFollowedApi();
    // });
  }

  postWithSocket = () => {
    socket.emit("post", {}, () => {});
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.postWithSocket();

    postService
      .createPost(this.props.user._id, this.state.post, this.state.postPhoto)
      .then((createdPost) => {
        console.log(createdPost);
        const newPosts = [...this.state.newPosts];
        newPosts.push(createdPost.data);
        this.setState({ postPhoto: "", post: "", newPosts });
        this.handlePostsFollowedApi();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="dashboard">
        <Theme dark={this.props.isDark}>
          <div className="dashboard-header">
            <img src={this.props.user.image} alt="user profile" />
            <div>
              <h2>Welcome {this.props.user && this.props.user.firstName}</h2>
              <p>See New Posts Here!</p>
            </div>
          </div>

          <form className="post-form" onSubmit={this.handleSubmit}>
            <div className="post-main">
              <div>
                <img src={this.props.user.image} alt="user profile" />
              </div>
              <div className="post-section">
                <div className="post-user-info">
                  <div className="post-user">
                    {" "}
                    {this.props.user && this.props.user.firstName}{" "}
                    {this.props.user && this.props.user.lastName}
                    {"   "}
                  </div>
                </div>
                {this.state.postPhoto === "" ? null : (
                  <span>
                    <img
                      style={{ width: "100px" }}
                      src={this.state.postPhoto && this.state.postPhoto}
                      alt=""
                    ></img>
                  </span>
                )}
                <textarea
                  className="post"
                  name="post"
                  value={this.state.post}
                  onChange={this.handleInput}
                  placeholder="Share you code..."
                  required
                />
                <div className="post-actions">
                  <input
                    name="postPhoto"
                    type="file"
                    // value={this.state.postPhoto}
                    onChange={this.handleFileUpload}
                  />
                  <button className="button is-white s-size-7" type="submit">
                    Post
                  </button>{" "}
                </div>
              </div>
            </div>

            {this.state.postPhoto === "" ? null : (
              <span>
                <img
                  style={{ width: "100px" }}
                  src={this.state.postPhoto && this.state.postPhoto}
                  alt=""
                ></img>
              </span>
            )}
          </form>
          <Fade>
            {this.state.posts.map((post) => {
              return <Post key={post._id} post={post} />;
            })}
          </Fade>
        </Theme>
      </div>
    );
  }
}

export default withAuth(Private);
