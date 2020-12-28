import React, { useState, useEffect } from "react";
import { withAuth } from "./../../context/auth-context";
import postService from "./../../lib/post-service";
import { Link } from "react-router-dom";
import { Theme } from "./../../styles/themes";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import DropDownComment from "./../DropDownComments/DropDownComment";
import "./Post.css";
import "bulma/css/bulma.css";

import io from "socket.io-client";

//const ENDPOINT = "http://localhost:5000";
const ENDPOINT = process.env.REACT_APP_API_URL;
let socket = io(ENDPOINT);

const Post = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);
  const [postContentLinks, setPostContentLinks] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const countNumberOfLikes = () => {
    let numberOfLikes = props.post.likes.length;
    setNumberOfLikes(numberOfLikes);
  };

  const countNumberOfComments = () => {
    let numberOfComments = props.post.comments.length;
    setNumberOfComments(numberOfComments);
  };

  const socketLike = () => {
    console.log("sockey run");
    socket.emit(
      "notification",
      { userId: props.post.postedBy._id, userLiked: props.user._id },
      () => {
        console.log("socket called");
      }
    );
  };

  const handleLike = () => {
    if (!isLiked) {
      postService
        .likePost(props.post._id)
        .then((postLiked) => {
          console.log(postLiked);
          let updateNumberOfLikes = numberOfLikes;
          updateNumberOfLikes++;
          setNumberOfLikes(updateNumberOfLikes);
          socketLike();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (isLiked) {
      postService
        .unlikePost(props.post._id)
        .then((postUnliked) => {
          let updateNumberOfLikes = numberOfLikes;
          updateNumberOfLikes--;
          console.log(updateNumberOfLikes);
          setNumberOfLikes(updateNumberOfLikes);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setIsLiked(!isLiked);
  };

  const outputDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toDateString().split(" ").slice(0, 3).join(" ");

    const time = date.toLocaleString().split(" ").reverse()[0].slice(0, 5);
    return time + " " + day;
  };

  useEffect(() => {
    let liked = false;
    if (props.post) {
      props.post.likes.forEach((likeId) => {
        if (likeId === props.user._id) {
          liked = true;
        }
      });
    }
    setIsLiked(liked);
    countNumberOfLikes();
    countNumberOfComments();
    handlePostContentWithLinks();
  }, []);

  const toggleShowPicture = () => {
    setShowPhoto(!showPhoto);
  };

  const socketComment = () => {
    console.log("sockey run");
    socket.emit(
      "notification",
      { userId: props.post.postedBy._id, userLiked: props.user._id },
      () => {
        console.log("socket called");
      }
    );
  };

  const handlePostContentWithLinks = () => {
    const postContent = props.post.postContent.split(" ");

    const postContentWithLinks = postContent.map((word) => {
      if (word.startsWith("http") || word.startsWith("https")) {
        return <a href={word}>{word}</a>;
      } else {
        return word;
      }
    });
    // console.log(highlightedContent);
    setPostContentLinks(postContentWithLinks);
  };

  const { post } = props;

  return (
    <div>
      {/* <div className="card"> */}
      <Theme dark={props.isDark}>
        {/* </div> */}
        <div className="post-main-page">
          <motion.li layout initial={{ borderRadius: 10 }}>
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
                  <div className="date">{outputDate(post.date)}</div>
                </div>
                {post.postPhoto ? (
                  <img
                    onClick={toggleShowPicture}
                    className="post-image"
                    style={{ width: "100px" }}
                    src={post.postPhoto && post.postPhoto}
                    alt=""
                  ></img>
                ) : null}
                {/* <Link to={`/postdetails/${post._id}`}> */}{" "}
                {/* <div className="post-content">{post.postContent}</div> */}
                <div className="post-content">
                  {postContentLinks.map((word, i) => {
                    return <span key={i}>{word} </span>;
                  })}
                </div>
                {post.code && (
                  <code>
                    <pre>{post.code}</pre>
                  </code>
                )}
                {/* </Link> */}
                <div className="post-actions">
                  {" "}
                  <div onClick={handleLike}>
                    {isLiked ? (
                      <ThumbUpIcon
                        fontSize="small"
                        color="primary"
                        className="like-btn-animate"
                      />
                    ) : (
                      <ThumbUpIcon fontSize="small" /> //color="disabled"
                    )}{" "}
                    <div>{numberOfLikes}</div>
                  </div>
                  <div onClick={toggleOpen} className="comment-icon">
                    <InsertCommentIcon />
                    <div>{numberOfComments}</div>
                  </div>
                </div>
                {showPhoto ? (
                  <img
                    onClick={toggleShowPicture}
                    className="large-img animated zoomIn"
                    src={post.postPhoto && post.postPhoto}
                    alt=""
                  ></img>
                ) : null}
              </div>
            </div>
          </motion.li>
          <AnimatePresence>
            {isOpen && (
              <DropDownComment
                comments={post.comments}
                postId={post._id}
                socketComment={socketComment}
              />
            )}
          </AnimatePresence>
        </div>
      </Theme>
    </div>
  );
};

export default withAuth(Post);
