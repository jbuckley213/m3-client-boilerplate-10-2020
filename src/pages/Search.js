import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import { Theme } from "./../styles/themes";
import SearchResult from "./../components/SeachResult/SearchResult";

class Search extends Component {
  state = {
    users: [],
    searchResults: [],
    searchInput: "",
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    userService
      .getAll()
      .then((apiResponse) => {
        this.setState({
          users: apiResponse.data,
        });
        this.filterSearch();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  filterSearch = () => {
    const users = this.state.users;

    const filteredUsers = users.filter((user) => {
      if (user._id === this.props.user._id) {
        return false;
      } else {
        return true;
      }
    });

    this.setState({ users: filteredUsers, searchResults: filteredUsers });
  };

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
      <Theme dark={this.props.isDark}>
        <div className="search">
          <h1>Search For A Fellow Developer</h1>
          <input
            className="input is-primary"
            name="searchInput"
            value={this.state.searchInput}
            onChange={this.handleInput}
            autoComplete="off"
          />
          {this.state.searchInput === "" ? null : (
            <div className="animated slideInLeft">
              <table>
                <tbody>
                  {this.state.searchResults.length === 0
                    ? "Not results found"
                    : this.state.searchResults.map((user) => {
                        return (
                          <SearchResult key={user._id} userSearch={user} />
                        );
                      })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Theme>
    );
  }
}

export default withAuth(Search);
