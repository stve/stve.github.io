---
layout: post
title: Sending Rails Deprecation Warnings to Sentry
published: true
categories:
  - rails
  - sentry
---

If you've upgraded a Rails app recently, you are no stranger to deprecation warnings. As I've been going through some of our apps (most of which were running 3.2) and upgrading them, I've wanted a way to get notified of these warnings without having to scan the logs.

We use [Sentry](https://getsentry.com) to manage our exception handling, so I figured there must be a way to handle these warnings just like exceptions.  Since I had to read a little bit of Rails code to figure this out, I figured I'd share what I learned.  ActiveSupport allows you to define one or more deprecation behaviors by using  [`ActiveSupport::Deprecation.behavior=`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/deprecation/behaviors.rb#L71-L73). Several options are included by default:

* `:raise` - raise an exception instead of warning
* `:stderr` - log them to `$stderr`
* `:log` - log them out using `Rails.logger`
* `:notify` - publish an alert using [ActiveSupport Notifications](http://api.rubyonrails.org/classes/ActiveSupport/Notifications.html)
* `:silence` - sweep them under a rug and pretend they never existed, until they are truly deprecated and bite you.

Based on the [documentation](http://api.rubyonrails.org/classes/ActiveSupport/Deprecation/Behavior.html), you can also pass a custom handler class or a proc, basically, anything that responds to `call` can be used. When a deprecation warning is issued, the list of behaviors is looped through and passed the deprecation message and callstack:

{% highlight ruby %}
def warn(message = nil, callstack = nil)
  return if silenced

  callstack ||= caller(2)
  deprecation_message(callstack, message).tap do |m|
    behavior.each { |b| b.call(m, callstack) }
  end
end
{% endhighlight %}

By default, Rails uses `:stderr`. I wanted to keep that behavior, but also include  Sentry. ActiveSupport Notifications are a perfect way to do that. Using the raven gem to hook into Sentry, here's where I landed:

{% highlight ruby %}
ActiveSupport::Deprecation.behavior = [:stderr, :notify]
ActiveSupport::Notifications.subscribe('deprecation.rails') do |name, start, finish, id, payload|
  Raven.capture_message("DEPRECATION WARNING", {
    :logger => 'logger',
    :extra  => {
      'message'   => payload[:message],
      'backtrace' => payload[:callstack].join("\n  ")
    },
    :tags   => {
      'environment' => Rails.env
    }
  })
end
{% endhighlight %}
