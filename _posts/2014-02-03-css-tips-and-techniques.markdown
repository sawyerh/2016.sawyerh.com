---
title: CSS Tips and Techniques
date: 2014-02-03 19:51:00 Z
syntax_highlighting: 'true'
tags:
- css
- front-end
---

## Utilize :before and :after

The `:before` and `:after` pseudo-elements are two additional elements you can utilize while styling content, without the need for adding extra HTML markup. A few of my use-cases for these include:

- Adding an icon to the beginning of a link. [See example.](http://jsbin.com/oRUvOwi/1/edit?html,css,output)
- Adding an asterisks to the end of form labels with a class of `.is-required` [See example.](http://jsbin.com/aDupULi/1/edit?html,css,output)
- Overlaying a "loading" screen on top of an element. [See example.](http://jsbin.com/UZuHEFaB/1/edit?html,css,output)

[Read more on MDN.](https://developer.mozilla.org/en-US/docs/Web/CSS/::before)

## Pass parameters from CSS to JS

Sometimes when making responsive sites you'll run into instances where you want certain elements to behave differently at certain breakpoints when a user interacts with it. Sometimes this behavior is managed through JavaScript.

For instance, on the [CreativeMornings site](http://creativemornings.com) there are some sections that have a headline and a body. On small screens the body is collapsed and the user can expand the body by clicking on the headline. On large screens the body is always expanded and clicking on the headline does nothing. The expanded/collapsed states are all handled through CSS classes and breakpoints, however the toggling interaction is handled through JavaScript. In our JS we check the width of the screen to determine whether we allow a body to be collapsed. The width that we check in our JS is the same as the width we set as our breakpoint in CSS.

Since your breakpoints can change as the design of the project evolves, it's not very efficient to have them defined in both your CSS and JS. So what I like to do is pass the breakpoints from my CSS to my JS. We can do that by passing a string to our JS by setting the `content` property on the `:before` pseudo-element of our `body`. Still with me? Here's an example of what that would look like in our CSS:

```css
body::before{
  content: 'collapse_bp=600&hidden_nav_bp=450';
  display: none;
}
```

If you're using Sass (or LESS) like I do, you could define your breakpoints as a variable in your CSS and pass it into the content string like so:

```css
body::before{
   content: "collapse_bp=#{$collapse_bp}&hidden_nav_bp=#{$hidden_nav_bp}";
   display: none;
}
```

I format my string like a query string since I typically already have a JS function available to parse each parameter, but you're welcome to format yours however you like.

After you've set the `content` CSS value, you can then grab it in your JS using [getComputedStyle](https://developer.mozilla.org/en-US/docs/Web/API/Window.getComputedStyle). This returns the entire string, which I then parse into a JS object for easy access. [Check out the example here](http://jsbin.com/IYUMIVOv/1/edit?css,js,console) to see how I parse the string into an object.

## Custom styled checkboxes

When it comes to styling checkboxes (or radio fields), there are several CSS features you should be aware of...

- The [`:checked` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked)
- The [`+` adjacent sibling selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_selectors)
- The `:before` or `:after` pseudo-elements mentioned before.

Using all three of these we can style our checkboxes to look however we'd like. What I typically do is style the `:before` pseudo-element of the checkbox's label. The HTML would like:

```html
<input type="checkbox" id="my_checkbox" />
<label for="my_checkbox">My label</label>
```

Then in the CSS we would identify a selected checkbox's label like:

```css
input[type="checkbox"]:checked + label:before{
    content: '✓';
}
```

[See an example.](http://jsbin.com/OdahoJuW/1/edit?html,css,output)

## A box model that makes sense

This is my favorite CSS addition. Before the `box-sizing` property, if you had an element with a defined width of `250px` and added `25px` padding (both left and right) to it, the actual width would become `300px`. This always seemed strange to me and when combined with making sites responsive, it would really become a pain in the ass. Fortunately we can now change how the box model calculates an element's width and height. Using `box-sizing: border-box` will include the element's border and padding when calculating the height and width of an element. Using our previous example, an element with `box-sizing: border-box` applied to it with a defined width of `250px` and padding of `25px` will remain `250px` wide.

To apply this behavior to all of your elements, include this at the top of your stylesheet:

```css
*{
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
 }
```

[Read more on MDN.](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)

## Mix fixed widths with fluid widths

Sometimes while building a responsive site you'll run into instances where you want a particular element to remain the same width. You can achieve this with a mix of absolute positioning and padding/margins. For instance, if you have a left-sidebar that you want to remain the same width, you can set its width in pixels and position it absolute to its fluid parent. The parent could then have its `padding-left` set to whatever the sidebar's width is. Combine this with the `box-sizing` trick mentioned above and mixing fixed widths with fluid widths becomes pretty simple.

[See an example.](http://jsbin.com/eqOzoVeH/1/edit?html,css,output)
