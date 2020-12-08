import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";

class Search extends Component {
  state = {
    users: [],
    searchResults: [],
    searchInput: "",
  };

  componentDidMount() {
    userService.getAll().then((apiResponse) => {
      this.setState({
        users: apiResponse.data,
        searchResults: apiResponse.data,
      });
    });
  }

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div>
        <input
          name="searchInput"
          value={this.state.searchInput}
          onChange={this.handleInput}
        />

        {this.state.users.map((user) => {
          return <p>{user.firstName}</p>;
        })}
      </div>
    );
  }
}

export default withAuth(Search);
