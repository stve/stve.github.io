--- 
layout: post
title: Using Ruby to post to a Facebook Page's wall
wordpress_id: 154
wordpress_url: http://www.beforeitwasround.com/?p=154
---
I was recently tasked with what seemed like a fairly simple request: Post to a Facebook Page via the Facebook API.  This proved to be no small feat.  I've decided to document my steps here to serve as a help to others, and a reminder to myself should I ever need to revisit this in the future.

Why was this so hard, you ask?  For starters, Facebook's documentation is particularly lacking.  Most of the documentation leads one to believe it's really only good for reading from the API.  It's difficult to understand how you can create anything.  Further muddying the waters is the amount of irrelevant information out there since the release of the Graph API.  They've changed their product so much is such a short period of time that it's hard to tell what's relevant and what isn't.  Many tutorials you'll find won't work because they speak to the old REST API that is now deprecated.  In other words, separating old from new is a bit of a needle/haystack problem.

So where to start, first read up on Facebook API <a href="http://developers.facebook.com/docs/authentication/">authentication</a>.  So we're going to authenticate via OAuth and once authenticated, make calls against the API.  But how do we do this as a page instead of as ourself?  Facebook devotes 2 paragraphs to it in their <a href="http://developers.facebook.com/docs/api">documentation</a> under a section titled "Page impersonation".  I highly recommend you read it, especially this: <em>"Once a user has granted your application the "manage_pages" permission, the "accounts" connection will yield an additional access_token property for every page administrated by the current user. These access_tokens can be used to make calls on behalf of a page. The permissions granted by a user to your application will now also be applicable to their pages."</em>

They've laid it out for us:

<ul>
	<li>grant your application the 'manage_pages' permission</li>
	<li>use 'accounts' to yield an access_token for the page</li>
	<li>use the access_token to make calls on behalf of the page</li>
</ul>

I'm going to show you how to do it.  Let's assume you've done the following:

<ul>
	<li>created a Facebook Page</li>
	<li>created a Facebook app</li>
	<li>added the app to your profile</li>
</ul>

If you haven't done that yet, go right ahead, we'll wait for you to come back.  Make note of the ids of your app and your page, we'll need those shortly.  Now, we'll need to retrieve an access token for our app so that we can use it to make Graph API calls.  The easiest way to do this is to go to the browser and enter a URL that looks like the following:

https://graph.facebook.com/oauth/authorize?type=user_agent&client_id=your_facebook_app_id&redirect_uri=your_callback_url&scope=manage_pages,offline_access,publish_stream

The comma delimited options we are passing to the scope argument specify what <a href="http://developers.facebook.com/docs/authentication/permissions">permissions</a> we are granting to the app.  offline_access allows us to use the access_token outside of a user session.  Without this, the token will only be valid during your user session, when you logout, the token expires.  We also need to allow the app to manage_pages that we administrate.  Lastly, publish_stream is what allows us to create content via the API.

Visiting that link will bring you to an authorization page where Facebook will prompt you to verify that you want to allow your app access to the privileges you specified above.  When you click approve, you'll be redirected to your callback URL and Facebook will pass your access token in the URL:

your_callback_url#access_token=123123%7C7f522476b936197d497768ac-1681065419%123asf123afsASF1231f45&expires_in=0

Make sure to record the access token.  Armed with that, you can now make authenticated requests against the Graph API.  At this point, we should have all we need to start working with Ruby.  There are a number of Rubygems out there in varying stages of development that support the Graph API.  I was previously familiar with <a href="http://www.elevatedcode.com/mike-mangino">Mike Mangino's</a> <a href="http://facebooker.rubyforge.org/">facebooker</a> rubygem, but it's meant to work against the deprecated REST API.  I was then turned on to <a href="https://github.com/mmangino/facebooker2">Facebooker2</a> which is a revamp of the original Facebooker gem meant to work with Facebook connect.  That's not really what we're looking for, but I tried working with Facebooker2 for a while before realizing it wasn't the perfect fit for what I was trying to do.  Inevitably, with this sort of thing, I prefer to dig down into to the code and the tests to see how the gem works.  As it turns out, the bulk of Facebooker2 is really a Rails-friendly wrapper around another gem by Mike Mangino called <a href="https://github.com/mmangino/mogli">mogli</a>.

With Mogli, we can very easily obtain a client that we'll use to engage with the API:

<code><pre>
access_token = 'my_facebook_access_token'
page_id = 'my_facebook_page_id'

client = Mogli::Client.new(access_token)
user = Mogli::User.find("me",client)
page = user.accounts.select { |account| account.id.to_s == page_id }.first
page = Mogli::Page.new(:access_token => page.access_token)
page.client_for_page
</pre></code>

user.accounts will return an array of accounts which will list any pages and apps you own.  I added a select because we want to manage a specific page so we need to retrieve the page based on the page_id.  Then we use that page's access token to create a new facebook client that we can use to work on behalf of the page.  Now, we just need to use the client to create our wall post:

<code><pre>
post_data = {}
post_data[:name]    = 'Title for my link'
post_data[:link]    = 'http://path.to/my/link'
post_data[:caption] = 'A caption'
post_data[:description] = 'A description'
post_data[:picture] = 'http://path.to/myimage.jpg'
post_data[:actions] = { :name => 'My site name', :link => 'http://link.to/my/site'}.to_json

client.post("feed", nil, post_data)
</pre></code>

What I've demonstrated above is a use-case where you'd post a link with a thumbnail image.  Facebook specifies quite a few other things that you can include with your <a href="http://developers.facebook.com/docs/reference/api/post">post</a>.  A few things are not relevant to page publishing, for instance you cannot set privacy on a page's wall post as it's visible to all people that like that page.  

Mogli does include a Mogli::Post class but I wasn't able to get it to work without getting an error response from the API.  Fortunately it also supports passing a simple hash of attributes.  Notice that I'm serializing the actions hash to JSON before passing it to the hash.  That threw me for a real loop, but Facebook very literally wants JSON objects passed as strings.

Executing the above code should result in your post appearing on your pages wall.  Congratulations - you made it.  Happy wall posting!
