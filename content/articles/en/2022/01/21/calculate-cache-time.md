---
id: "0030"
title: "Calculate cache time with ease in PHP"
description: "Caching is an important part of programming as it helps reduce the frequency of CPU intensive tasks you have to run on your server, thereby improving performance.

..."
date: "2022-01-21"
categories: 
  - "Laravel"
  - "PHP"
tags: 
  - "Cache"
  - "Symfony"
img: "blog/cache-time-php.png"
cover: "blog/cache-time-php.png"

language: "en"
alternates:
    - fr: ""
---

## Introduction
> A cache is a collection of duplicate data, where the original data is expensive to fetch or compute (usually in terms of access time) relative to the cache. In PHP, caching is used to minimize page generation time. _([credit](https://en.wikibooks.org/wiki/PHP_Programming/Caching#:~:text=A%20cache%20is%20a%20collection,to%20minimize%20page%20generation%20time.))_

Caching is an important part of programming as it helps reduce the frequency of CPU intensive tasks you have to run on your server, thereby improving performance.

Most PHP frameworks have their individual ways of caching, however, developers still find it difficult to calculate the duration for a cache as it is usually in seconds.

For example, say we want to store a user data for 24 hours:

```php
<?php
$duration = 24 * 60 * 60; // 24 hours

Redis::cache($userData, $duration);
```

From the snippet above, you would notice that for better readability, we had to set the `$duration` variable to a break down of the number of hours in seconds. Additionally, we included a comment that explains what the value is. 

Seems too tacky for something as basic as calculating time in seconds. What if there was a better way, what if we could replace the above snippet with something like this:

```php
<?php
use Ajimoti\CacheDuration\Duration;

Redis::cache($userData, Duration::twentyFourHours());
```

This is more readable compared to the previous snippet. We have changed the complex `$duration` variable value, and replaced it with a better readable method. Additionally, another developer going through the code does not have to worry about calculating the cache duration as the method name is self explanatory.

In this article, I will be talking about a package that provides a readable and fluent way to generate cache durations for your PHP applications.

::image
![Extracting signal from noise](/images/covers/blog/cache-time-php.jpeg)
::

## Installation
The first step is to install the package. You can install the package from composer using the script below:

```bash
composer require ajimoti/cache-duration --with-all-dependencies
```

After installation, import the `Duration` trait inside your class, then you are set.

```php
<?php
require 'vendor/autoload.php';

use Ajimoti\CacheDuration\Duration;

var_dump(Duration::fourtyMinutes()); // returns 2400;
var_dump(Duration::tenHours()); // returns 36000;
var_dump(Duration::fiftyFourDays()); // returns 4665600;
```

The `Duration` trait provides a fluent way to generate cache durations. In order to achieve this, make a static call of a number in words (must be in `camelCase`), followed by the time unit _(either `Seconds`, `Minutes`, `Hours` or `Days`)_. 

### How it works
The `Duration` trait uses `PHP` `__callStatic()` magic method to allow you make dynamic calls.

For example, you want to get the number of seconds in 37 days, you can achieve this by calling a `camel case` text of the number in words _(`thirtySeven` in this case)_, followed by the unit in `title case` _(`Days` in this case)_. 

That should leave us with something like this:

```php
<?php

Duration::thirtySevenDays(); // returns the number of seconds in 37 days
```

> **Note:** The number in words **MUST** be in `camel case`. Any other case will throw an `InvalidArgumentException`. Additionally, it must be followed by the unit in `title-case`. The available units are `Seconds`, `Minutes`, `Hours`, and `Days`.

## Other Available Methods
In addition to this, the following methods are made available for use:

### `seconds($value)`
Get duration in seconds. It basically returns the same value passed into it.
```php
<?php
use Ajimoti\CacheDuration\Duration;

$cacheDuration = Duration::seconds(30); // returns 30

// or dynamically
$cacheDuration = Duration::thirtySeconds(); // returns 30
```

### `minutes($value)`
Converts time in minutes into seconds.
```php
<?php
use Ajimoti\CacheDuration\Duration;

$cacheDuration = Duration::minutes(55); // returns 55 minutes in seconds (55 * 60)

// or dynamically
$cacheDuration = Duration::fiftyFiveMinutes(); // returns 55 minutes in seconds (55 * 60)
```

### `hours($value)`
Converts time in hours into seconds.
```php
<?php
use Ajimoti\CacheDuration\Duration;

$cacheDuration = Duration::hours(7); // returns 7 hours in seconds (7 * 60 * 60)

// or dynamically
$cacheDuration = Duration::sevenHours(); // returns 7 hours in seconds (7 * 60 * 60)
```

### `days($value)`
Converts time in days into seconds.
```php
<?php
use Ajimoti\CacheDuration\Duration;

$cacheDuration = Duration::days(22); // returns 22 days in seconds (22 * 24 * 60 * 60)

// or dynamically
$cacheDuration = Duration::twentyTwoDays(); // returns 22 days in seconds (22 * 24 * 60 * 60)
```

### `at($value)`
This method allows you to convert a `Carbon\Carbon` instance, `DateTime` instance or `string` of date into seconds. 

It returns the difference in seconds between the argument passed and the current `timestamp`.

> The date passed into this method **MUST** be a date in the future. Similarly, when a string is passed, the text **MUST** be compatible with `Carbon::parse()` method, else an exception will be thrown

#### Examples
```php
<?php
use Date;
use Carbon\Carbon;
use Ajimoti\CacheDuration\Duration;

// Carbon instance
$cacheDuration = Duration::at(Carbon::now()->addMonths(3)); // returns time in seconds between the present timestamp and three months time

// Datetime instance
$cacheDuration = Duration::at(new DateTime('2039-09-30')); // returns time in seconds between the present timestamp and the date passed (2039-09-30).

// String
$cacheDuration = Duration::at('first day of January 2023'); // returns time in seconds between the present timestamp and the first of January 2023.
```

## And that's it
If you find this useful, feel free to star ⭐️ or fork [the repository ](https://github.com/ajimoti/cache-duration).

Thanks for reading.
