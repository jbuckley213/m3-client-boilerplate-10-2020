import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import postService from "./../lib/post-service";
import Post from "./../components/Posts/Post";
import "bulma/css/bulma.css";

import axios from "axios";

class Private extends Component {
  state = {
    users: [],
    posts: [],
    post: "",
    postPhoto: "",
  };

  componentDidMount() {
    this.handlePostsFollowedApi();
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
    const postsArr = [];

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
      .post("http://localhost:5000/api/posts/upload", uploadData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("response is: ", response);
        // after the console.log we can see that response carries 'secure_url' which we can use to update the state
        this.setState({ image: response.data.secure_url });
      })
      .catch((err) => {
        console.log("Error while uploading the file: ", err);
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    postService
      .createPost(this.props.user._id, this.state.post, this.state.image)
      .then((createdPost) => {
        this.handlePostsFollowedApi();
        this.setState({ image: "", post: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="dashboard">
        <h1>Private Route</h1>
        <h2>Welcome {this.props.user && this.props.user.firstName}</h2>
        <img src={this.props.user.image} alt="user profile" />
        <form onSubmit={this.handleSubmit}>
          <input
            name="postPhoto"
            type="file"
            // value={this.state.image}
            onChange={this.handleFileUpload}
            required
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
          <br />
          <input
            name="post"
            value={this.state.post}
            onChange={this.handleInput}
          />
          <button type="submit">Post</button>
        </form>
        {this.state.posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })}
      </div>
    );
  }
}

export default withAuth(Private);
