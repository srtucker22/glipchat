import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import Colors from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    color: Colors.fullWhite,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 3,
  },
};

export class CallingOverlayComponent extends React.Component {
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
        <RaisedButton
          label="Cancel"
          secondary
          onTouchTap={this.leave}
        />
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
        {this.props.invitees ? <RaisedButton
          label="Retry"
          secondary
          onTouchTap={this.props.retry}
          style={{ margin: '0 10px' }}
        /> : ''}
        <RaisedButton
          label={this.props.invitees ? 'Cancel' : 'Leave'}
          secondary
          onTouchTap={this.leave}
        />
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
CallingOverlayComponent.propTypes = {
  invitees: PropTypes.array,
  onTouchTap: PropTypes.func,
  retry: PropTypes.func,
  status: PropTypes.string,
};

export default Radium(CallingOverlayComponent);
