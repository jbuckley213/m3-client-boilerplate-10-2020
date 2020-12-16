import React from "react";
import authService from "./../lib/auth-service";
import userService from "./../lib/user-service";

const { Consumer, Provider } = React.createContext();

class AuthProvider extends React.Component {
  state = {
    isLoggedIn: false,
    isLoading: true,
    user: null,
    isDark: false,
  };

  componentDidMount() {
    authService
      .me()
      .then((user) =>
        this.setState({
          isLoggedIn: true,
          user: user,
          isLoading: false,
          isDark: user.darkMode,
        })
      )
      .catch((err) =>
        this.setState({ isLoggedIn: false, user: null, isLoading: false })
      );
  }

  signup = (firstName, lastName, image, email, password) => {
    authService
      .signup(firstName, lastName, image, email, password)
      .then((user) => this.setState({ isLoggedIn: true, user }))
      .catch((err) => {
        this.setState({ isLoggedIn: false, user: null });
      });
  };

  login = (email, password) => {
    authService
      .login(email, password)
      .then((user) => {
        console.log("error");
        this.setState({ isLoggedIn: true, user });
      })
      .catch((err) => {
        console.log("error");

        this.setState({
          isLoggedIn: false,
          user: null,
        });
      });

    return "Username or password not correct";
  };

  logout = () => {
    authService
      .logout()
      .then(() => this.setState({ isLoggedIn: false, user: null }))
      .catch((err) => console.log(err));
  };

  me = () => {
    console.log("me called");
    authService
      .me()
      .then((user) => {
        this.setState({ user });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggleTheme = () => {
    const isDark = this.state.isDark;
    let mode = "";
    if (isDark) {
      mode = "light";
    } else {
      mode = "dark";
    }

    userService
      .darkView(mode)
      .then((apiResponse) => {
        console.log(apiResponse);
        this.setState({ isDark: !this.state.isDark });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { isDark, isLoggedIn, isLoading, user } = this.state;
    const { toggleTheme, signup, login, logout, me } = this;

    if (isLoading) return <p>Loading</p>;

    return (
      <Provider
        value={{
          isDark,
          isLoggedIn,
          isLoading,
          user,
          signup,
          login,
          logout,
          me,
          toggleTheme,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

// HOC that converts regular component into a Consumer
const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <Consumer>
          {(value) => {
            const {
              isLoggedIn,
              isDark,
              isLoading,
              user,
              signup,
              login,
              logout,
              me,
              toggleTheme,
            } = value;

            return (
              <WrappedComponent
                {...this.props}
                isDark={isDark}
                isLoggedIn={isLoggedIn}
                isLoading={isLoading}
                user={user}
                signup={signup}
                login={login}
                logout={logout}
                me={me}
                toggleTheme={toggleTheme}
              />
            );
          }}
        </Consumer>
      );
    }
  };
};

export { AuthProvider, withAuth };
