import React from "react";

const { Consumer, Provider } = React.createContext();

class ThemeProvider extends React.Component {
  state = {
    isDark: false,
  };

  toggleTheme = () => {
    this.setState({ isDark: !this.state.isDark });
  };

  render() {
    const { isDark } = this.state;
    const { toggleTheme } = this;

    console.log(isDark);

    return (
      <Provider value={{ isDark, toggleTheme }}>{this.props.children}</Provider>
    );
  }
}

// HOC that converts regular component into a Consumer
const withTheme = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <Consumer>
          {(value) => {
            console.log(value);
            const { toggleTheme } = value;

            return (
              <WrappedComponent
                {...this.props}
                // isDark={isDark}
                toggleTheme={toggleTheme}
              />
            );
          }}
        </Consumer>
      );
    }
  };
};

export { ThemeProvider, withTheme };
