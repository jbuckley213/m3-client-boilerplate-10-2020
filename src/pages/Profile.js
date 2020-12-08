import React, { Component } from "react";
import { withAuth } from "./../context/auth-context";
import userService from "./../lib/user-service";
import Post from "./../components/Posts/Post";

class Profile extends Component {
  state = {
    user: {},
    isAdmin: false,
    userId: this.props.match.params.id,
  };

  componentDidMount() {
    const profileId = this.props.match.params.id;
    userService
      .getOne(profileId)
      .then((apiResponse) => {
        this.setState({
          user: apiResponse.data.user,
          isAdmin: apiResponse.data.isAdmin,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <p>
          {this.state.user.firstName} {this.state.user.lastName}
        </p>
        {this.state.isAdmin ? <p>Is Admin</p> : <p>Is not Admin</p>}

        {this.state.user.posts &&
          this.state.user.posts.map((post) => {
            return <Post key={post._id} post={post} />;
          })}
      </div>
    );
  }
}

export default withAuth(Profile);
