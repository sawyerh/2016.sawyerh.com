---
title: Creating an ebook with Siteleaf
date: 2013-11-29 13:48:00 -05:00
tags:
- siteleaf
syntax_highlighting: 'true'
---

![siteleaf-ebook-cms](/uploads/siteleaf-ebook-cms.png)

For this year's edition of [*Pocket - A Reading List*](/downloads/pocket-ii) I wanted to try something different. Last year I made the entire ePub by hand. An ebook is basically just a bunch of HTML files that are "zipped" into a single file, in my case it's one HTML file per article/chapter. With each article in a separate HTML file, it's very time consuming to play around with different layouts and styles. If I wanted to make a change to the formatting of the title page, for example, then I'd have to go into each HTML file and change the markup. No fun.

This year I decided to move the management of the ebook content into a content management system. [Siteleaf](http://siteleaf.com), a product of ours at [Oak](http://oak.is), turned out to be the perfect content management system for an ebook. Siteleaf is great because it outputs your content as plain HTML files by default. It also has a "wildcard" feature where you can append `.liquid` to the end of any filename and use templating tags within the file. This wildcarding feature was perfect for creating non-HTML ebook files like the toc.ncx and content.opf files, which are detailed below.

[To view the Siteleaf theme I used for creating the ebook, view it on GitHub.](https://github.com/sawyerh/pocket-2013)

## Basic ebook structure

As I mentioned above, an ebook is basically a bunch of HTML files that are zipped together. I'll touch on how to package an ebook a bit later. First, there are some other files that are required for your ebook to be valid.

- toc.ncx
- content.opf
- mimetype
- META-INF/container.xml

### toc.ncx

This is the file used for your ebook's table of contents. For Siteleaf, I created a `toc.ncx.liquid` theme file with code similar to the following:

{% raw %}
```html
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
      <meta name="cover" content="cover"/>
      <meta name="dtb:uid" content="urn:uuid:3faa5cb9ee574e449cd7fb700cac580d"/>
      <meta name="dtb:depth" content="-1"/>
      <meta name="dtb:totalPageCount" content="0"/>
      <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
      <text>{{ site.title }}</text>
  </docTitle>
  <navMap>

    {% for page in site.pages %}
      <navPoint id="{{page.slug}}" playOrder="{{ forloop.index }}">
        <navLabel>
            <text>{{ page.title }}</text>
        </navLabel>
        <content src="{{ page.slug }}/index.html"/>
      </navPoint>
    {% endfor %}

  </navMap>
</ncx>
```
{% endraw %}

In the code above, I'm looping through my site's pages and outputting the necessary XML tags for each article to show in the table of contents.

### content.opf

The `content.opf` file is another required file for your ebook to function. It's where you define the ebook's metadata (author, title, publish date, etc) and list all of the ebook files (including images and other assets). [Wikipedia has a great description](http://en.wikipedia.org/wiki/EPUB#Open_Packaging_Format_2.0.1) of what this file is used for.

For my ebook, I created a Siteleaf `content.opf.liquid` theme file with the following code:

{% raw %}
```html
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="bookid">
  <metadata>
      <dc:identifier xmlns:dc="http://purl.org/dc/elements/1.1/" id="bookid">urn:uuid:3faa5cb9ee574e449cd7fb700cac580d</dc:identifier>
      <dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">{{ site.title }}</dc:title>
      <dc:date xmlns:dc="http://purl.org/dc/elements/1.1/">{{ site.pages.last.date | date_to_xmlschema }}</dc:date>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">{{ site.meta.author }}</dc:creator>
      <dc:language xmlns:dc="http://purl.org/dc/elements/1.1/">en</dc:language>
      <meta name="cover" content="cover-image" />
  </metadata>
  <manifest>
      <item id="ncxtoc" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
      <item id="cover" href="cover/index.html" media-type="application/xhtml+xml"/>
      <item id="cover-image" href="{{ site.meta.cover }}" media-type="image/jpeg"/>

      {% for page in site.pages %}
        <item id="{{ page.slug }}" href="{{ page.slug }}/index.html" media-type="application/xhtml+xml"/>

        {% for asset in page.assets %}
          <item id="{{ page.slug }}_asset_{{forloop.index}}" href="assets/{{ asset.filename }}" media-type="{{ asset.content_type }}"/>
        {% endfor %}
      {% endfor %}

  </manifest>
  <spine toc="ncxtoc">
      <itemref idref="cover" linear="yes"/>
      {% for page in site.pages %}
          <itemref idref="{{ page.slug }}"/>
      {% endfor %}
  </spine>

  <guide>
      <reference href="cover/index.html" type="cover" title="Cover"/>
  </guide>
</package>
```
{% endraw %}

### mimetype

If you're creating an ePub, you'll want to include a `mimetype` file in the directory root with the following:

`application/epub+zip`

### META-INFO/container.xml

The last required file. This points to your `content.opf` file. This is what mine looked like:

{% raw %}
```html
<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="content.opf" media-type="application/oebps-package+xml" />
    </rootfiles>
</container>
```
{% endraw %}

## Managing ebook content in Siteleaf

![title-page](/uploads/title-page.jpg)

For my ebook, I created a Siteleaf "Page" for each article (AKA chapter). Each article starts off with a title page that includes an image, title, date, author, website and next/previous article links.

For the image, date, author and website, I used [Siteleaf meta fields](http://www.siteleaf.com/blog/metadata-in-siteleaf/):

![ebook-meta](/uploads/ebook-meta.png)

Each of my Siteleaf pages used Siteleaf's `default.html` template file. Below is the body of the article template:

{% raw %}
```html
  <div id="pocket-chapter-cover">

    {% if meta.image %}
      <p><img id="pocket-chapter-image" src="..{{ meta.image }}" alt="{{ title }}" /></p>
    {% endif %}

    <h1 class="pocket-chapter-title">{{ title }}</h1>

    <p class="pocket-chapter-meta">
        {{ meta['date'] }} &bull; {{ meta['author'] }}<br />
        {% assign pretty_link = meta.link | split: 'http://' %}
        {% assign pretty_link = pretty_link[1] | split: '/' %}
        <a href="{{ meta.link }}">{{ pretty_link[0] | replace: 'www.', '' }}</a>
    </p>

    <p class="pocket-chapter-nav">
        {% if previous %}<a href="..{{ previous.url }}/index.html">&larr; Prev</a>{% endif %}
        {% if previous and next %} | {% endif %}
        {% if next %}<a href="..{{ next.url }}/index.html">Next &rarr;</a>{% endif %}
    </p>
  </div>

  {{ body }}
```
{% endraw %}

## Packaging Siteleaf pages into an ePub

The basic steps to creating an ePub from Siteleaf are as follows:

1. Publish your Siteleaf site to FTP, Amazon S3, or Rackspace.
2. Download your published files from your web host
3. Create a `.zip` file from the published files you downloaded.
4. Rename the zip file you just created from `abc.zip` to `abc.epub`

### Optional: Automating portions of the ePub'ify process

If you're like me and you experiment a lot with the layout and design of your ebook, it'll become a little tedious to continually download, zip, and rename your ePub file. You can automate some of this process if you're comfortable using the command line. Since I used Amazon S3 as the publishing destination for my ebook, I automated the download process by using a command line tool called [s3cmd](http://s3tools.org/s3cmd).

Using s3cmd, I was able to download my S3 bucket files using a simple command:

`s3cmd sync s3://my-bucket ~/Downloads/my-ebook-folder`

I then automated the zipping and naming of the ePub file using the `zip` command:

`zip -r pocket.epub ~/Downloads/my-ebook-folder`

## Validating your ePub

You'll sometimes run into instances where your ebook won't function as you'd expect. To help debug any issues you run into, I highly recommend running your ebook through the [online ePub validator tool](http://validator.idpf.org). This will tell you if you're missing any required files or if your files are formatted improperly. It's super helpful.

If you own a Mac, you can install the iBooks app and preview your ePub directly on your computer.

## Supporting Kindle

If you want to support Kindle, you'll need to convert your ePub to the `.mobi` file format. I recommend using [Calibre](http://calibre-ebook.com) to do this.
