---
layout: post
title: Auto-bcc'ing emails sent from Devise
published: true
categories:
  - devise
  - actionmailer
---

While digging through the [Devise](https://github.com/plataformatec/devise) source some time back, I found a little known and undocumented feature that offers some great flexibility: you can define the parent class for the `DeviseController` and `DeviseMailer`. Devise uses sane defaults and so these classes inherit from `ApplicationController` and `ActionMailer::Base` respectively. These are defined as module accessors, on the `Devise` module. Devise uses this configuration when defining the `DeviseMailer`:

{% highlight ruby %}
class Devise::Mailer < Devise.parent_mailer.constantize
  include Devise::Mailers::Helpers

  # there's more stuff in here, you should read the source!
end
{% endhighlight %}

Why is this useful? There are times when it's convenient to be able to change this class. For instance, let's suppose we want to automatically bcc an email address on new emails delivered from Devise. I needed to do this recently and found it to be quite easy using the `parent_mailer` configuration.

First, create a new mailer class that inherits from `ActionMailer::Base` and put it in `app/mailers`, let's call it `BaseMailer`. The simplest example would be an empty class:

{% highlight ruby %}
class BaseMailer < ActionMailer::Base
end
{% endhighlight %}

Then, in the initializer (typically `config/initializers/devise.rb`), instruct Devise to use this class as the `parent_mailer`:

{% highlight ruby %}
Devise.setup do |config|
  config.parent_mailer = 'BaseMailer'
end
{% endhighlight %}

For the sake of brevity, I've omitted the rest of the Devise configuration, but you'll want to add the `parent_mailer` alongside any other configuration items. Now `DeviseMailer` will inherit from our mailer class.  Now, it's just a matter of hooking in our auto-bcc logic:

{% highlight ruby %}
class BaseMailer < ActionMailer::Base

  protected

  def mail_with_bcc(headers={}, &block)
    headers.merge!(:bcc => 'me@example.com')
    mail_without_bcc(headers, &block)
  end
  alias_method_chain :mail, :bcc
end
{% endhighlight %}

As you can tell, I really enjoy reading other people's code. Especially when you are pleasantly surprised by a feature that solves a problem you are trying to solve!
