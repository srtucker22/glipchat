import { connect } from 'react-redux';
import Browser from 'bowser';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import * as Actions from '../actions/actions';

const styles = {
  css: {
    height: 'inherit',
  },
};

const theme = createMuiTheme();

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { mobile, tablet } = Browser;
    if (!this.props.user && !mobile && !tablet) {
      this.props.dispatch(Actions.loginAsGuest());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mobile, tablet } = Browser;
    if (!nextProps.user && !mobile && !tablet) {
      this.props.dispatch(Actions.loginAsGuest());
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div style={styles.css}>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
  children: PropTypes.element,
};

const mapStateToProps = ({
  users: { user },
}) => ({
  user,
});

export default connect(
  mapStateToProps,
)(App);
