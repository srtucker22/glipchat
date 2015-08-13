FooterComponent = React.createClass({
  render() {
    var glipcode = {name: 'Glipcode', href: 'http://glipcode.com/'};
    var meteorFlux = {name: 'MeteorFlux', href: 'https://github.com/meteorflux'};
    return (
      <footer className='table col-xs-12'>
        <div className='cell text-left'>
          Copyright <a href={glipcode.href} target='_blank'>{glipcode.name}</a> 2015
        </div>
        <div className='cell text-right'>
          Made with ♥ using <a href={meteorFlux.href} target='_blank'>{meteorFlux.name}</a>
        </div>
      </footer>
    );
  },
});
