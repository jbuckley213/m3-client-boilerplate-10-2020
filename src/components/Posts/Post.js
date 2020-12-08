import React, { Component } from "react";
import "./Post.css";
import "bulma/css/bulma.css";

class Post extends Component {
  render() {
    const { post } = this.props;
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {post.postedBy.firstName} {post.postedBy.lastName}
          </p>
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
            <time dateTime="2016-1-1">{post.date.toLocaleString()}</time>
          </div>
        </div>
        <footer className="card-footer">
          <a href="#" className="card-footer-item">
            Save
          </a>
          <a href="#" className="card-footer-item">
            Edit
          </a>
          <a href="#" className="card-footer-item">
            Delete
          </a>
        </footer>
      </div>
    );
  }
}

export default Post;
