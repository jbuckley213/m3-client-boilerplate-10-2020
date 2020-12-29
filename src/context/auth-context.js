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
    isNewUser: false,
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
      .then((user) =>
        this.setState({ isLoggedIn: true, user, isNewUser: true })
      )
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

  closeNewUser = () => {
    this.setState({ isNewUser: false });
  };

  render() {
    const { isDark, isLoggedIn, isLoading, user, isNewUser } = this.state;
    const { toggleTheme, signup, login, logout, me, closeNewUser } = this;

    if (isLoading) return <p>Loading</p>;

    return (
      <Provider
        value={{
          isDark,
          isLoggedIn,
          isLoading,
          user,
          isNewUser,
          signup,
          login,
          logout,
          me,
          toggleTheme,
          closeNewUser,
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
              isNewUser,
              signup,
              login,
              logout,
              me,
              toggleTheme,
              closeNewUser,
            } = value;

            return (
              <WrappedComponent
                {...this.props}
                isDark={isDark}
                isLoggedIn={isLoggedIn}
                isLoading={isLoading}
                user={user}
                isNewUser={isNewUser}
                signup={signup}
                login={login}
                logout={logout}
                me={me}
                toggleTheme={toggleTheme}
                closeNewUser={closeNewUser}
              />
            );
          }}
        </Consumer>
      );
    }
  };
};

export { AuthProvider, withAuth };
