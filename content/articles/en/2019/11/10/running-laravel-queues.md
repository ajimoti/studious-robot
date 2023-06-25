---
id: "0010"
title: "Running laravel queue worker on two different applications that share the same database"
description: "Queues are set up for better user experience, they are used to make time-consuming tasks run in the background while the user gets to move on to something else, not having to wait till the end of these tasks.

..."
date: "2019-11-10"
categories: 
  - "Laravel"
  - "PHP"
tags: 
  - "Queue"
  - "Queue worker"
img: "blog/laravel-queues.webp"
cover: "blog/laravel-queues.webp"

language: "en"
alternates:
    - fr: ""
---

# Prerequisites
1. PHP
2. LARAVEL

**NOTE:** If you already understand laravel queues, and you're not interested in stories, go straight to the second heading.

"Queues are used to delay time-consuming tasks until a later time" - [larashout.com](https://larashout.com)


# Why use Laravel Queues?
Queues are set up for better user experience, they are used to make time-consuming tasks run in the background while the user gets to move on to something else, not having to wait till the end of these tasks.

For example, say you are building an application that allows a store owner send a promotional email to all their users; and it takes approximately two(2) seconds to send said email to one user, imagine how long the store owner would have to wait to send the email to a thousand users.

**Quick maths:** The total estimated time would be the number of users (say N), multiplied by two seconds (N x 2s), so we have 1000 x 2s = 2000s. Meaning the store owner would have to wait for 2000seconds (approximately 33.3 minutes) to reach a thousand users before getting a response, which is not great. Now think of how long it'd take to reach five thousand or ten thousand users.

This is where queues come in, Laravel queues pick all the action that you need to be carried out, store them on a driver with a predefined delay time set by the developer, returns a response to the user, then proceeds to dispatch the queues on the server without interfering with the user's activities.

Let me rephrase the previous paragraph to fit our store example, Laravel queue picks the customers email addresses selected by the store owner, stores them on a drive as a job with a predefined delay time set by the developer, returns a response to the store owner, then proceeds to dispatch the emails in the background at the set predefined time. The dispatch is done on the server without interfering with other activities the store owner might be doing on the application.

Below is a code sample that enables the store owner to send promotional emails using a queue.

```
$emailJob = new SendPromotionalEmail()->delay(Carbon::now()->addMinutes(5));
dispatch($emailJob);
```


Before the above code can work, there has to be a queue worker running. Here is what a queue worker does: A queue worker checks the driver for any pending jobs, and execute them. In this case, SendPromotionalEmail() is a job that would be stored on the drive waiting to be executed by the queue worker.

To run a queue worker, run the following command on your terminal.

```
php artisan queue:work
```

If you have read to this point, and still don't understand what queues are or what they are meant to do, you should read the queues section of the Laravel documentation for a better understanding and how to set them up.

# Diving to the Point
You might be wondering why you would want to run a queue worker on two different applications that share the same database, I recently ran into a situation like this, and spent hours trying to debug the issue before realizing the problem.

**PS:** In this example below, I used `database` as the queue driver.

Let's use the ride-hailing company Uber as an example, Say we built an application like Uber using laravel, but this time we built two different applications, the riders' version, and the drivers' version, and made both share the same database instead of using an API. (this example is a bad idea, but it's the best fit for this topic).

Building applications this big will require running queues in the background to carry out the time-consuming tasks, so we would have a queue worker running on both applications using the command:

```
php artisan queue:work
```

The above command will constantly check the jobs table on the database and executes any pending job it finds. Now here is the problem, since we have this command (the queue worker) running on both applications, there are times the riders queue worker will try to execute jobs that belong to the drivers' application, and vice versa depending on which queue worker hits the database first. And here's what happens whenever a queue worker tries to run a job that doesn't belong to it, the job would be executed but fails instantly because of its codebase differs from the job payload.

To solve this, we would have to customize our queue worker to only process particular queues on each of our application and to do this the jobs should be dispatched with a name using something like this 
`->onQueue('name_here');` and the queue worker should run on both apps with their respective names.

Going by the explanation above, here's what the code would look like on the riders app

```
$emailJob = new EmailNotification()->delay(Carbon::now()->addMinutes(5));
dispatch($emailJob)->onQueue('UberRiders');
```

Now that we have categorized the rider jobs, the queue worker should run with a flag indicating that it only runs the UberRiders jobs, so we have something like this:

```
php artisan queue:work database --queue=UberRiders
```

instead of using the below default command:

```
php artisan queue:work
```

The same thing would be done on the drivers laravel app, so we have something like this:

```
$emailJob = new EmailNotification()->delay(Carbon::now()->addMinutes(5));
dispatch($emailJob)->onQueue('UberDrivers');
```

And the queue worker looks like this

```
php artisan queue:work database --queue=UberDrivers
```

For practical examples about laravel queues, you can read about queues, and how they work [here](https://www.larashout.com/laravel-queues-step-by-step-guide).

# Conclusion
The best way to go about this is to build a central API and have both applications connect to them, that way you wouldn't have to bother yourself about running different queue workers on the same database, but if you find yourself in this type of issue, this should help you fix the issue.
