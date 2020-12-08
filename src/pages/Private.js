import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import postService from "./../lib/post-service";
import Post from "./../components/Posts/Post";

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
      .then((apiResponse) => {
        this.setState({ users: apiResponse.data });
        this.orderPosts();
      })
      .catch((err) => this.setState({ users: [] }));
  }

  orderPosts = () => {
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

  render() {
    if (this.state.posts.length !== 0) {
      console.log(this.state.posts[0]);
    }
    return (
      <div>
        <h1>Private Route</h1>
        <h2>Welcome {this.props.user && this.props.user.firstName}</h2>

        {this.state.posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })}
      </div>
    );
  }
}

export default withAuth(Private);
