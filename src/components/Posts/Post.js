import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import postService from "./../../lib/post-service";
import { Link } from "react-router-dom";

import "./Post.css";
import "bulma/css/bulma.css";

class Post extends Component {
  state = {
    isliked: false,
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
          console.log(postLiked);
          let numberOfLikes = this.state.numberOfLikes;
          numberOfLikes++;
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

  // handleLike = () => {
  //   if (!this.state.isLiked) {
  //     let numberOfLikes = this.state.numberOfLikes;
  //     numberOfLikes++;
  //     this.setState({ numberOfLikes: numberOfLikes });
  //   }
  //   if (this.state.isLiked) {
  //     let numberOfLikes = this.state.numberOfLikes;
  //     numberOfLikes--;
  //     this.setState({ numberOfLikes: numberOfLikes });
  //   }
  //   this.setState({ isLiked: !this.state.isLiked });
  // };

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

  // componentWillUnmount() {
  //   if (!this.state.isLiked) {
  //     postService
  //       .likePost(this.props.post._id)
  //       .then((postLiked) => {
  //         console.log("Post liked");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  //   if (this.state.isLiked) {
  //     postService
  //       .unlikePost(this.props.post._id)
  //       .then((postUnliked) => {
  //         console.log("Post unliked");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }
  render() {
    const { post } = this.props;
    let classes = "";
    if (this.state.isLiked) {
      classes = "liked";
    }
    return (
      <div className="card">
        <header className="card-header">
          <img src={post.postedBy.image} alt="user profile" />
          <p className="card-header-title">
            {post.postedBy && post.postedBy.firstName}{" "}
            {post.postedBy && post.postedBy.lastName}
          </p>
          <p href="#" className="card-header-icon" aria-label="more options">
            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </p>
        </header>
        <Link to={`/postdetails/${post._id}`}>
          <div className="card-content">
            <div className="content">
              {post.postPhoto ? (
                <img
                  style={{ width: "100px" }}
                  src={post.postPhoto && post.postPhoto}
                  alt=""
                ></img>
              ) : null}
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

          <p href="#" className="card-footer-item">
            Comment {this.state.numberOfComments}
          </p>
        </footer>
      </div>
    );
  }
}

export default withAuth(Post);
