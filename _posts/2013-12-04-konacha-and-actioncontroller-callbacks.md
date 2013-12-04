---
layout: post
title: Konacha and ActionController callbacks
published: true
categories:
  - ruby
  - konacha
---

At [Tradier](https://tradier.com), we are big fans of TDD. We're quite comfortable testing application and server-based code but front-end testing was relatively new to us. After looking at several options we decided on [Mocha][] as our test framework of choice and we've looked to [Konacha][] to conveniently test from our Rails apps. Our suite was running fine, until we introduced the [PaperTrail][] gem. We started seeing the following error:

{% highlight sh %}
NoMethodError: undefined method 'authenticate' for nil:NilClass
  ~/Projects/myapp/.bundle/gems/devise-3.0.1/lib/devise/controllers/helpers.rb:56:in 'current_user'
  ~/Projects/myapp/.bundle/gems/paper_trail-2.7.2/lib/paper_trail/controller.rb:17:in 'user_for_paper_trail'
  ~/Projects/myapp/.bundle/gems/paper_trail-2.7.2/lib/paper_trail/controller.rb:59:in 'set_paper_trail_whodunnit'
{% endhighlight %}

What's going on here? Konacha's `SpecsController` inherits from `ActionController::Base` so that it can render ERB templates and layouts which setup a browser environment to run the test suite. Pretty standard stuff for a Rails Engine. That brings us to PaperTrail and it's controller callbacks. By default, PaperTrail enables itself for all controllers, `SpecsController` included.  If we look at `user_for_paper_trail`, we see the following:

{% highlight ruby %}
def user_for_paper_trail
  current_user if defined?(current_user)
end
{% endhighlight %}

It's triggering `current_user` which invoked Devise, causing the exception above. Clearly, PaperTrail's user fingerprinting are interfering with Konacha. To fix this, we simply need to disable PaperTrail in the `SpecsController`. In addition to your Konacha configuration, you'll want to have something like this in `config/initializers/konacha.rb`:

{% highlight ruby %}
if defined?(Konacha)
  require 'capybara/poltergeist'
  Konacha.configure do |config|
    config.spec_dir    = "spec/javascripts"
    config.driver      = :poltergeist
    config.stylesheets = %w(application)
  end

  Konacha::SpecsController.class_eval do
    def paper_trail_enabled_for_controller
      false
    end
  end
end
{% endhighlight %}

With that in place, our tests started to work again. Konacha and Mocha are a nice combination for testing JavaScript, be sure to check them out. Happy testing!

[Konacha]: https://github.com/jfirebaugh/konacha
[Mocha]: http://visionmedia.github.io/mocha/
[PaperTrail]: https://github.com/airblade/paper_trail
