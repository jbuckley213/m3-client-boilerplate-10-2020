import React, { Component } from "react";
import postService from "./../../lib/post-service";

class Comment extends Component {
  state = {
    isAdmin: false,
  };

  componentDidMount() {}

  handleIsAdmin = () => {
    const postedById = this.props.comment.postedBy._id;
    const currentUser = this.props.user._id;
    if (postedById === currentUser) {
      this.setState({ isAdmin: true });
    } else {
      this.setState({ isAdmin: false });
    }
  };

  deleteComment = (commentId) => {
    const postId = this.state.post._id;

    postService
      .deleteComment(postId, commentId)
      .then((apiResponse) => {
        console.log(apiResponse);
        this.handlePostById();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { comment } = this.props;
    console.log(comment);
    return (
      <div>
        <div className="comment-header" key={comment._id}>
          <img src={`${comment.createdBy.image}`} />
          <div className="comment-body">
            <h3>
              {comment.createdBy.firstName} {comment.createdBy.lastName}
              {isAdmin ? <button>delete</button> : null}
            </h3>

            <p>{comment.commentContent}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;
