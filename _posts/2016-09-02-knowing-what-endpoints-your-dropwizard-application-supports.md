---
layout: post
title: Knowing what endpoints your Dropwizard application supports
published: true
author: Steve Agalloco
date: 2016-09-02 10:22:00
category: Development
description: "A useful task for your Dropwizard application."
keywords: "dropwizard, java, java api, java services, jetty, tasks, schedule, framework, api, express, sinatra"
---

A vast majority of our API technology is built on [Dropwizard](http://dropwizard.io) - we love the framework and how easily it allows us to build new APIs. As the number of services we run has increased, it can often be difficult to remember what endpoints an application responds to. When you start a Dropwizard application, the framework logs the endpoints in a really elegant format:

```
INFO  [2016-09-01 20:41:23,904] io.dropwizard.jersey.DropwizardResourceConfig: The following paths were found for the configured resources:

POST    /eat/lunch (com.tradier.rest.LunchResource)
GET     /fruit/banana (com.tradier.rest.BananaResource)
GET     /vegetable/avocado (com.tradier.rest.AvocadoResource)
```

But it's both impractical and slow to startup a server periodically to see it's endpoints. Of course documentation would be a solution here as well, but *ain't nobody got time for that!*. Fortunately, Dropwizard 0.8 added public methods to `DropwizardResourceConfig` to access the endpoint data in a way that can be leveraged within an application. Not wanting this to be part of a public API, [Dropwizard tasks](http://stdout.tradier.com/development/2014/05/27/how_to_create_dropwizard_tasks.html) are a great place to add this to our application:

```java
public class EndpointsTask extends Task {

  public EndpointsTask() {
    super("endpoints");
  }

  @Override
  public void execute(ImmutableMultimap<String, String> parameters, PrintWriter output)
      throws Exception {
    DropwizardResourceConfig config = new DropwizardResourceConfig();
    config.packages("com.tradier.rest");
    output.println(config.getEndpointsInfo());
  }
}
```

Now, when we want to see the endpoints for a given application, we can just access the task!

---

*This post has been cross-posted to the <a href="http://stdout.tradier.com">Tradier Developer Blog</a>, for more posts like this, you may want to follow our posts there as well!*
