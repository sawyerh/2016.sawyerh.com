---
title: Using jQuery UI Sortable with React components
date: 2015-10-28 19:36:00 Z
syntax_highlighting: 'true'
tags:
- front-end
- react
- javascript
- jquery-ui
---

While working on a new feature for [Siteleaf](http://www.siteleaf.com), I came across the need to have a React component that had a list of sortable, drag & drop children. There are some React-specfic libraries that add this capability already, however I wasn't really satisfied with their implementations. We already use jQuery UI throughout Siteleaf, so rather than including another library that did a similar job, I opted to use [jQuery UI's Sortable Widget](http://api.jqueryui.com/sortable).

Out of the box, Sortable doesn't play nice with React since it manipulates the DOM position of our components. This causes the state of the DOM to become out of sync with the state of our React component. So, my solution was to listen to the Sortable's [`update` event](http://api.jqueryui.com/sortable/#event-update) which triggers when the user stops sorting and the position has changed. When this event gets triggered, we can then use Sortable's `toArray` method to get the updated order and update our React state.

For my React component, I had an `items` state property that was an array of list objects. Each list item had a `position` property which is an integer starting at 0. When I rendered these items, I first sort them by their `position` using the `sortBy` method provided by the [lodash library](https://lodash.com), which I'll use throughout.

Here's what the above looks like:

```js
getInitialState() {
    return {
      items: [{
        id: 'a',
        position: 0,
        content: 'Adam'
      }, {
        id: 'b',
        position: 1,
        content: 'Betty'
      }, {
        id: 'c',
        position: 2,
        content: 'Charlie'
      }]
    };
},

sortedItems(){
    // sortBy provided by https://lodash.com
    var items = _.sortBy(this.state.items, 'position');

    return items.map((item) => {
      return <li key={item.id} data-id={item.id}>{item.content}</li>
    })
},

render() {
    return <ul>{this.sortedItems()}</ul>;
}
```

_Note: Throughout this example I'll be using some ES6 features (like [fat arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)). You can [read more about ES6 here](https://hacks.mozilla.org/category/es6-in-depth/)._

![react-jquery-ui-example--flat](/uploads/react-jquery-ui-example--flat.png)

Right now, that code only gives us a static list of items without any sortable functionality. We can add that with jQuery UI's Sortable Widget, which we'll instantiate when the component is added to the DOM:

```js
componentDidMount() {
    // ReactDOM.findDOMNode(this) is the <ul>
    // element created in our render method
    $(ReactDOM.findDOMNode(this)).sortable({
      items: 'li',
      update: this.handleSortableUpdate
    });
}
```

You'll notice that in our first code example, we add a `data-id` attribute to our `<li>` items. We can use this in our `handleSortableUpdate` method to get the updated order of our items:

```js
handleSortableUpdate() {
    // We should only use setState to mutate our component's state,
    // so here we'll clone the items array (using lodash) and
    // update the list items through this new array.
    var newItems = _.clone(this.state.items, true);
    var $node = $(ReactDOM.findDOMNode(this));

    // Here's where our data-id attribute from before comes
    // into play. toArray will return a sorted array of item ids:
    var ids = $node.sortable('toArray', { attribute: 'data-id' });

    // Now we can loop through the array of ids, find the
    // item in our array by its id (again, w/ lodash),
    // and update its position:
    ids.forEach((id, index) => {
      var item = _.findWhere(newItems, {id: id});
      item.position = index;
    });

    // We'll cancel the sortable change and let React reorder the DOM instead:
    $node.sortable('cancel');

    // After making our updates, we'll set our items
    // array to our updated array, causing items with
    // a new position to be updated in the DOM:
    this.setState({ items: newItems });
},
```

![react-jquery-ui-example](/uploads/react-jquery-ui-example.gif)

Now when the user drags and drops a list item, we update the item's position in our component's state and React handles the DOM updates for us.

[To see a full working example or to provide feedback, head over to the repo on GitHub.](https://github.com/sawyerh/react-jquery-ui-sortable-example)
