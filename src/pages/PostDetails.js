import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import postService from "./../lib/post-service";
import { Link } from "react-router-dom";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import Comment from "./../components/Comment/Comment";

class PostDetails extends Component {
  state = {
    post: {},
    isLiked: false,
    commentInput: "",
    numberOfLikes: 0,
    numberOfComments: 0,
    showLikes: false,
  };

  componentDidMount() {
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
      });
  };

  showCommentInput = () => {
    return (
      <form onSubmit={this.handleSubmit} className="post">
        <input
          name="commentInput"
          value={this.state.commentInput}
          onChange={this.handleInput}
          autoComplete="off"
        />
        <button className="button is-white s-size-7" type="submit">
          Submit
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

  render() {
    let classes = "";
    if (this.state.isLiked) {
      classes = "liked";
    }
    const post = this.state.post;

    return (
      <div className="card card-details">
        <header className="card-header">
          {post.postedBy && (
            <Link to={`/profile/${post.postedBy._id}`}>
              <div className="card-header-title">
                <img src={post.postedBy.image} alt="profile" />
                <div>
                  {post.postedBy && post.postedBy.firstName}{" "}
                  {post.postedBy && post.postedBy.lastName}
                </div>
              </div>
            </Link>
          )}

          <p href="#" className="card-header-icon" aria-label="more options">
            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </p>
        </header>
        {post.postPhoto ? (
          <img
            style={{ width: "100px" }}
            src={post.postPhoto && post.postPhoto}
            alt=""
          ></img>
        ) : null}
        <div className="card-content">
          <div className="date">{this.outputDate(post.date)}</div>

          <div className="content">
            <p>{post.postContent}</p>
            <br />
            <time dateTime="2016-1-1">
              {post.data && post.date.toLocaleString()}
            </time>
            <p onClick={this.toggleLikes}>Likes</p>
          </div>
        </div>

        <footer className="card-footer">
          <div
            onClick={this.handleLike}
            className={`card-footer-item ${classes}`}
          >
            {this.state.isLiked ? (
              <ThumbUpIcon color="primary" />
            ) : (
              <ThumbUpIcon color="disabled" />
            )}{" "}
            <div>{this.state.numberOfLikes}</div>
          </div>

          <div className="card-footer-item">
            <InsertCommentIcon />
            <div>{this.state.numberOfComments}</div>
          </div>
        </footer>

        <section className="comments">
          {post.comments &&
            post.comments.map((comment) => {
              return (
                <Comment
                  key={comment._id}
                  getPostDetails={this.handlePostById}
                  comment={comment}
                />
              );
            })}

          {this.showCommentInput()}
        </section>
        {this.state.showLikes ? (
          <div className="likes">
            {post.likes &&
              post.likes.map((user) => {
                return (
                  <p key={user._id}>
                    {user.firstName} {user.lastName}
                  </p>
                );
              })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withAuth(PostDetails);
