---
title: Generating Black and White Images With SVG
date: 2013-06-05 19:58:00 Z
tags:
- svg
- front-end
---

While building the <a href="http://www.organizedwonder.com" target="_blank">Organized Wonder</a> site, one of the site interactions called for a combination of two images, a black &amp; white version and a colored version. By default, the black and white image would be displayed, but when a user mouses over the image the colored version would fade in. Nothing new here, a ton of websites do this already. What a lot of those sites do is generate two separate images, something like "photo-bw.jpg" and "photo-colored.jpg". This works, however it's always bugged me because it seems like overkill and adds to our page load time. Fortunately, the modern web now affords us the tools to generate these alternate images on the client side, dynamically, using one image source.

<a href="http://labs.sawyerhollenshead.com/lab/svg-bw-images/">View demo.</a>

## Advantages of using SVG

### One image source

The obvious advantage of using this SVG technique is that we now only need to load one image, even though we'll display two (one for colored and one for black and white). For a site with a lot of images or very large images, this can really speed things up.

## Avoids foreign origin issues

When I first thought about creating black and white images dynamically on the client side, I tried using Canvas and JavaScript. <a href="http://spyrestudios.com/html5-canvas-image-effects-black-white" target="_blank">This technique</a> worked, however I ran into an issue when trying to use images that weren't being hosted on the same domain, such as Vimeo and YouTube video thumbnails. With the canvas approach, if you try to use an image that is hosted on another domain and which isn't <a href="https://developer.mozilla.org/en/CORS_Enabled_Image" target="_blank">CORS Enabled</a>, then you can only use the image in a canvas once and then your canvas is "tainted," which basically means it's "locked". There are ways around this, but it was more trouble than I was looking to get into. This SVG approach avoids all of what was just mentioned, and you can use images from any domain.

## Disadvantages

One of the drawbacks of this SVG approach, at this time, is <a href="http://caniuse.com/svg-filters" target="_blank">limited browser support</a>. Currently, SVG Filters are only supported in Firefox and Chrome. Notably missing is Safari, which should be adding support in its next release (5.3). SVG Filters will be supported in IE 10. This wasn't a huge deal for my use-case, but it might be for yours. In browsers where filters aren't supported, the image will just display normally without filters being applied.

## The Code

I'll break this down, but first here's what the final code looks like:
<script src="https://gist.github.com/2847661.js?file=gistfile1.xml"></script>

This can be placed right in your HTML, and you can target the images through CSS using their class names ("bw" and "color").

The meat of this is the <code>feColorMatrix</code> filter. (There are <a href="http://www.w3.org/TR/SVG/filters.html" target="_blank">other filters</a> available that you can use to do all sorts of things, like <code>feGaussianBlur</code>.) We're creating a <code>filter</code>, assigning an ID which we'll use to apply the filter to our image, and then inside we define what we want our filter to do. In this case, we're just setting the saturation to 0, which will produce a grayscale image.

After our filter, we can create two <code>image</code> elements, each using the same source image. On our first image we can apply our grayscale filter by setting it's <code>filter</code> property and point it to our filter using the <code>#grayscale</code> ID.

<a href="http://labs.sawyerhollenshead.com/lab/svg-bw-images/">View demo.</a>
