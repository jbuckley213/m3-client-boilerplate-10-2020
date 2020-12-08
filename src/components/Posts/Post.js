import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import postService from "./../../lib/post-service";

import "./Post.css";
import "bulma/css/bulma.css";

class Post extends Component {
  state = {
    isliked: false,
  };

  handleLike = () => {
    if (!this.state.isLiked) {
      postService
        .likePost(this.props.post._id)
        .then((postLiked) => {
          console.log(postLiked);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (this.state.isLiked) {
      postService
        .unlikePost(this.props.post._id)
        .then((postUnliked) => {
          console.log(postUnliked);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.setState({ isLiked: !this.state.isLiked });
  };

  componentDidMount() {
    let isLiked = false;
    this.props.post.likes.forEach((likeId) => {
      if (likeId === this.props.user._id) {
        isLiked = true;
      }
    });
    this.setState({ isLiked: isLiked });
  }
  render() {
    const { post } = this.props;
    let classes = "";
    if (this.state.isLiked) {
      classes = "liked";
    }
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {post.postedBy.firstName} {post.postedBy.lastName}
          </p>
          <a href="#" className="card-header-icon" aria-label="more options">
            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </a>
        </header>
        <div className="card-content">
          <div className="content">
            {post.postContent}

            <br />
            <time dateTime="2016-1-1">{post.date.toLocaleString()}</time>
          </div>
        </div>
        <footer className="card-footer">
          <p
            onClick={this.handleLike}
            className={`card-footer-item ${classes}`}
          >
            {this.state.isLiked ? "Liked" : "Like"}
          </p>

          <a href="#" className="card-footer-item">
            Comment
          </a>
        </footer>
      </div>
    );
  }
}

export default withAuth(Post);
