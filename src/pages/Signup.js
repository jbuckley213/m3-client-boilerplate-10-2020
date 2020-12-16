import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { withAuth } from "./../context/auth-context";
import { SignUpStyle } from "./../styles/login";
// import userService from "./../lib/user-service";

class Signup extends Component {
  state = { firstName: "", lastName: "", image: "", email: "", password: "" };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, image, email, password } = this.state;
    this.props.signup(firstName, lastName, image, email, password);
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileUpload = (e) => {
    console.log("The file to be uploaded is: ", e.target.files);
    const file = e.target.files[0];

    const uploadData = new FormData();
    // image => this name has to be the same as in the model since we pass
    // req.body to .create() method when creating a new project in '/api/projects' POST route
    uploadData.append("image", file);

    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/upload`, uploadData, {
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
    const { firstName, lastName, image, email, password } = this.state;
    return (
      <SignUpStyle>
        <h1>Sign Up</h1>

        <form onSubmit={this.handleFormSubmit}>
          <label>Profile Pic</label>
          <input
            className="input is-primary"
            name="image"
            type="file"
            onChange={this.handleFileUpload}
          ></input>
          <span>
            <img style={{ width: "100px" }} src={image && image} alt=""></img>
          </span>

          <label>First Name:</label>
          <input
            className="input is-primary"
            type="text"
            name="firstName"
            value={firstName}
            onChange={this.handleChange}
            required
          />
          <br />
          <label>Last Name:</label>
          <input
            className="input is-primary"
            type="text"
            name="lastName"
            value={lastName}
            onChange={this.handleChange}
            required
          />
          <br />
          <label>Email:</label>
          <input
            className="input is-primary"
            type="text"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <br />
          <label>Password:</label>
          <input
            className="input is-primary"
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            required
          />

          <button className="button is-primary is-white" type="submit">
            {" "}
            Signup{" "}
          </button>
        </form>

        <div>
          <p>Already have account?</p>
          <button className="signup-btn button is-link is-light">
            <Link to={"/login"}> Login</Link>
          </button>
        </div>
      </SignUpStyle>
    );
  }
}

export default withAuth(Signup);

// const EnhancedSignup = withAuth(Signup)
// export default EnhancedSignup;
