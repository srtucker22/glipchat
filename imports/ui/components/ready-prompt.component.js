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

export class ReadyPromptComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    return (
      <div onTouchTap={this.props.onTouchTap}>
        <div style={[GlobalStyles.table, styles.css]}>
          <div className="text-center" style={[GlobalStyles.cell]}>
            <p>Are you ready to join?</p>
            <Button
              raised
              color="accent"
              onTouchTap={this.props.joinRoomStream}
            >
              {'Join'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

ReadyPromptComponent.propTypes = {
  joinRoomStream: PropTypes.func,
  onTouchTap: PropTypes.func,
};

export default Radium(ReadyPromptComponent);
