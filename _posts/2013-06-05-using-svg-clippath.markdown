---
title: Using SVG clipPath
date: 2013-06-05 20:11:00 Z
tags:
- svg
- front-end
---

One neat thing you can do with SVG, <a href="http://sawyerhollenshead.com/writing/generating-black-and-white-images-with-svg/" title="Generating Black and White Images With SVG">besides creating your own image filters</a>, is creating a clipping path (or mask) that can be used to alter the shape of your images and the boundaries of links, the latter being what most excites me because you can now easily create links that are whatever shape you'd like instead of being restricted to a box. I've created a quick demo demonstrating the use of a clipPath on images. These SVG images are wrapped with a link element, which you'll notice its boundaries form around the clipPath and not the image's original boundary box, changing the link's boundary box to a hexagon. Go ahead and mouseover the images to see what I'm talking about.

<a href="http://labs.sawyerhollenshead.com/lab/svg-clippath/">View demo.</a>

The basic code looks like this. You first want to create a <a href="http://www.w3.org/TR/SVG/masking.html#ClipPathElement" target="_blank">clipPath</a> and assign an ID to it, which you'll use on your images as a reference. Whatever you place within the clipPath will be used as the silhouette (the part that will get displayed). In my instance, I created a hexagon.

<script src="https://gist.github.com/2914956.js?file=clippath.svg"></script>

You might be wondering why I'm creating the clipPath and wrapping it within a <a href="http://www.w3.org/TR/SVG/struct.html#Groups" target="_blank">grouping element</a> rather than a <a href="http://www.w3.org/TR/SVG/struct.html#Head" target="_blank">defs</a> element. This addresses a bug that I've noticed within Safari, and seems to be the only way to get it to work. Hopefully this gets fixed soon.

After creating our clipPath, we can then apply it to our images. Here's an example of that:

<script src="https://gist.github.com/2914956.js?file=image.svg"></script>

One thing to note, in SVG we need to use the namespaced <code>href</code> attribute, and include the namespace definition in our <code>SVG</code> opening tag, like so:

<script src="https://gist.github.com/2914956.js?file=link-namespace.svg"></script>

## Browser Support

Inline SVG and clipPaths are supported in the latest versions of Safari and IE, Chrome 17+, and Firefox 8+. You can use <a href="http://modernizr.com/" target="_blank">Modernizr</a> to check for support and provide a fallback to a non-clipPath version.

<a href="http://labs.sawyerhollenshead.com/lab/svg-clippath/">View demo.</a>
