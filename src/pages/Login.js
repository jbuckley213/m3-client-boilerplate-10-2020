import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import { AuthStyle } from "./../styles/login";

class Login extends Component {
  state = { email: "", password: "" };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    // Call funciton coming from AuthProvider ( via withAuth )
    this.props.login(email, password);
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, password } = this.state;

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
          />

          <label>Password:</label>
          <input
            class="input is-primary"
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />

          <button className="button is-primary is-white" type="submit">
            Login
          </button>
        </form>
      </AuthStyle>
    );
  }
}

export default withAuth(Login);
