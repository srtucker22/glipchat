(()=> {
  const styles = {
    css: {
      width: '100%',
    }
  };

  let GlobalStyles = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
  });

  let glipcode = {name: 'Glipcode', href: 'http://glipcode.com/'};
  let meteorFlux = {name: 'MeteorFlux', href: 'https://github.com/meteorflux'};

  FooterComponent = Radium(React.createClass({
    render() {
      return (
        <footer className='col-xs-12' style={[GlobalStyles.table, styles.css, {height: GlobalStyles.footerHeight}]}>
          <div className='text-left' style={[GlobalStyles.cell]}>
            Copyright <a href={glipcode.href} target='_blank'>{glipcode.name}</a> 2015
          </div>
          <div className='text-right' style={[GlobalStyles.cell]}>
            Made with ♥ using <a href={meteorFlux.href} target='_blank'>{meteorFlux.name}</a>
          </div>
        </footer>
      );
    },
  }));
})();
