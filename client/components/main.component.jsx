MainComponent = React.createClass({
  render() {
    return (
      <div>
        <header><h1>Simon's Meteor Flux React Playground</h1></header>
        <main>{this.props.content}</main>
        <footer>Envy of All Apps</footer>
      </div>
    );
  }
});
