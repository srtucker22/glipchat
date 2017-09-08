import React from 'react';
import GlobalStyles from '../styles/global.styles';

const styles = {
  main: {
    css: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '20px 0',
    },
  },
};

export const NotFoundComponent = () => (
  <div>
    <div style={GlobalStyles.stickyFooterPage}>
      <div className="row">
        <div className="col-xs-12 text-center" style={styles.main.css}>
          <img src="/images/dog.png" />
          <p>page not found</p>
        </div>
      </div>
    </div>
  </div>
);

export default NotFoundComponent;
