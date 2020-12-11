import React from "react";
import authService from "./../lib/auth-service";

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
        this.setState({ isLoggedIn: true, user: user, isLoading: false })
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
      .then((user) => this.setState({ isLoggedIn: true, user }))
      .catch((err) => {
        this.setState({ isLoggedIn: false, user: null });
      });
  };

  logout = () => {
    authService
      .logout()
      .then(() => this.setState({ isLoggedIn: false, user: null }))
      .catch((err) => console.log(err));
  };

  me = () => {
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
    this.setState({ isDark: !this.state.isDark });
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
