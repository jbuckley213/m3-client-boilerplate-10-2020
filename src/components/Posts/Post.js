import React, { Component } from "react";
import { withAuth } from "./../../context/auth-context";
import postService from "./../../lib/post-service";
import { Link } from "react-router-dom";
import { Theme } from "./../../styles/themes";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import InsertCommentIcon from "@material-ui/icons/InsertComment";

import "./Post.css";
import "bulma/css/bulma.css";

import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

class Post extends Component {
  state = {
    isliked: false,
    numberOfLikes: 0,
    numberOfComments: 0,
    showPhoto: false,
    highlightedContent: [],
  };

  countNumberOfLikes = () => {
    let numberOfLikes = this.props.post.likes.length;
    this.setState({ numberOfLikes });
  };

  countNumberOfComments = () => {
    let numberOfComments = this.props.post.comments.length;
    this.setState({ numberOfComments });
  };

  socketLike = () => {
    socket.emit(
      "notification",
      { userId: this.props.post.postedBy._id, userLiked: this.props.user._id },
      () => {
        console.log("socket called");
      }
    );
  };

  handleLike = () => {
    if (!this.state.isLiked) {
      postService
        .likePost(this.props.post._id)
        .then((postLiked) => {
          let numberOfLikes = this.state.numberOfLikes;
          numberOfLikes++;
          this.setState({ numberOfLikes: numberOfLikes });
          this.socketLike();
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
          this.setState({ numberOfLikes: numberOfLikes });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.setState({ isLiked: !this.state.isLiked });
  };

  outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(0, 3).join(" ");

    const time = date.toLocaleString().split(" ").reverse()[0].slice(0, 5);
    return time + " " + day;
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
    this.highlightSearchInput();
  }

  toggleShowPicture = () => {
    this.setState({ showPhoto: !this.state.showPhoto });
  };

  highlightSearchInput = () => {
    if (this.props.searchWord) {
      const postContent = this.props.post.postContent.split(" ");
      const searchWord = this.props.searchWord.toLowerCase();
      const capitalSeachWord = searchWord.toUpperCase();
      const highlightedContent = postContent.map((word) => {
        if (
          word.toLowerCase().includes(searchWord) ||
          word.includes(capitalSeachWord)
        ) {
          return <strong>{word}</strong>;
        } else {
          return word;
        }
      });
      // console.log(highlightedContent);

      this.setState({ highlightedContent: highlightedContent });
    }
  };

  render() {
    const { post } = this.props;
    // console.log("highlighted", this.state.highlightedContent);
    return (
      <div>
        {/* <div className="card"> */}
        <Theme dark={this.props.isDark}>
          {/* </div> */}
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
              </div>
              {post.postPhoto ? (
                <img
                  onClick={this.toggleShowPicture}
                  className="post-image"
                  style={{ width: "100px" }}
                  src={post.postPhoto && post.postPhoto}
                  alt=""
                ></img>
              ) : null}
              <Link to={`/postdetails/${post._id}`}>
                {" "}
                {/* <div className="post-content">{post.postContent}</div> */}
                <div className="post-content">
                  {this.state.highlightedContent.map((word, i) => {
                    return <span key={i}>{word} </span>;
                  })}
                </div>
              </Link>
              <div className="post-actions">
                {" "}
                <div onClick={this.handleLike}>
                  {this.state.isLiked ? (
                    <ThumbUpIcon fontSize="small" color="primary" />
                  ) : (
                    <ThumbUpIcon fontSize="small" /> //color="disabled"
                  )}{" "}
                  <div>{this.state.numberOfLikes}</div>
                </div>
                <div className="comment-icon">
                  <InsertCommentIcon />
                  <div>{this.state.numberOfComments}</div>
                </div>
              </div>
              {this.state.showPhoto ? (
                <img
                  onClick={this.toggleShowPicture}
                  className="large-img animated zoomIn"
                  src={post.postPhoto && post.postPhoto}
                  alt=""
                ></img>
              ) : null}
            </div>
          </div>
        </Theme>
      </div>
    );
  }
}

export default withAuth(Post);
