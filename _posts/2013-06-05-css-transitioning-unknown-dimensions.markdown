---
title: CSS Transitioning Unknown Dimensions
date: 2013-06-05 20:17:00 Z
tags:
- css
- front-end
---

The only way to get CSS transitions to work with width (or height) is to know the width you want to transition to. For example, transitions will work if you want to transition from 0px to 100px because you have the beginning and ending dimensions. However, transitions don't (currently) work when you don't know one of the dimensions. A width transition won't work for 0px to auto.

Often times you won't know the end transition width, like I did earlier today when I had this "duh!" moment while trying to get an element's width to transition from 0px to whatever width was needed for the element's content to fit.

## The solution:

Instead of transitioning from <em>width A</em> to <em>width B</em>, we can use max-width. We can set an element's <em>max-width A</em> to 0px and transition it's <em>max-width B</em> to an extreme width, something we know the element will never exceed, like 9999px. CSS will now apply a proper transition and animate the width of the element when it changes.

<a href="http://jsfiddle.net/EqFsy/4/" target="_blank"><strong>Demo: Transitioning widths and heights</strong></a>
