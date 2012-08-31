---
layout: post
title: Adventures in Rails Caching
---

For the past week or so, I've been racking my brain trying to resolve an issue with memcached.  Basically, several times a day our data was disappearing.  We had plenty of memory to use so that definitely wasn't a factor.  Yet daily, we experienced data loss.  This led me on a meandering path of troubleshooting, was it the ruby driver?  was it the older version of memcached we were running?  Could it have been the controller action that called Rails.cache.clear? (BTW, **don't do this**)

I noticed a pattern, this always happened in the morning, typically beginning around 9:15.  With that, I scanned crontab to see what jobs might've been running around that time.  I came to find a call to a rake task in our codebase: cache:fragment:delete:

{% highlight ruby %}
namespace :cache do
  namespace :fragment do

    desc 'Manually remove all fragment caches'
    task :delete => :environment do
      ActionController::Base.cache_store.clear
    end
  end
end
{% endhighlight %}

So, whenever this rake task is run, it deletes the fragments. Right?  Wrong.

In this case, we didn't define a cache store for ActionController, but we did define a cache_store for ActiveSupport.  So where were the fragments?  In memcached.  And that innocuous call to delete the fragments was flushing memcached!  It turns out that when you don't define a separate cache store for ActionController, it uses whatever cache store is configured for ActiveSupport.  A quick look at the rails initializer code confirms this:

{% highlight ruby %}
 def initialize_cache
  unless defined?(RAILS_CACHE)
    silence_warnings { Object.const_set "RAILS_CACHE", ActiveSupport::Cache.lookup_store(configuration.cache_store) }

    if RAILS_CACHE.respond_to?(:middleware)
      # Insert middleware to setup and teardown local cache for each request
      configuration.middleware.insert_after(:"ActionController::Failsafe", RAILS_CACHE.middleware)
    end
  end
end

def initialize_framework_caches
  if configuration.frameworks.include?(:action_controller)
    ActionController::Base.cache_store ||= RAILS_CACHE
  end
end
{% endhighlight %}

This is how it should work.   Why assume a separate cache store when you've configured one elsewhere in your app?  This makes total sense, but it was quite the gotcha when I realized what was happening.  Why was the cache being cleared, you ask?  Well, the key generation scheme changed within rails somewhere along the way so the specific call to delete the fragment was no longer working.  All I had to do was figure out what the proper key should be, expire that fragment specifically, and all was right in the world.
