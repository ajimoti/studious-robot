---
id: "0040"
title: "Calculating Reading Time for a Blog"
description: "In many web applications, it's helpful to provide an estimated reading time for a given string of text. This feature allows users to gauge the time required to read an article, blog post, or any other textual content. 

..."
date: "2017-05-02"
categories: 
  - "PHP"
  - "Python"
tags: 
  - "Time Calculation"
  - "Blog"
img: "blog/calculate-string-read-time.jpeg"
cover: "blog/calculate-string-read-time.jpeg"

language: "en"
alternates:
    - fr: ""
---

# Introduction
In many web applications, it's helpful to provide an estimated reading time for a given string of text. This feature allows users to gauge the time required to read an article, blog post, or any other textual content. You will find this feature on content websites like [Medium](https://www.medium.com) etc. In this article, I will walk you through an algorithm implemented in PHP that calculates the number of minutes it will take to read a string.

## The Algorithm
To get started, let's define a PHP function called `calculateReadingTime`, which takes two parameters:

```php
function calculateReadingTime($text, $wordsPerMinute = 200) {
    // Calculate the number of words in the text
    $wordCount = str_word_count(strip_tags($text));

    // Calculate the estimated reading time in minutes
    $readingTime = ceil($wordCount / $wordsPerMinute);

    return $readingTime;
}
```

The first argument, `$text`, represents the input string for which we want to calculate the reading time. The second argument, `$wordsPerMinute`, is an optional parameter that represents the average reading speed in words per minute. By default, I set it to 200 words per minute, but you can adjust this value to suit your needs.

Inside the function, we use the `str_word_count()` function to count the number of words in the text. To ensure accurate word count, we remove any HTML tags from the string using `strip_tags`.

Next, we divide the word count by the words per minute to determine the estimated reading time in minutes. To ensure that the reading time is rounded up to the nearest whole number, we use the `ceil` function.

Finally, the function returns the calculated reading time.

## Usage Example
To calculate the reading time for a specific string, you can call the calculateReadingTime function as follows:

```php 
$text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";
$readingTime = calculateReadingTime($text);
echo "Estimated reading time: $readingTime minutes";
```
In this example, we initialize the variable `$text` with the string we want to measure. Then, we called the `calculateReadingTime` function, passing the `$text` variable as the input. The calculated reading time is stored in the `$readingTime` variable, which we then display as output using PHP's in-built function `echo()`.

Remember that this algorithm provides an estimate based on an assumed reading speed. The actual reading time may vary depending on the individual. Feel free to adjust the wordsPerMinute parameter to better suit the reading speed of your target audience.


### In Python
If you are using Python, you can implement the same algorithm as follows:

```python
import re
import math

def calculate_reading_time(text, words_per_minute=200):
    # Calculate the number of words in the text
    word_count = len(re.findall(r'\w+', text))

    # Calculate the estimated reading time in minutes
    reading_time = math.ceil(word_count / words_per_minute)

    return reading_time
```

Similar to the PHP example, we will define a Python function called `calculate_reading_time()` that takes two arguments: `text` and `words_per_minute`. The `text` argument represents the input string for which we want to calculate the reading time. The `words_per_minute` argument represents the average reading speed in words per minute. By default, I set it to 200 words per minute, but you can adjust this value to suit your needs.

Inside the function, we use the `re.findall()` function to count the number of words in the text. To ensure accurate word count, we use a regular expression to remove any HTML tags from the string.

Next, we divide the word count by the words per minute to determine the estimated reading time in minutes. To ensure that the reading time is rounded up to the nearest whole number, we use the `math.ceil()` function.

Finally, the function returns the calculated reading time.

### Usage Example in Python
To calculate the reading time for a specific string, you can call the `calculate_reading_time()` function as follows:

```python
text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
reading_time = calculate_reading_time(text)
print(f"Estimated reading time: {reading_time} minutes")
```

## Conclusion
By implementing the `calculateReadingTime` algorithm in PHP, you can easily provide users with an estimated reading time for any given string of text. 
