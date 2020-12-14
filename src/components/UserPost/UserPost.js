import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import postService from "./../../lib/post-service";
import { Link } from "react-router-dom";
import { Theme } from "./../../styles/themes";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import InsertCommentIcon from "@material-ui/icons/InsertComment";

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

  outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(0, 3).join(" ");

    const time = date.toLocaleString().split(" ").reverse()[0].slice(0, 5);
    return time + " " + day;
  };

  render() {
    const { post } = this.props;
    let classes = "";
    if (this.state.isLiked) {
      classes = "liked";
    }
    return (
      <Theme dark={this.props.isDark}>
        {/* <header className="card-header">
            <p className="card-header-title">
              {post.postedBy && post.postedBy.firstName}{" "}
              {post.postedBy && post.postedBy.lastName}
            </p>
            <p
              onClick={this.toggleDelete}
              href="#"
              className="delete-icon delete"
            ></p>
            <p href="#" className="card-header-icon" aria-label="more options">
              <span className="icon">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </p>
          </header> */}

        {/* {post.postPhoto ? (
            <img
              style={{ width: "100px" }}
              src={post.postPhoto && post.postPhoto}
              alt=""
            ></img>
          ) : null}
          {this.state.showDelete ? (
            <div>
              <button
                className="button is-warning is-light is-size-7"
                onClick={() => this.props.deletePost(post._id)}
              >
                Confirm Delete
              </button>
              <button
                className="button is-info is-light is-size-7"
                onClick={this.toggleDelete}
              >
                Cancel
              </button>
            </div>
          ) : null} */}

        {/* <Link to={`/postdetails/${post._id}`}>
            <div className="card-content">
              <div className="date">{this.outputDate(post.date)}</div>

              <div className="content">
                {post.postContent} <br />
              </div>
            </div>
          </Link> */}
        {/* <footer className="card-footer">
            <div
              onClick={this.handleLike}
              className={`card-footer-item ${classes}`}
            >
              {this.state.isLiked ? (
                <ThumbUpIcon color="primary" />
              ) : (
                <ThumbUpIcon color="disabled" />
              )}{" "}
              <div> {this.state.numberOfLikes}</div>
            </div>

            <div className="card-footer-item">
              <InsertCommentIcon />
              <div>{this.state.numberOfComments}</div>
            </div>
          </footer> */}
        <div>
          <div className="post-main">
            <div>
              <img src={post.postedBy.image} alt="user profile" />
            </div>
            <div className="post-section">
              <div className="post-user-info">
                <div className="post-user">
                  {" "}
                  {post.postedBy && post.postedBy.firstName}{" "}
                  {post.postedBy && post.postedBy.lastName}
                  {"   "}
                </div>
                <div className="date">{this.outputDate(post.date)}</div>
                <p
                  onClick={this.toggleDelete}
                  href="#"
                  className="delete-icon delete is-size-7"
                ></p>
                {this.state.showDelete ? (
                  <div>
                    <button
                      className="button is-warning is-light is-size-7"
                      onClick={() => this.props.deletePost(post._id)}
                    >
                      Confirm Delete
                    </button>
                    <button
                      className="button is-info is-light is-size-7"
                      onClick={this.toggleDelete}
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}{" "}
              </div>
              <div className="post-content">
                {post.postPhoto ? (
                  <img
                    className="post-image"
                    style={{ width: "100px" }}
                    src={post.postPhoto && post.postPhoto}
                    alt=""
                  ></img>
                ) : null}
                {post.postContent}
              </div>
              <div className="post-actions">
                {" "}
                <div onClick={this.handleLike}>
                  {this.state.isLiked ? (
                    <ThumbUpIcon fontSize="small" color="primary" />
                  ) : (
                    <ThumbUpIcon fontSize="small" color="disabled" />
                  )}{" "}
                  <div>{this.state.numberOfLikes}</div>
                </div>
                <div className="comment-icon">
                  <InsertCommentIcon />
                  <div>{this.state.numberOfComments}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Theme>
    );
  }
}

export default withAuth(Post);
