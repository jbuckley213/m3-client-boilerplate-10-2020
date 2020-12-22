import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import postService from "./../lib/post-service";
import { Link } from "react-router-dom";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import Comment from "./../components/Comment/Comment";
import { LikeItem } from "./../styles/likeitem";
import { Theme } from "./../styles/themes";
import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

class PostDetails extends Component {
  state = {
    post: {},
    isLiked: false,
    commentInput: "",
    numberOfLikes: 0,
    numberOfComments: 0,
    showLikes: false,
    showPhoto: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    this.handlePostById();
  }

  componentWillUnmount() {
    console.log("unmount");
  }
  countNumberOfLikes = () => {
    let numberOfLikes = this.state.post.likes.length;
    this.setState({ numberOfLikes });
  };

  countNumberOfComments = () => {
    let numberOfComments = this.state.post.comments.length;
    this.setState({ numberOfComments });
  };

  setLike = () => {
    let isLiked = false;

    this.state.post.likes.forEach((user) => {
      if (user._id === this.props.user._id) {
        isLiked = true;
      }
    });

    this.setState({ isLiked: isLiked });
  };

  toggleLikes = () => {
    this.setState({ showLikes: !this.state.showLikes });
  };

  handlePostById = () => {
    const { postId } = this.props.match.params;
    postService
      .getById(postId)
      .then((apiResponse) => {
        this.setState({ post: apiResponse.data });
        this.setLike();
        this.countNumberOfLikes();
        this.countNumberOfComments();
      })
      .catch((err) => console.log(err));
  };

  handleLike = () => {
    if (!this.state.isLiked) {
      postService
        .likePost(this.state.post._id)
        .then((postLiked) => {
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
        .unlikePost(this.state.post._id)
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

  socketComment = () => {
    console.log("sockey run");
    socket.emit(
      "notification",
      { userId: this.state.post.postedBy._id, userLiked: this.props.user._id },
      () => {
        console.log("socket called");
      }
    );
  };

  handleInput = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    postService
      .comment(this.state.post._id, this.state.commentInput)
      .then((apiResponse) => {
        console.log(apiResponse.data);
        this.handlePostById();
        this.setState({ commentInput: "" });
        this.socketComment();
      });
  };

  showCommentInput = () => {
    return (
      <form onSubmit={this.handleSubmit} className="post-comment">
        <input
          name="commentInput"
          value={this.state.commentInput}
          onChange={this.handleInput}
          autoComplete="off"
          placeholder="Write your comment here..."
          required
        />
        <button
          id="comment-btn"
          className="button is-white s-size-7"
          type="submit"
        >
          Comment
        </button>
      </form>
    );
  };

  handlePostLinks = () => {
    const postContent = this.state.post.postContent.split(" ");
    console.log(postContent);

    const postContentWithLinkSplit = postContent.map((word) => {
      if (word.startsWith("http") || word.startsWith("https")) {
        return <a href={`${word}`}>{word}</a>;
      } else {
        return word;
      }
    });
    console.log(postContentWithLinkSplit);

    const postContentWithLink = postContentWithLinkSplit.join(" ");

    console.log(postContentWithLink);

    return <p>{postContentWithLinkSplit}</p>;
  };

  outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(0, 3).join(" ");

    const time = date.toLocaleString().split(" ").reverse()[0].slice(0, 5);
    return time + " " + day;
  };
  toggleShowPicture = () => {
    this.setState({ showPhoto: !this.state.showPhoto });
  };

  render() {
    const post = this.state.post;

    return (
      <div>
        <Theme dark={this.props.isDark}>
          <div id="post-details">
            <div className="post-main">
              <div>
                <img
                  src={post.postedBy && post.postedBy.image}
                  alt="user profile"
                />
              </div>
              <div className="post-section">
                <div className="post-user-info">
                  <Link to={`/profile/${post.postedBy && post.postedBy._id}`}>
                    <div className="post-user">
                      {" "}
                      {post.postedBy && post.postedBy.firstName}{" "}
                      {post.postedBy && post.postedBy.lastName}
                      {"   "}
                    </div>
                  </Link>
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
                ) : null}{" "}
                <div className="post-content"> {post.postContent}</div>
                <p className="like-btn" onClick={this.toggleLikes}>
                  Likes
                </p>
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

            <section className="comments">
              {post.comments &&
                post.comments.map((comment) => {
                  return (
                    <Comment
                      outputDate={this.outputDate}
                      key={comment._id}
                      getPostDetails={this.handlePostById}
                      comment={comment}
                    />
                  );
                })}

              <div>
                <div className="post-main">
                  <div>
                    <img src={`${this.props.user.image}`} alt="user profile" />
                  </div>
                  <div className="post-section">
                    <div className="post-user-info">
                      {" "}
                      <div className="post-user">
                        {" "}
                        {this.props.user.firstName} {this.props.user.lastName}
                        {"   "}
                      </div>{" "}
                    </div>{" "}
                    <div className="post-content">
                      {" "}
                      {this.showCommentInput()}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {this.state.showLikes ? (
              <div className="likes">
                <div className="like-content animated zoomIn">
                  <p
                    className="delete close-likes"
                    onClick={this.toggleLikes}
                  ></p>
                  {post.likes &&
                    post.likes.map((user) => {
                      return (
                        <Link to={`/profile/${user._id}`}>
                          <LikeItem>
                            <img src={`${user.image}`} alt="profile" />
                            <p className="like-item" key={user._id}>
                              {user.firstName} {user.lastName}
                            </p>{" "}
                          </LikeItem>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ) : null}
          </div>
        </Theme>
      </div>
    );
  }
}

export default withAuth(PostDetails);
