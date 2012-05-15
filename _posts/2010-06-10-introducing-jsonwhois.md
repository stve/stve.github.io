--- 
layout: post
title: Introducing jsonwhois
wordpress_id: 131
wordpress_url: http://www.beforeitwasround.com/?p=131
---
I've been at <a href="http://railsconf.com/">Railconf 2010</a> all week and it's been awesome.  I'm heading home with a laundry list a mile long of different technologies to experiment with and learn about.  I wanted a small side project to hack on while in between sessions and came up with <a href="http://jsonwhois.heroku.com">jsonwhois</a>.  The idea behind it is really simple, serve up whois via JSON.  The implementation was equally simple, using <a href="http://www.simonecarletti.com">Simone Carletti's</a> <a href="http://github.com/weppos/whois">whois gem</a> which handled all the hard stuff, I merely had to wrap it in a sinatra framework.

There was one tricky aspect that I had to overcome, the whois gem utilizes the ruby Struct object for some of it's underlying data.  Structs are simple and lightweight, but for some reason, the json gem wasn't handling them properly.  What's more, I didn't really like how the json gem serialized them anyway.  The workaround: <a href="http://ruby-doc.org/core/classes/Struct.html#M000892">Struct#hash</a>.  Struct#hash returns a struct's contents as a hash.  It's exactly what I wanted as I felt it was a cleaner representation for JSON anyway.  All that was required then was to extend Struct and implement to_json using the hash:

<script src="http://gist.github.com/433335.js?file=struct.rb"></script>

One other interesting tidbit was that I wanted to actually read the JSON through the browser.  I decided it was best to look at the incoming headers and use that to determine the appropriate response type to send back.  If you accept application/json, that's what i give you, otherwise it comes back as test/plain.  If there's a better way to do this, please let me know, this seemed logical though:

<script src="http://gist.github.com/433335.js?file=sinatra_response.rb"></script>

The code is up on <a href="http://github.com/spagalloco/jsonwhois">github</a> if anyone want to look under the covers.
