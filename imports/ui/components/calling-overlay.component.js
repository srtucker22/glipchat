import { browserHistory } from 'react-router';
import { CircularProgress } from 'material-ui/Progress';
import Colors from 'material-ui/colors';
import PropTypes from 'prop-types';
import Radium from 'radium';
import Button from 'material-ui/Button';
import React from 'react';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    color: 'white',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 3,
  },
};

export class CallingOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.leave = this.leave.bind(this);
  }

  leave() {
    browserHistory.push('/');
  }

  render() {
    const ringingComponent = (<div>
      <h3>Contacting...</h3>
      <CircularProgress mode="indeterminate" />
      <div style={{ display: 'block', paddingTop: '16px' }}>
        <Button
          raised
          color="accent"
          onTouchTap={this.leave}
        >
          {'Cancel'}
        </Button>
      </div>
    </div>);

    const connectingComponent = (<div>
      <h3>{'Connecting...'}</h3>
      <CircularProgress mode="indeterminate" />
    </div>);

    const contactsUnavailableComponent = (<div>
      <h3>{'Contacts Unavailable'}</h3>
      <h5>{'No contacts connected'}</h5>
      <div style={{ margin: 'auto', width: '100%' }}>
        {this.props.invitees ? (
          <Button
            raised
            color="accent"
            onTouchTap={this.props.retry}
            style={{ margin: '0 10px' }}
          >
            {'Retry'}
          </Button>
        ) : undefined}
        <Button
          raised
          color="accent"
          onTouchTap={this.leave}
        >
          {this.props.invitees ? 'Cancel' : 'Leave'}
        </Button>
      </div>
    </div>);

    const components = {
      connecting: connectingComponent,
      failed: contactsUnavailableComponent,
      ringing: ringingComponent,
    };

    // TODO: add back ringing
    return (
      <div onTouchTap={this.props.onTouchTap}>
        <div style={[GlobalStyles.table, styles.css]}>
          <div className="text-center" style={[GlobalStyles.cell]}>
            {components[this.props.status]}
          </div>
        </div>
      </div>
    );
  }
}
CallingOverlay.propTypes = {
  invitees: PropTypes.array,
  onTouchTap: PropTypes.func,
  retry: PropTypes.func,
  status: PropTypes.string,
};

export default Radium(CallingOverlay);
