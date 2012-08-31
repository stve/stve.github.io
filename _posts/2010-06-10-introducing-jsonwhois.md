---
layout: post
title: Introducing jsonwhois
---

I've been at [Railconf 2010](http://railsconf.com) all week and it's been awesome.  I'm heading home with a laundry list a mile long of different technologies to experiment with and learn about.  I wanted a small side project to hack on while in between sessions and came up with [jsonwhois](http://jsonwhois.heroku.com).  The idea behind it is really simple, serve up whois via JSON.  The implementation was equally simple, using [Simone Carletti's](http://www.simonecarletti.com) [whois gem](http://github.com/weppos/whois) which handled all the hard stuff, I merely had to wrap it in a sinatra framework.

There was one tricky aspect that I had to overcome, the whois gem utilizes the ruby Struct object for some of it's underlying data.  Structs are simple and lightweight, but for some reason, the json gem wasn't handling them properly.  What's more, I didn't really like how the json gem serialized them anyway.  The workaround: [Struct#hash](http://ruby-doc.org/core/classes/Struct.html#M000892).  Struct#hash returns a struct's contents as a hash.  It's exactly what I wanted as I felt it was a cleaner representation for JSON anyway.  All that was required then was to extend Struct and implement to_json using the hash:

{% highlight ruby %}
class Struct
  def to_json(*args)
    hash.to_json(*args)
  end
end
{% endhighlight %}

One other interesting tidbit was that I wanted to actually read the JSON through the browser.  I decided it was best to look at the incoming headers and use that to determine the appropriate response type to send back.  If you accept application/json, that's what i give you, otherwise it comes back as test/plain.  If there's a better way to do this, please let me know, this seemed logical though:

{% highlight ruby %}
if request.accept.include?('application/json')
  content_type :json
else
  content_type :text
end
{% endhighlight %}

The code is up on [github](http://github.com/spagalloco/jsonwhois) if anyone want to look under the covers.
