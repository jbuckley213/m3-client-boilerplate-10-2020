import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import { Link } from "react-router-dom";

class Search extends Component {
  state = {
    users: [],
    searchResults: [],
    searchInput: "",
  };

  componentDidMount() {
    userService
      .getAll()
      .then((apiResponse) => {
        this.setState({
          users: apiResponse.data,
          searchResults: apiResponse.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSearchResults = (value) => {
    const { users } = this.state;

    const filteredUsers = users.filter((user) => {
      const lowercaseFirstName = user.firstName.toLowerCase();
      const lowercaseLastName = user.lastName.toLowerCase();
      const lowercaseSearch = value.toLowerCase();

      if (
        lowercaseFirstName.startsWith(lowercaseSearch) ||
        lowercaseLastName.startsWith(lowercaseSearch)
      ) {
        return true;
      } else {
        return false;
      }
    });

    this.setState({ searchResults: filteredUsers });
  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.handleSearchResults(value);
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
        {this.state.searchInput === ""
          ? null
          : this.state.searchResults.map((user) => {
              return (
                <Link key={user._id} to={`/profile/${user._id}`}>
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                </Link>
              );
            })}
      </div>
    );
  }
}

export default withAuth(Search);