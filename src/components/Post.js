import React, { Component } from "react";

class Post extends Component {
  render() {
    const { post } = this.props;
    return (
      <div>
        <p>
          {post.postedBy.firstName} {post.postedBy.lastName}
        </p>
        <p>{post.postContent}</p>
        <p>Number of Likes {post.likes.length}</p>
      </div>
    );
  }
}

export default Post;
