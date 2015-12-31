---
title: How I’m exporting my highlights from the grasps of iBooks and Kindle
date: 2015-12-08 13:47:00 Z
syntax_highlighting:
tags:
- aws
- siteleaf
- ebooks
---

_Crossposted from [Medium](https://medium.com/@sawyerh/how-i-m-exporting-my-highlights-from-the-grasps-of-ibooks-and-kindle-ce6a6031b298)_

A few years ago there was a little startup called <a href="http://readmill.com/">Readmill</a> that gave a glimpse at what an open, independent reading platform could look like. You could import your books into their beautiful reading app and highlight text as you read. Your highlights would sync with your Readmill account and other people could follow along to see what you were highlighting (and vice-versa). I discovered a bunch of new books and met some new faces this way. <a href="http://readmill.com/">I even built a product that tied in with their API</a>. Then Readmill got acquired by Dropbox. The open, independent reading platform was no longer open or independent, and shutdown in July 2014. Since their shutdown, the state of digital reading platforms has been pretty sad.

![readmill](/uploads/readmill.jpeg)

Now, my reading takes place in a train on my phone (iBooks) or in sunny Prospect Park on my Kindle. I still highlight as I read, but they don’t sync anywhere. They’re typically scattered between two walled gardens, and 99% of the time I don’t come back to reflect on what I’ve highlighted. I might as well be posting screenshots of the text to Twitter like a buffoon (✋guilty).

So after stewing in frustration for quite awhile about the current state of digital reading platforms, I decided to do what any sane programmer would do: Devise an overly complex solution on AWS for a seemingly simple problem (that two companies with a combined market cap of close to a trillion fucking dollars can’t be bothered to solve).

The ultimate product was [highlights.sawyerhollenshead.com](http://highlights.sawyerhollenshead.com). (Skip to the bottom for links to the code).

**The problem**: How do I gather all of my highlights from iBooks and Kindle and put them into one collection, preferably online, where I can share, browse, and reflect on everything I’ve read?

**The solution**: Email.

Actually, it’s a bit more complicated than just “Email”. Yes, I suppose I could just email the highlights to myself and be done with it. Now that I think about it, maybe I should have started there. But I didn’t, I jumped right to this: I created a new email address (eg. add-highlight@example.com) and hooked it up to **[Amazon Simple Email Service (SES)](https://aws.amazon.com/ses/)**. Using SES, my email address receives email I send to it and stores the email as essentially a text file in **[Amazon S3](https://aws.amazon.com/s3/)** (aka an online folder that stores files). Amazon S3 is smart though and can notify other services when a new file is added to it. So I setup my S3 folder to notify another Amazon service, **[Amazon Lambda](https://aws.amazon.com/lambda/)**, whenever a new email is received. Lambda is the “brains” of this whole flow. It’s given an input, the email S3 just stored, and runs code on that input.

![highlights-flow-v2](/uploads/highlights-flow-v2.png)

## Sending and parsing highlight emails

The code that I setup Lambda to run does a few things: First, it reads the email and identifies the source of the highlights as either iBooks or Kindle. Emails with iBooks highlights contain the highlights in the body and Kindle highlights are sent as attachments. Why?

iBooks provides a fairly nice user experience for emailing your highlights, so all I have to do is select the highlights I want to share and email them to my add-highlights@example.com address.

Kindle is a bit more of a monster. For books that I’ve purchased through Amazon, my highlights get synced to the [Kindle highlights page](http://kindle.amazon.com/your_highlights), possibly one of Amazon’s most neglected pages. Using a [bookmarklet](https://github.com/cmenscher/kindleHighlightLiberator), I export all these highlights as a JSON file. Next, I email the JSON file as an attachment to my SES address.

<iframe width="560" height="315" src="https://www.youtube.com/embed/QxcrL2cfzMg?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>

## Publishing the highlights online

Now that my Lambda code knows the source of the highlights, it parses the highlights from the email and we proceed on to the next step: Saving the highlights to **[Siteleaf](http://v2.siteleaf.com/)**. Siteleaf is a content management system that myself and the team at [Oak](http://oak.is/) have been working on. Siteleaf allows you to manage your website’s content in the cloud and then publish your site as static HTML to a web host of your choice. Siteleaf also has an API, which I’m using to save my highlights. Once my highlights are saved to Siteleaf, Siteleaf automatically syncs the new highlights to GitHub as Markdown files. At this point, my highlights are saved to Siteleaf and accessible through the CMS and API. They’re also saved as [Markdown files in a GitHub repo](https://github.com/sawyerh/highlights.sawyerh.com/tree/master/_highlights). Pretty cool. With one more click in Siteleaf, I then publish these highlights to [my website](http://highlights.sawyerhollenshead.com/), hosted on **[GitHub Pages](https://pages.github.com/)**. Now they’re also saved as HTML pages and accessible to everyone online. Even cooler.

(Note: The Siteleaf functionality mentioned above is currently in beta and not yet open to everyone. [You can apply for access](http://v2.siteleaf.com/) though — I know a guy.)

## Drink

The irony that I’m using all of these Amazon services to solve a problem that Amazon itself is a part of isn’t lost on me. Like I said at the beginning, this is an overly complex solution to a problem that seems so simple — but it works for me. Now that I have all the pipes connected, when I finish reading a book, I send one email and my highlights are ready to be published to my site. Whether or not Apple, Amazon, or some other company ever makes browsing your ebook highlights and notes easier, I hope to always have a method of my own. If you have your own workflow, [I’d love to hear about it](http://twitter.com/sawyerh).

**View the code on GitHub**

[Instructions and code for the Lambda function can be found on GitHub](https://github.com/sawyerh/highlights-email-to-lambda-to-siteleaf). Additionally, the code for [highlights.sawyerhollenshead.com](http://highlights.sawyerhollenshead.com) is also [available GitHub](https://github.com/sawyerh/highlights.sawyerh.com).
