---
title: Lab - 3D Zooming Using CSS Transforms
date: 2013-06-05 19:50:00 Z
tags:
- css
- front-end
- lab
---

This lab was based on the [2011 Beercamp](http://2011.beercamp.com) website built by the wizards over at [nclud](http://nclud.com/). A lot of the code was taken directly from their site, my main goal was to dissect the code and gain insight on how they made the magic happen. Besides a bit of JavaScript trickery, the rest is fairly simple.

<a href="http://labs.sawyerhollenshead.com/lab/css-3d-transform/" class="button">View Lab</a>

## The Structure

The basic structure of the site looks like this (obviously a simplified version):

<script src="https://gist.github.com/2270895.js?file=3d-html.html"></script>

## Basic Styles

So let's break this down and see how we style these to give us the perspective of a 3D site. Starting with the two outermost elements:

<code>#wrap</code> - We set this to be fixed position so that when we scroll the window, the elements inside stay where they are in the browser.

Since we still want the ability to scroll in order to trigger the zooming, we add the <code>#scroll-proxy</code> element and apply a large height to it. When we get to the JavaScript you'll see that the actual height of the scroll-proxy doesn't matter, you can tweak this to control the speed of zooming.

<code>#container</code> simply centers our page content (horizontally and vertically).

<script src="https://gist.github.com/2270895.js?file=c1.css"></script>

<h2>CSS Perspective and Transforms</h2>

<strong>Note:</strong> For the sake of clarity, I've stripped out the prefixed lines of code. If you want this to actually work in most browsers, you'll need to prefix the experimental CSS3 properties with the appropriate vendor prefix.

Moving onto the fun stuff, we have the <code>#environment</code> element which applies three styles that control how our 3D transforms behave.

<a href="https://developer.mozilla.org/en/CSS/perspective"><code>perspective</code></a> (and its prefixed variations) activates our 3D space. Dave Desandro (also the man behind the 2011 Beercamp site) has an excellent <a href="http://desandro.github.com/3dtransforms/docs/perspective.html">overview of perspective</a>. To put it simply, we're applying the perspective to <code>#environment</code> so that we activate 3D space on all of its children. The value that we assign to <code>perspective</code> controls the intensity of the 3D effect. The smaller the number, the greater the intensity.

We then use <code>perspective-origin</code> to move the vanishing point of our 3D space. For this design, I tweaked the origin's y-position until the various levels fit inside of the empty spots built into the design.

I was noticing discrepancies between the way WebKit and Firefox were treating <code>perspective-origin</code>. In order to get around this and to make them behave the same, I added <code>transform: perspective(400px);</code>, which seemed to do the trick.

On our <code>#content</code> element we apply a <a href="https://developer.mozilla.org/en/CSS/transform-style">transform-style</a> of preserve-3D. This indicates that the children of this element should be positioned in 3D-space.

Each of our "levels" is a <code>section</code>, in order to position these on top of each other like a stack, we position them as "absolute". To give the appearance that they're in the background and zoomed out, we change the element's position in 3D-space using the translate3d function, decreasing 1000px on the z-axis each level. Our first level section doesn't need this since we want it be zoomed "100%" from the start.

<script src="https://gist.github.com/2270895.js?file=c2.css"></script>

## Making it zoom

The above will give us our 3D appearance, however the zooming functionality isn't there yet. In order to zoom to a deeper level we need to apply a 3D transform to the <strong>parent</strong> of our levels, the <code>#content</code> element. Remember that we set our second level to be -1000px on our 3D space's z-axis. To bring that element to the front and to zoom the other levels accordingly, we need to increase the z-axis of the levels' parent element by 1000px, which would bring our second level to be at 0 on the z-axis (-1000px + 1000px = 0).

<script src="https://gist.github.com/2270895.js?file=h.html"></script>

Obviously hardcoding this isn't going to do it since we want the site to zoom in and out when we scroll or click the navigation, so we're going to use JavaScript to dynamically change the z-axis value based on our scroll position.

Hopefully you've been prefixing your CSS transforms. We'll use <a href="http://modernizr.com/">Modernizr</a> to test if transforms are supported, if 3D transforms are supported, and if they are then we'll use Modernizr to get the proper vendor prefix for our style. Here's all of our code:

<script src="https://gist.github.com/2270895.js?file=j.js"></script>

So what the hell is going on here? Well, at the top we're setting a bunch of global variables that we'll use throughout our code, hopefully most of it is self-explanatory. When our document is ready we set the rest of our variables. The <code>getScrollTransform</code> tests if 3D transforms are supported by the user's browser and if it is, then we'll use the <code>getScroll3DTransform</code> function to return the appropriate style to apply to our container element. If 3D transforms aren't supported by the user's browser, it will fallback to a 2D transform, using the <code>getScroll2DTransform</code> function. Since I was mainly focused on learning more about the 3D aspect of this experiment I'm only going to focus on those parts, so let's break it down.

<script src="https://gist.github.com/2270895.js?file=zoom.js"></script>

<code>zoom</code> is called every time the window is scrolled. Instead of taking the pixel value of <code><a href="http://api.jquery.com/scrollTop/">scrollTop</a></code>, we want to normalize it into a value between 0 and 1 in order to prevent any possible conflicts with different functions (such as when calculating the 2D or 3D transform). In order to normalize the scroll value, we take the number of pixels we've scrolled (<code>scrollTop</code>) and divide by the difference between our document height (in our case, this is the height of <code>#scroll-proxy</code>) and the size of our browser window.

<script src="https://gist.github.com/2270895.js?file=getScroll3DTransform.js"></script>

<code>getScroll3DTransform</code> is passed a value between 0 and 1, based on the windows scroll position. If we've scrolled halfway down the window, <code>scroll</code> would equal 0.5.  We use this value to calculate what our z-axis position should be and then return the new translate3D value.

<script src="https://gist.github.com/2270895.js?file=transformScroll.js"></script>

<code>transformScroll</code> takes the scroll value that we passed to it, calculates the proper translate3D using <code>getScroll3DTransform</code> and then assigns it to our transform style property. If you remember, we set the <code>transformProp</code> variable using Modernizr. This way, if we're viewing the site in Safari, we pass <code>WebkitTransform</code> into our style object.

## Can I use 3D Transforms yet?

**Update (2/3/2014) - [Yes.](http://caniuse.com/#search=transform)**

Kind of. The latest releases of Firefox, Chrome, and Safari support 3D transforms (with the proper prefixes). 3D transforms are coming to Internet Explorer with IE 10. Since a lot of 3D transforms are still in the experimental phase, you'll likely notice discrepancies among how each browser handles them, as I mentioned before about the differences Firefox and WebKit had. A good fallback is to use Modernizr to test for support and provide a fallback to 2D transforms if 3D transforms aren't yet supported, and ultimately a "no transforms" fallback.
