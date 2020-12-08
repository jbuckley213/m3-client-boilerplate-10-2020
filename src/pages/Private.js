import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import postService from "./../lib/post-service";

class Private extends Component {
  state = {
    users: [],
    posts: [],
  };

  componentDidMount() {
    // userService
    //   .getAll()
    //   .then((users) => this.setState({ users: users.data }))
    //   .catch((err) => this.setState({ users: [] }));
    postService
      .getAllPostsByFollowedUsers()
      .then((apiResponse) => this.setState({ posts: apiResponse.data }))
      .catch((err) => this.setState({ posts: [] }));
  }

  render() {
    if (this.state.posts.length != 0) {
      console.log(this.state.posts[0]);
    }
    return (
      <div>
        <h1>Private Route</h1>
        <h2>Welcome {this.props.user && this.props.user.firstName}</h2>

        {this.state.posts.map((post) => {
          return <p>{post.date}</p>;
        })}
      </div>
    );
  }
}

export default withAuth(Private);
