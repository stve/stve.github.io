---
layout: post
title: Serving Multiple Rails Apps Under One Virtual Host with Phusion Passenger
published: true
---

A while back I was tasked with a unique problem I hadn't encountered before. I was running two Rails apps, both of which needed to be hosted under a single domain - one served from root, and the other from a directory.  Here was my ideal setup:

* app1 deployed to `/apps/app1/current` at mydomain.com
* app2 deployed to `/apps/app2/current` at mydomain.com/app2

This is easily accomplished with Passenger, but took some tinkering to figure out. Here's what I ended up with:

{% highlight apacheconf %}
<VirtualHost *:80>
  ServerName mydomain.com
  DocumentRoot "/apps/app1/current/public"
  RailsEnv production

  <Directory "/apps/app1/current/public">
    Options Indexes FollowSymLinks -MultiViews
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>

  <Directory /apps/app1/current/public/app2>
    Options Indexes FollowSymLinks -MultiViews
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>

  RackBaseURI /app2
</VirtualHost>
{% endhighlight %}

Apache is now properly configured. All that remains is a little setup in the apps themselves. Since the Apache config expects a Rack/Rails app at `/apps/app1/current/public/app2`, you just need to create a symlink in `/apps/app1/current/public` to app2:

{% highlight bash %}
ln -s /apps/app2/current/public app2
{% endhighlight %}

Depending upon your deployment strategy, you may need to create the symlink each time you deploy. I setup a symlink as part of the capistrano deploy and everything just worked&#8482;.
