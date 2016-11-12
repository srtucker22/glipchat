import React from 'react';
import Radium from 'radium';
import GlobalStyles from '../styles/global.styles';

const styles = {
  table: {
    css: {
      // position: 'relative',
      'width': '100%',
      ':hover': {
        background: '#ababab',
      },
    },
  },
  cell: {
    css: {
      padding: 10,
    },
  },
  dot: {
    css: {
      height: '20px',
      width: '20px',
      borderRadius: '50%',
    },
  },
};

export const ContactListItemComponent = ({user, onClick, action})=> {
  return (
    <div
      style={[
        GlobalStyles.table, styles.table.css,
      ]}
      onClick={onClick.bind(user)}>
      <div style={[
        GlobalStyles.cell,
        styles.cell.css,
        {width: 50, height: 50},
      ]}>
        <img style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
          }} src={user.src}/>
      </div>
      <div style={[GlobalStyles.cell, styles.cell.css]}>
        {user.name || user.email || user.label}
      </div>
      <div style={[GlobalStyles.cell, styles.cell.css]}>
      </div>
      <div className="text-left" style={[
        GlobalStyles.cell,
        styles.cell.css,
        {width: '50px'},
      ]}>
        <div style={[
            styles.dot.css,
            {background: !!user.status && user.status.online ? 'green' : 'red'},
          ]}>
        </div>
      </div>
    </div>
  );
};

ContactListItemComponent.propTypes = {
  action: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.string,
  ]),
  user: React.PropTypes.object,
  onTouchTap: React.PropTypes.func,
};

export default Radium(ContactListItemComponent);
