(()=> {

  const styles = {
    main: {
      css: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '20px 0',
      }
    }
  }

  // Dependencies
  let GlobalStyles = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
  });

  NotFoundComponent = Radium(React.createClass({
    render() {
      return (
        <div>
          <div style={[GlobalStyles.stickyFooterPage]}>
            <div className='row'>
              <div className='col-xs-12 text-center' style={[styles.main.css]}>
                <img src='images/dog.png' />
                <p>page not found</p>
              </div>
            </div>
          </div>
          <FooterComponent />
        </div>
      );
    },
  }));
})();
