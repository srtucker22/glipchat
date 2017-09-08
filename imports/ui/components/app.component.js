import { connect } from 'react-redux';
import Browser from 'bowser';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import PropTypes from 'prop-types';
import React from 'react';
import * as Actions from '../actions/actions';

const styles = {
  css: {
    height: 'inherit',
  },
};

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.constructor.childContextTypes = {
      muiTheme: PropTypes.object,
    };
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

  getChildContext() {
    return {
      muiTheme: getMuiTheme(lightBaseTheme),
    };
  }

  render() {
    return (
      <div style={styles.css}>
        {this.props.children}
      </div>
    );
  }
}

AppComponent.propTypes = {
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
)(AppComponent);
