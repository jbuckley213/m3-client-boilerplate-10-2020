import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import postService from "./../lib/post-service";
import Post from "./../components/Posts/Post";

class Private extends Component {
  state = {
    users: [],
    posts: [],
    post: "",
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
    // const postsArr = [...this.props.user.posts];
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

  handleSubmit = (event) => {
    event.preventDefault();
    postService
      .createPost(this.props.user._id, this.state.post)
      .then((createdPost) => {
        this.handlePostsFollowedApi();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h1>Private Route</h1>
        <h2>Welcome {this.props.user && this.props.user.firstName}</h2>
        <img src={this.props.user.image} />
        <form onSubmit={this.handleSubmit}>
          <input
            name="post"
            value={this.state.post}
            onChange={this.handleInput}
          />
          <button type="submit">Submit</button>
        </form>
        {this.state.posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })}
      </div>
    );
  }
}

export default withAuth(Private);
