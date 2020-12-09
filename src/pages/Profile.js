import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import Post from "./../components/Posts/Post";
import UserPost from "./../components/UserPost/UserPost";

import { Link } from "react-router-dom";
import postService from "../lib/post-service";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

class Profile extends Component {
  state = {
    user: {},
    isAdmin: false,
    isFollowed: false,
    showDelete: false,
    userId: "",
    showPosts: true,
    showLikes: false,
    showFollowing: false,
    postInput: "",
  };

  componentDidMount() {
    this.handlePostApi();
  }

  handlePostApi = () => {
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
        this.checkFollow();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidUpdate = () => {
    if (this.state.userId !== this.props.match.params.id) {
      this.handlePostApi();
    }
  };

  checkFollow = () => {
    this.state.user.followers.forEach((userFollowing) => {
      if (this.props.user._id === userFollowing) {
        this.setState({ isFollowed: true });
      }
    });
  };

  handleFollow = () => {
    if (!this.state.isFollowed) {
      userService.follow(this.state.user._id).then((apiResponse) => {
        this.setState({ isFollowed: true });
      });
    } else if (this.state.isFollowed) {
      userService
        .unfollow(this.state.user._id)
        .then((apiResponse) => {
          console.log(apiResponse.data.following);
          this.setState({ isFollowed: false });
        })
        .catch((err) => console.log(err));
    }
  };

  deletePost = (postId) => {
    postService
      .delete(postId)
      .then((apiResponse) => {
        this.handlePostApi();
      })
      .catch((err) => console.log(err));
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

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    postService
      .createPost(this.props.user._id, this.state.postInput)
      .then((createdPost) => {
        this.handlePostApi();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  showAdminFollowButton = () => {
    return (
      <div>
        {this.state.isAdmin ? (
          <button onClick={this.handleFollow}>
            {this.state.isFollowed
              ? "Hide Posts on My Dashboard"
              : "Show Posts on My Dashboard"}
          </button>
        ) : (
          <button onClick={this.handleFollow}>
            {this.state.isFollowed ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    );
  };

  render() {
    // console.log(this.state.user);
    // if (this.state.user.following) {
    //   console.log(this.state.user.following.length);
    // }
    return (
      <div className="profile">
        <div>
          <button onClick={this.displayPosts}>Posts</button>
          <button onClick={this.displayLikes}>Likes</button>
          <button onClick={this.displayFollowing}>Following</button>
        </div>
        <p>
          {this.state.user.firstName} {this.state.user.lastName}
        </p>
        <img src={this.state.user.image} />

        {this.showAdminFollowButton()}

        <form onSubmit={this.handleSubmit}>
          <input
            name="postInput"
            value={this.state.postInput}
            onChange={this.handleInput}
          />
          <button type="submit">Post</button>
        </form>

        {this.state.showPosts
          ? this.state.user.posts &&
            this.state.user.posts.map((post) => {
              return (
                <div key={post._id}>
                  {this.state.isAdmin ? (
                    <UserPost post={post} deletePost={this.deletePost} />
                  ) : (
                    <Post post={post} />
                  )}
                </div>
              );
            })
          : null}
        {this.state.showLikes
          ? this.state.user.likes &&
            this.state.user.likes.map((post) => {
              return <Post key={post._id} post={post} />;
            })
          : null}

        {this.state.showFollowing ? (
          this.state.user.following.length === 0 ? (
            <h3>Not following anyone</h3>
          ) : (
            this.state.user.following.map((user) => {
              if (user._id === this.props.user._id) {
                return null;
              } else {
                return (
                  <Link key={user._id} to={`/profile/${user._id}`}>
                    {user.firstName} {user.lastName}
                  </Link>
                );
              }
            })
          )
        ) : null}
      </div>
    );
  }
}

export default withAuth(Profile);
