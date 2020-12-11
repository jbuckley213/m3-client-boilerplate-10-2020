import React, { Component } from "react";
import userService from "./../../lib/user-service";
import axios from "axios";

class EditProfile extends Component {
  state = {
    image: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    userService
      .editPhoto(this.state.image)
      .then((apiResponse) => {
        console.log(apiResponse);
        this.setState({ image: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleFileUpload = (e) => {
    console.log("The file to be uploaded is: ", e.target.files);
    const file = e.target.files[0];

    const uploadData = new FormData();
    // image => this name has to be the same as in the model since we pass
    // req.body to .create() method when creating a new project in '/api/projects' POST route
    uploadData.append("image", file);

    axios
      .post("http://localhost:5000/api/users/upload", uploadData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("response is: ", response);
        // after the console.log we can see that response carries 'secure_url' which we can use to update the state
        this.setState({ image: response.data.secure_url });
      })
      .catch((err) => {
        console.log("Error while uploading the file: ", err);
      });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            name="image"
            type="file"
            // value={this.state.image}
            onChange={this.handleFileUpload}
          />

          {this.state.postPhoto === "" ? null : (
            <span>
              <img
                style={{ width: "100px" }}
                src={this.state.postPhoto && this.state.postPhoto}
                alt=""
              ></img>
            </span>
          )}
          <button type="submit">Save Changes</button>
        </form>
      </div>
    );
  }
}

export default EditProfile;
