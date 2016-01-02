---
title: Siteleaf
date: 2015-12-28 13:50:00 -05:00
external_link: http://siteleaf.com
dates: 2013–Present
video:
    mp4: "/uploads/siteleaf-walkthrough.mp4"
colors:
- "#399fdb"
- "#8dcf3f"
notes:
- body: 'One feature of Jekyll is the ability to have “front matter” attached to your
    pages, which is an easy way to set predefined variables for use in the page’s
    template. The front matter is stored as YAML, so can support various value types:
    strings, booleans, arrays, objects, etc. In Siteleaf we called this type of content
    “Metadata” and we wanted to make the user experience for adding metadata as simple
    as possible. A normal user shouldn’t need to know what YAML is or how to properly
    format values. We decided to simplify the meta field options to “Simple” (a text
    field), “List” (an array), or an “Object”. Using these three ingredients a user
    can create a system that works for pretty much any use case they throw at it.'
  Key: |-
    In Siteleaf, site content is grouped by “collections”. The two most basic collections are “Pages” and “Posts”, but you can add additional collections that fit your site’s content, like “People”, “Videos”, and so on.

    To make it easier for users to reference content in collections, we built a system where a metadata field’s controls would adapt based on the field’s “key”. If you have a collection called “People” and you created a meta field with a key called “Person”, it would turn into a dropdown menu with options autofilled based on the existing content in the “People” collection.

    Taking this idea a step further, you could also create a field called “file” or “header image” and an upload button would appear in the field.
---

Initially designed and built in one month with Oak Studios, Siteleaf has grown to become a formidable CMS for static websites. Our philosophy behind Siteleaf is that you should be able to host your website anywhere you want. That websites should be able to outlive their CMS. That our tools should be simplified, not dumbed down. In version 2 we added 100% compatibility with Jekyll, the same static site platform that powers over half a million sites on GitHub Pages.

As part of the 4 person team, I lead the design and front-end development of the CMS focusing on building powerful, pro-level controls for advanced users already familiar with Jekyll, but also as simple and clear as possible for clients who may be less advanced and just want to update their damn site.