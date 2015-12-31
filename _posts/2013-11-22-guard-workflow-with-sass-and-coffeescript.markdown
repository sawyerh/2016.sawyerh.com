---
title: My Sass and CoffeeScript workflow with Guard
date: 2013-11-22 13:30:00 -05:00
tags:
- front-end
syntax_highlighting: 'true'
---

**Update (September 21, 2015)**: *I've moved on to Webpack! For my updated workflow, check out [github.com/sawyerh/asset-workflow](https://github.com/sawyerh/asset-workflow)*

---

Sass and CoffeeScript are indispensable front-end tools for me. [Sass](http://sass-lang.com/) makes writing CSS easier with its mixins, nesting and variables. [CoffeeScript](http://coffeescript.org/) makes writing JavaScript enjoyable with its clean style and handy shortcuts. Both make my code more elegant and easier to digest.

Recently another tool has become indispensable to my front-end workflow, and that's [Guard](https://github.com/guard/guard). Guard is an extensible command-line tool that "handles events on file system modifications." There are a ton of things that you can use Guard for, but what I primarily use it for is compiling my Sass/Coffeescript files and compressing my JavaScript files into a single file(s).

Before becoming comfortable with the command-line, I used [CodeKit](http://incident57.com/codekit/) to compile my Sass and CoffeeScript files. If you're uncomfortable with the command-line, then I recommend sticking with an app like CodeKit and stop reading here. If you're interested in having more control over how your files get compiled, read on. This is by no means an in-depth look at Guard, so I encourage you to read the [Guard documentation](https://github.com/guard/guard) if you want to go deeper than what's covered here.

## Basic file structure

Before we start, we'll need to create a few files and directories. Here's the file structure that I normally follow and what I'll be using in the code examples below:

![guard-file-structure](/uploads/guard-file-structure.jpg)

## Installing Guard

Guard runs as a Ruby gem, so the first thing you need to do is create a Gemfile inside of your project folder. Here's what my Gemfile typically looks like, with the other gems that we'll need included:

```ruby
gem 'guard'
gem 'guard-sass'
gem 'guard-coffeescript'
gem 'guard-jammit'
gem 'guard-livereload'
```

Once you have your Gemfile created, go ahead and run `bundle install` from the command-line and from within your project's folder.

## Configuring Guard

After Guard has been installed, you need to create your Guardfile. This file tells Guard what to watch and what to do when changes are made to what it's watching.

In my Guardfile, I tell Guard to compile my Sass files, compile my CoffeeScript files, compress my JavaScript files, and to fire LiveReload when any changes are made. Here's how you'd do that...

### Compile Sass into CSS

You'll notice when we installed the Guard gem that we also installed several other gems. We'll use [guard-sass](https://github.com/hawx/guard-sass) to validate and compile our Sass into compressed CSS and output the files to "styles/css". You tell Guard to do that by writing the following in Guardfile:

```ruby
guard 'sass', :input => 'styles/sass', :output => 'styles/css', :style => :compressed, :smart_partials => true
```

### Compile CoffeeScript into JavaScript

Using [guard-coffeescript](https://github.com/guard/guard-coffeescript) we can validate and compile our CoffeeScript, outputting the JavaScript files to "scripts/js".

In your Guardfile:

```ruby
guard 'coffeescript', :input => 'scripts/coffee', :output => 'scripts/js'
```

### Compress and package JavaScript files

If you have jQuery plugins or several JS files that your page is dependent on, it's best practice to package all of the files into a single compressed file. This reduces both the file size and the number of HTTP requests the browser needs to make. To do that, I use [guard-jammit](https://github.com/guard/guard-jammit).

Add the following to your Guardfile:

```ruby
guard :jammit, :output_folder => "scripts/min/" do
  watch(%r{^scripts/js/(.*)\.js$})
end
```

This will watch your scripts/js folder and run Jammit when any changes occur.

Jammit also relies on a file (config/assets.yml) to tell it what JS files to create and what goes in each one. Here's an example of an assets.yml file:

```yml
javascripts:
  application:
    - scripts/js/plugins/jquery-ui.js
    - scripts/js/global.js
  blog:
    - scripts/js/plugins/pagination.js
    - scripts/js/blog.js
```

This will create two compressed JavaScript files in the "scripts/min" folder; `application.js` and `blog.js`.

### LiveReload

This one is optional, but one that I find to be super handy. LiveReload automatically reloads your browser when files are modified. The easiest way to set this up is to [install the LiveReload browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) and add the following to your Guardfile:

```ruby
guard 'livereload' do
  watch(%r{scripts/js/min/.+\.(css|js|html)})
  watch(%r{styles/css/.+\.(css|js|html)})
end
```

Here's what our final Guardfile should look like:

```ruby
guard 'sass', :input => 'styles/sass', :output => 'styles/css', :style => :compressed

guard 'coffeescript', :input => 'scripts/coffee', :output => 'scripts/js'

guard :jammit, :output_folder => "scripts/min/" do
  watch(%r{^scripts/js/(.*)\.js$})
end

guard 'livereload' do
  watch(%r{scripts/js/min/.+\.(css|js|html)})
  watch(%r{styles/css/.+\.(css|js|html)})
end
```

## Running Guard

After configuring Guard, you're ready to roll. In the command-line (and from within your project's directory), run `bundle exec guard`. This will execute the Guardfile and begin watching the folders we set it up to watch. When you make changes to any files within those folders, Guard will run and do its magic. If Guard finds any validation errors within your Sass or CoffeeScript, it'll output error messages to terminal.

Guard and its plugins have many more options that you can dive into to customize them how you'd like. Check out the [Guard documentation](https://github.com/guard/guard) (or the plugin's documentation) to learn more about what else you can configure.
