import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import postService from "./../../lib/post-service";
import { Link } from "react-router-dom";

// import "./../Posts/Post.css";
import "bulma/css/bulma.css";

class Post extends Component {
  state = {
    isliked: false,
    showDelete: false,
    numberOfLikes: 0,
    numberOfComments: 0,
  };

  countNumberOfLikes = () => {
    let numberOfLikes = this.props.post.likes.length;
    this.setState({ numberOfLikes });
  };

  countNumberOfComments = () => {
    let numberOfComments = this.props.post.comments.length;
    this.setState({ numberOfComments });
  };

  handleLike = () => {
    if (!this.state.isLiked) {
      postService
        .likePost(this.props.post._id)
        .then((postLiked) => {
          let numberOfLikes = this.state.numberOfLikes;
          numberOfLikes++;
          console.log(numberOfLikes);
          this.setState({ numberOfLikes: numberOfLikes });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (this.state.isLiked) {
      postService
        .unlikePost(this.props.post._id)
        .then((postUnliked) => {
          let numberOfLikes = this.state.numberOfLikes;
          numberOfLikes--;
          console.log(numberOfLikes);
          this.setState({ numberOfLikes: numberOfLikes });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.setState({ isLiked: !this.state.isLiked });
  };

  componentDidMount() {
    let isLiked = false;
    if (this.props.post) {
      this.props.post.likes.forEach((likeId) => {
        if (likeId === this.props.user._id) {
          isLiked = true;
        }
      });
    }
    this.setState({ isLiked: isLiked });
    this.countNumberOfLikes();
    this.countNumberOfComments();
  }

  toggleDelete = () => {
    this.setState({ showDelete: !this.state.showDelete });
  };
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
            {post.postedBy && post.postedBy.firstName}{" "}
            {post.postedBy && post.postedBy.lastName}
          </p>
          <a href="#" className="card-header-icon" aria-label="more options">
            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </a>
        </header>
        {post.postPhoto ? (
          <img
            style={{ width: "100px" }}
            src={post.postPhoto && post.postPhoto}
            alt=""
          ></img>
        ) : null}

        <Link to={`/postdetails/${post._id}`}>
          <div className="card-content">
            <div className="content">
              {post.postContent}

              <br />
              <time dateTime="2016-1-1">
                {post.data && post.date.toLocaleString()}
              </time>
            </div>
          </div>
        </Link>
        <footer className="card-footer">
          <p
            onClick={this.handleLike}
            className={`card-footer-item ${classes}`}
          >
            {this.state.isLiked ? "Liked" : "Like"} {this.state.numberOfLikes}
          </p>

          <p onClick={this.toggleDelete} href="#" className="card-footer-item">
            Delete {this.state.comments}
          </p>
          {this.state.showDelete ? (
            <div>
              <button onClick={() => this.props.deletePost(post._id)}>
                Confirm Delete
              </button>
              <button onClick={this.toggleDelete}>Cancel</button>
            </div>
          ) : null}
        </footer>
      </div>
    );
  }
}

export default withAuth(Post);