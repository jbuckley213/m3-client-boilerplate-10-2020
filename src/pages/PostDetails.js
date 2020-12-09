import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import postService from "./../lib/post-service";
import { Link } from "react-router-dom";

class PostDetails extends Component {
  state = {
    post: {},
    isLiked: false,
    commentInput: "",
  };

  componentDidMount() {
    this.handlePostById();
  }

  setLike = () => {
    let isLiked = false;

    this.state.post.likes.forEach((user) => {
      if (user._id === this.props.user._id) {
        isLiked = true;
      }
    });

    this.setState({ isLiked: isLiked });
  };

  handlePostById = () => {
    const { postId } = this.props.match.params;
    postService
      .getById(postId)
      .then((apiResponse) => {
        this.setState({ post: apiResponse.data });
        this.setLike();
      })
      .catch((err) => console.log(err));
  };

  handleLike = () => {
    if (!this.state.isLiked) {
      postService
        .likePost(this.state.post._id)
        .then((postLiked) => {
          console.log(postLiked);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (this.state.isLiked) {
      postService
        .unlikePost(this.state.post._id)
        .then((postUnliked) => {
          console.log(postUnliked);
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
      });
  };

  showCommentInput = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="commentInput"
          value={this.state.commentInput}
          onChange={this.handleInput}
          autoComplete="off"
        />
        <button type="submit">Submit</button>
      </form>
    );
  };

  displayComments = () => {
    return (
      <div>
        {this.state.post.comments &&
          this.state.post.comments.map((comment) => {
            return (
              <div key={comment._id}>
                <p>
                  {comment.createdBy.firstName} {comment.createdBy.lastName}
                </p>

                <p>{comment.commentContent}</p>
              </div>
            );
          })}
      </div>
    );
  };

  render() {
    let classes = "";
    if (this.state.isLiked) {
      classes = "liked";
    }
    const post = this.state.post;
    return (
      <div className="card">
        <header className="card-header">
          {post.postedBy && (
            <Link to={`/profile/${post.postedBy._id}`}>
              <p className="card-header-title">
                {post.postedBy && post.postedBy.firstName}{" "}
                {post.postedBy && post.postedBy.lastName}
              </p>
            </Link>
          )}

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
            <time dateTime="2016-1-1">
              {post.data && post.date.toLocaleString()}
            </time>
          </div>
        </div>

        <footer className="card-footer">
          <p
            onClick={this.handleLike}
            className={`card-footer-item ${classes}`}
          >
            {this.state.isLiked ? "Liked" : "Like"}
          </p>

          <p href="#" className="card-footer-item">
            Comment
          </p>
        </footer>

        <section>
          <h3>Comments:</h3>
          {this.displayComments()}

          {this.showCommentInput()}
        </section>
      </div>
    );
  }
}

export default withAuth(PostDetails);
