--- 
layout: post
title: Libmemcached Store and Passenger
wordpress_id: 148
wordpress_url: http://www.beforeitwasround.com/?p=148
---
Stemming from the <a href="http://www.beforeitwasround.com/2010/06/29/adventures-in-rails-caching/">caching issues</a>, I described previously, I decided it was a good opportunity to update our caching implementation.  What we had was a hybrid of MemCacheStore for use with fragments and a wrapper around Evan Weaver's memcached gem for a few other processes.  This was a bit quirky, not to mention fragile.  Multiple implementations, multiple configurations.  Smelly code, for sure.

I've worked with other caching frameworks before and while i was loathe to introduce any new complexity, it seemed that the best approach was to unify the two implementations as much as possible.  That meant staying away from cache_fu, cache-money, interlock, etc.  There's been a dearth of caching libraries popping up over the past year or so.  I suspect that's because many people are using Rails internal caching.  That led me to look at cache_stores, and <a href="http://github.com/37signals/libmemcached_store/">libmemcached_store</a> from 37 Signals.  It was a breeze to implement as a drop-in replacement for MemCacheStore.  

The only catch was, we're using passenger.  I wanted to make sure that LibmemcachedStore played nice with passenger's spawning process.  Here's how to do it:

<script src="http://gist.github.com/459083.js?file=environment.rb"></script>

It'd be nice if all cache stores implemented a reset or disconnect method, in the meantime, we have hacks like this.
