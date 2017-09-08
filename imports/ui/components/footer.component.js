import PropTypes from 'prop-types';
import React from 'react';
import Radium from 'radium';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    width: '100%',
  },
};

const FooterComponent = ({ company }) => (
  <footer
    className="col-xs-12"
    style={[
      GlobalStyles.table,
      styles.css,
        { height: GlobalStyles.footerHeight },
    ]}
  >
    <div className="text-left" style={[GlobalStyles.cell]}>
        Copyright <a href={company.href} target="_blank">
          {company.name}
        </a> 2016
      </div>
  </footer>
);

FooterComponent.propTypes = {
  company: PropTypes.object.isRequired,
};

export default Radium(FooterComponent);
