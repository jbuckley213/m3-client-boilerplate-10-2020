import React, { Component } from "react";
import axios from "axios";

import { withAuth } from "../../context/auth-context";

//const ENDPOINT = "http://localhost:5000";

class PostInput extends Component {
  state = {
    post: "",
    postPhoto: "",
  };

  handleFileUpload = (e) => {
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
        this.setState({ postPhoto: response.data.secure_url });
      })
      .catch((err) => {
        console.log("Error while uploading the file: ", err);
      });
  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <form className="post-form" onSubmit={this.handleSubmit}>
        <div className="post-main">
          <div>
            <img src={this.props.user.image} alt="user profile" />
          </div>
          <div className="post-section">
            <div className="post-user-info">
              <div className="post-user">
                {" "}
                {this.props.user && this.props.user.firstName}{" "}
                {this.props.user && this.props.user.lastName}
                {"   "}
              </div>
            </div>
            {this.state.postPhoto === "" ? null : (
              <span>
                <img
                  style={{ width: "100px" }}
                  src={this.state.postPhoto && this.state.postPhoto}
                  alt=""
                ></img>
              </span>
            )}
            <textarea
              className="post"
              name="post"
              value={this.state.post}
              onChange={this.handleInput}
              placeholder="Share you code..."
              required
            />
            <div className="post-actions">
              <input
                name="postPhoto"
                type="file"
                // value={this.state.postPhoto}
                onChange={this.handleFileUpload}
              />
              <button className="button is-white s-size-7" type="submit">
                Post
              </button>{" "}
            </div>
          </div>
        </div>

        {this.state.postPhoto === "" ? null : (
          <span>
            <img
              style={{ width: "100px" }}
              src={this.state.postPhoto && this.state.postPhoto}
              alt=""
            ></img>
          </span>
        )}
      </form>
    );
  }
}

export default withAuth(PostInput);
