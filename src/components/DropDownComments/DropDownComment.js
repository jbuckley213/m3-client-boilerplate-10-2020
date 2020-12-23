import React, { useState, useEffect } from "react";
import Comment from "./../Comment/Comment";
import { motion } from "framer-motion";
import { withAuth } from "./../../context/auth-context";
import postService from "./../../lib/post-service";
import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

function DropDownComment(props) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleInput = (event) => {
    const { value } = event.target;

    setComment(value);
  };

  useEffect(() => {
    handlePostById();
  }, []);

  const handlePostById = () => {
    postService
      .getById(props.postId)
      .then((apiResponse) => {
        console.log(apiResponse.data);
        setComments(apiResponse.data.comments);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    postService.comment(props.postId, comment).then((apiResponse) => {
      console.log(apiResponse.data);
      handlePostById();
      setComment("");
      props.socketComment();
    });
  };

  const showCommentInput = () => {
    return (
      <form onSubmit={handleSubmit} className="post-comment">
        <input
          name="commentInput"
          value={comment}
          onChange={handleInput}
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {comments.map((comment) => {
        return <Comment comment={comment} getPostDetails={handlePostById} />;
      })}

      <div className="comment-main post-main">
        <div>
          <img src={`${props.user.image}`} alt="user profile" />
        </div>
        <div className="post-section">
          <div className="post-user-info">
            {" "}
            <div className="post-user">
              {" "}
              {props.user.firstName} {props.user.lastName}
              {"   "}
            </div>{" "}
          </div>{" "}
          <div className="post-content"> {showCommentInput()}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default withAuth(DropDownComment);
