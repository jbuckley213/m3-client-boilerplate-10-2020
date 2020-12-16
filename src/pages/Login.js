import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import { AuthStyle } from "./../styles/login";
import "animate.css/source/animate.css";

class Login extends Component {
  state = { email: "", password: "", errorMessage: false };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    // Call funciton coming from AuthProvider ( via withAuth )
    const errorMessage = this.props.login(email, password);
    // console.log("lsdfhbvlsdhfbv", errorMessage);
    this.setState({ errorMessage: true });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, password } = this.state;
    console.log();
    return (
      <AuthStyle>
        <h1>Login</h1>

        <form onSubmit={this.handleFormSubmit}>
          <label>Email:</label>
          <input
            class="input is-primary"
            type="text"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
          />

          <label>Password:</label>
          <input
            class="input is-primary"
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            required
          />

          <button className="button is-primary is-white" type="submit">
            Login
          </button>
        </form>
        {this.state.errorMessage ? (
          <div className="login-error animated fadeIn">
            Email or password is incorrect
          </div>
        ) : null}
      </AuthStyle>
    );
  }
}

export default withAuth(Login);
