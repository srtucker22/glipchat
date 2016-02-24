react-scroll-components
=======================

A set of components and mixins that react to page scrolling

## ScrollListenerMixin

This mixin provides the following states:
* `scrollTop`, which represents the documents' current scroll position
* `isScrolling`, wether the user is currently scrolling the document

You can pass the following methods to your React class:
* `onPageScroll`: fired when the document is scrolling. This function gets the
current scroll position passed as argument.
* `onPageScrollEnd`: fired when the document's scroll position hasn't changed for
300 milliseconds. This function also gets the current scroll position passed as
argument. If you want to change the timeout, override your components'
`endScrollTimeout`

## ScrollBlocker

A very simple component that allows you to block any mouse events during
scrolling.

## Example

```javascript
var MyComponent = React.createClass({
	mixins: [ScrollListenerMixin],
	render: function () {
		return (
			<ScrollBlocker active={this.state.isScrolling}>
				The current scroll position is {this.state.scrollTop}.<br />
				The document is currently {this.state.isScrolling ? '' : 'not'} scrolling.
			</ScrollBlocker>
		)
	}
})
```
