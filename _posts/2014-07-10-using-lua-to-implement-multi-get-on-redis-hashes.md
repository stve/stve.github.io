---
layout: post
title: "Using Lua to implement multi-get on Redis hashes"
date: "2014-07-10 09:45:00"
published: true
author: Steve Agalloco
category: Development
description: "Experimenting with Redis and Lua."
keywords: "redis, lua, messagepack, json, hash, stream, performance, benchmark, hgetall, pipelined"
---

On a recent project at [Tradier](http://tradier.com), we relied heavily on [Redis](http://redis.io) hashes. We really like Redis for it's versatility - it's various data types create lots of possibilities for solutions. We were thoroughly impressed by it's tolerance to a write-heavy data stream that we were pushing into it. But as fast as we were able to write data in, we found it's performance while doing multi-read's to be a little more cumbersome than we'd like.

Using the Redis Ruby Gem, we first turned to pipelined requests. Pipelined requests return a future, meaning in order to fully query and load, you essentially have to loop twice:

{% highlight ruby %}

data = {}

$redis.pipelined do
  keys.each do |key|
    data[key] = $redis.hgetall(key)
  end
end

data.each do |key,value|
  data[k] = v.value
end

{% endhighlight %}

While this does the job, it's tedious and with large key-sets not as performant as we'd like it to be. What we'd really like is something closer to Memcached's multi-get support. As we considered other solutions, we decided to take a look at Redis' <a href="http://redis.io/commands/eval">scripting support</a> to see if it could help.  Not really knowing much about <a href="http://www.lua.org">Lua</a>, we were pretty surprised by how powerful Lua was. Using Lua, we can make a single request to Redis, passing all of the keys as an argument to the Lua script:

{% highlight lua %}

local collate = function (key)
  local raw_data = redis.call('HGETALL', key)
  local data = {}

  for idx = 1, #raw_data, 2 do
    data[raw_data[idx]] = raw_data[idx + 1]
  end

  return data;
end

local data = {}

for _, key in ipairs(KEYS) do
  data[key] = collate(key)
end

{% endhighlight %}

The code was fairly simple. We can loop through the `KEYS` and invoke the `collate` method we defined to load the hash data. The challenge then became passing this data back to our ruby code. We found that while Lua objects will not easily serialize back to a Ruby object, Redis' Lua implementation offers up some options: namely cjson and cmsgpack. We need just return from the script and we're now returning data back:

{% highlight lua %}

-- return json
return cjson.encode(response)

-- return messagepack
return cmsgpack.pack(data)

{% endhighlight %}

What we found is that between pipelined requests, lua + json, and lua + messagepack, messagepack was the best performer of the three solutions. Our final solution ended up something like this:

{% highlight ruby %}

require 'redis'
require 'msgpack'

keys = %w(FOO BAR BAZ)

lua_msgpack_loader = <<LUA
local collate = function (key)
  local raw_data = redis.call('HGETALL', key)
  local hash_data = {}

  for idx = 1, #raw_data, 2 do
    hash_data[raw_data[idx]] = raw_data[idx + 1]
  end

  return hash_data;
end

local data = {}

for _, key in ipairs(KEYS) do
  data[key] = collate(key)
end

return cmsgpack.pack(data)
LUA

redis = ::Redis.new(:driver => :hiredis)
data = MessagePack.unpack(redis.eval(lua_msgpack_loader, :keys => keys))

{% endhighlight %}

Of course, no post like this would be complete without a benchmark (using 10K keys):

<pre>
                      user     system      total        real
lua + json        0.350000   0.010000   0.360000 (  1.242315)
lua + msgpack     0.260000   0.020000   0.280000 (  1.146377)
redis pipelined   1.070000   0.020000   1.090000 (  1.759858)
</pre>

Overall, we were pleasantly surprised by Redis and Lua and it's definitely a solution we'll turn to in the future as well.

<hr/>

<div class="well">
  <p><em>This post has been cross-posted to the <a href="http://stdout.tradier.com">Tradier Developer Blog</a>, for more posts like this, you may want to follow our posts there as well!</em></p>
</div>
