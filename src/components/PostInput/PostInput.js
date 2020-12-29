import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import postService from "./../../lib/post-service";
import PostMenuDropDown from "./../PostMenuDropDown/PostMenuDropDown";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PhotoIcon from "@material-ui/icons/Photo";
import CodeIcon from "@material-ui/icons/Code";
import { withAuth } from "../../context/auth-context";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";

import "./PostInput.css";

const PostInput = (props) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [input, setInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      post: "",
      postPhoto: "",
      code: "",
    }
  );
  const [showCodeAndImageInput, setshowCodeAndImageInput] = useState(false);

  const handleFileUpload = (e) => {
    console.log("The file to be uploaded is: ", e.target.files);
    const file = e.target.files[0];

    const uploadData = new FormData();
    // image => this name has to be the same as in the model since we pass
    // req.body to .create() method when creating a new project in '/api/projects' POST route
    uploadData.append("image", file);

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/posts/upload`, uploadData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("response is: ", response);
        // after the console.log we can see that response carries 'secure_url' which we can use to update the state
        setInput({ postPhoto: response.data.secure_url });
      })
      .catch((err) => {
        console.log("Error while uploading the file: ", err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    postService
      .createPost(props.user._id, input.post, input.postPhoto, input.code)
      .then((createdPost) => {
        console.log(createdPost);

        setInput({ postPhoto: "", post: "", code: "" });

        props.handleComponentSubmit(createdPost);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInput({ [name]: value });
  };

  const toggleCodeInput = () => {
    setShowCodeInput(!showCodeInput);
  };

  const toggleCodeAndImageInput = () => {
    setshowCodeAndImageInput(!showCodeAndImageInput);
  };

  return (
    <AnimateSharedLayout>
      <AnimatePresence>
        <form className="post-form" onSubmit={handleSubmit}>
          <div className="post-main">
            <div>
              <img src={props.user.image} alt="user profile" />
            </div>
            <div className="post-section">
              <div className="post-user-info">
                <div className="post-user">
                  {" "}
                  {props.user && props.user.firstName}{" "}
                  {props.user && props.user.lastName}
                  {"   "}
                </div>
              </div>
              {/* {this.state.postPhoto === "" ? null : (
                  <span>
                    <img
                      style={{ width: "50px" }}
                      src={this.state.postPhoto && this.state.postPhoto}
                      alt=""
                    ></img>
                  </span>
                )} */}
              <textarea
                className="post"
                name="post"
                value={input.post}
                onChange={handleInput}
                placeholder="Share your thoughts........"
                required
              />
              {showCodeInput && (
                <textarea
                  className="post"
                  name="code"
                  className="code-input"
                  value={input.code}
                  onChange={handleInput}
                  placeholder="Share your code..."
                />
              )}

              <div className="post-actions-input">
                {/* <PostMenuDropDown /> */}
                <div className="photo-code-buttons-moblie">
                  <MoreVertIcon onClick={toggleCodeAndImageInput} />
                  <AnimatePresence>
                    {showCodeAndImageInput && (
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {" "}
                        <div className="moble-photo-upload">
                          <div className="photo-upload">
                            <PhotoIcon />
                          </div>
                          <input
                            name="postPhoto"
                            type="file"
                            placeholder="Upload photo"
                            // value={this.state.postPhoto}
                            onChange={handleFileUpload}
                          />
                        </div>
                        <div
                          onClick={() => {
                            toggleCodeInput();
                            toggleCodeAndImageInput();
                          }}
                          className="photo-upload"
                        >
                          <CodeIcon />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button className="button s-size-7" type="submit">
                    Post
                  </button>{" "}
                </div>
                <div className="photo-code-buttons">
                  <div>
                    <div className="photo-upload">
                      <PhotoIcon />
                    </div>
                    <input
                      name="postPhoto"
                      type="file"
                      // value={this.state.postPhoto}
                      onChange={handleFileUpload}
                    />
                    <div onClick={toggleCodeInput} className="photo-upload">
                      <CodeIcon />
                    </div>
                  </div>
                  <button className="button s-size-7" type="submit">
                    Post
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>

          {input.postPhoto === "" ? null : (
            <span>
              <img
                style={{ width: "100px" }}
                src={input.postPhoto && input.postPhoto}
                alt=""
              ></img>
            </span>
          )}
        </form>
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export default withAuth(PostInput);
