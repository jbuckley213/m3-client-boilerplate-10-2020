import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import Post from "./../components/Posts/Post";
import { Link } from "react-router-dom";

class Profile extends Component {
  state = {
    user: {},
    isAdmin: false,
    userId: "",
    showPosts: true,
    showLikes: false,
    showFollowing: false,
  };

  componentDidMount() {
    const profileId = this.props.match.params.id;
    userService
      .getOne(profileId)
      .then((apiResponse) => {
        console.log("apiResponse.data.user", apiResponse.data.user);

        this.setState({
          user: apiResponse.data.user,
          isAdmin: apiResponse.data.isAdmin,
          userId: profileId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate = () => {
    if (this.state.userId !== this.props.match.params.id) {
      const profileId = this.props.match.params.id;
      userService
        .getOne(profileId)
        .then((apiResponse) => {
          this.setState({
            user: apiResponse.data.user,
            isAdmin: apiResponse.data.isAdmin,
            userId: profileId,
          });
          this.displayPosts();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  displayPosts = () => {
    this.setState({ showPosts: true, showLikes: false, showFollowing: false });
  };
  displayLikes = () => {
    this.setState({ showPosts: false, showLikes: true, showFollowing: false });
  };
  displayFollowing = () => {
    this.setState({ showPosts: false, showLikes: false, showFollowing: true });
  };

  render() {
    return (
      <div>
        <div>
          <button onClick={this.displayPosts}>Posts</button>
          <button onClick={this.displayLikes}>Likes</button>
          <button onClick={this.displayFollowing}>Following</button>
        </div>
        <p>
          {this.state.user.firstName} {this.state.user.lastName}
        </p>
        {this.state.isAdmin ? <p>Is Admin</p> : <p>Is not Admin</p>}

        {this.state.showPosts
          ? this.state.user.posts &&
            this.state.user.posts.map((post) => {
              return <Post key={post._id} post={post} />;
            })
          : null}
        {this.state.showLikes
          ? this.state.user.likes &&
            this.state.user.likes.map((post) => {
              return <Post key={post._id} post={post} />;
            })
          : null}

        {this.state.showFollowing
          ? this.state.user.following &&
            this.state.user.following.map((user) => {
              return (
                <Link to={`/profile/${user._id}`}>
                  {user.firstName} {user.lastName}
                </Link>
              );
            })
          : null}
      </div>
    );
  }
}

export default withAuth(Profile);
