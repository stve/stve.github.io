---
layout: post
title: "How To: Create Dropwizard Tasks"
date: 2014-05-27 11:45:00
author: Steve Agalloco
published: true
category: Development
description: "Learn how to create tasks inside the Java based Dropwizard framework."
keywords: "dropwizard, java, java api, java services, jetty, tasks, schedule, framework, api, express, sinatra"
---

We're big fans of the [Dropwizard](https://dropwizard.github.io/dropwizard/) framework. It's straightforward approach to services allows us to create fast and highly available systems very easily. While we've used a number of different Java frameworks when building out our platform, Dropwizard is quickly becoming our de-facto standard for all new services.

As we built out our new market data service, we found a need to add a task. Dropwizard's [documentation](https://dropwizard.github.io/dropwizard/manual/index.html) is fantastic, encompassing everything from application structure to internals and semantics, but tasks aren't covered particularly well. We've [submitted a pull request](https://github.com/dropwizard/dropwizard/pull/596) to improve the docs, but opted to document our learnings here as well.

The `Task` is [defined as an abstract class](https://github.com/dropwizard/dropwizard/blob/master/dropwizard-servlets/src/main/java/io/dropwizard/servlets/tasks/Task.java) that you must subclass.  The main thing to point out is the `execute` method which is called when the task is invoked. Let's define a sample task to see how it works.  For this example, we'll create a task called `TruncateDatabaseTask`. First, we'll define the class:

```java
package com.myapp.tasks;

import io.dropwizard.servlets.tasks.Task;

public class TruncateDatabaseTask extends Task {
}
```

Dropwizard requires that each task have a name. The name has a special purpose as it's also used to compose the path that the task is accessible from within Dropwizard.  The `Task` defines a basic constructor that we can use, but let's define it explicity via a constructor of our own (more on this later). We'll also implement the `execute` method even though we're not doing anything yet.

```java
package com.myapp.tasks;

import io.dropwizard.servlets.tasks.Task;

public class TruncateDatabaseTask extends Task {
  public TruncateDatabaseTask() {
    super("truncate")
  }

  @Override
  public void execute(ImmutableMultimap<String, String> parameters, PrintWriter output) throws Exception {
  }
}
```

At this point, we have a fully composed Dropwizard task. Now we just need to add it to our application:

```java
public void run(MyAppConfiguration config, Environment env) throws Exception {

  // tasks
  env.admin().addTask(new TruncateDatabaseTask());
}
```

Start your application, and you'll see that the task is now registered alongside the garbage collection task that Dropwizard adds automatically

```
INFO  [2014-05-16 19:15:35,564] io.dropwizard.setup.AdminEnvironment: tasks =

    POST    /tasks/gc (io.dropwizard.servlets.tasks.GarbageCollectionTask)
    POST    /tasks/truncate (com.myapp.tasks.TruncateDatabaseTask)
```

Let's make this a more practical example. The value of defining a constructor is that we can dependency inject anything we need into the task from our Dropwizard application:

```java
package com.myapp.tasks;

import io.dropwizard.servlets.tasks.Task;

public class TruncateDatabaseTask extends Task {
  private Database database;

  public TruncateDatabaseTask(Database database) {
    super("truncate")
    this.database = database;
  }

  @Override
  public void execute(ImmutableMultimap<String, String> parameters, PrintWriter output) throws Exception {
    this.database.truncate();
  }
}
```

Most of our Dropwizard tasks look a lot like the one above. We found these tasks valuable as schedulable components of our application without building custom scripts to tie back to the current runtime.  If you use Sinatra or Express to build service APIs definitely check out [Dropwizard](https://dropwizard.github.io/dropwizard/).

---

*This post has been cross-posted to the <a href="http://stdout.tradier.com">Tradier Developer Blog</a>, for more posts like this, you may want to follow our posts there as well!*
