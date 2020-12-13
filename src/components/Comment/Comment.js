import React, { Component } from "react";
import postService from "./../../lib/post-service";
import { withAuth } from "./../../context/auth-context";

class Comment extends Component {
  state = {
    isAdmin: false,
  };

  componentDidMount() {
    this.handleIsAdmin();
  }

  handleIsAdmin = () => {
    const createdById = this.props.comment.createdBy._id;
    const currentUserId = this.props.user._id;
    console.log(createdById, currentUserId);
    if (createdById === currentUserId) {
      console.log(true);
      this.setState({ isAdmin: true });
    } else {
      this.setState({ isAdmin: false });
    }
  };

  deleteComment = () => {
    const postId = this.props.comment.post;
    const commentId = this.props.comment._id;
    postService
      .deleteComment(postId, commentId)
      .then((apiResponse) => {
        console.log("clicked");
        console.log(apiResponse);
        this.props.getPostDetails();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { comment } = this.props;

    return (
      <div>
        <div className="comment-header" key={comment._id}>
          <img src={`${comment.createdBy.image}`} />
          <div className="comment-body">
            <div className="delete-comment">
              <div>
                {comment.createdBy.firstName} {comment.createdBy.lastName}
              </div>
              {this.state.isAdmin ? (
                <p
                  onClick={this.deleteComment}
                  href="#"
                  className="delete-icon delete"
                ></p>
              ) : null}
            </div>

            <p>{comment.commentContent}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Comment);
