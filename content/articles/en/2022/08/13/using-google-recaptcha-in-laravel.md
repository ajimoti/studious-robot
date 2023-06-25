---
id: "0090"
title: "Implement reCAPTCHA in a Laravel registration API route"
description: "Implement reCAPTCHA in a Laravel registration API route

..."
date: "2022-01-21"
categories: 
  - "Laravel"
  - "PHP"
tags: 
  - "Security"
  - "Bots"
img: "blog/recaptcha.jpeg"
cover: "blog/recaptcha.jpeg"

language: "en"
alternates:
    - fr: ""
---

# Introduction
One of the most common ways to prevent bots from submitting forms is to use a CAPTCHA. A CAPTCHA is a challenge-response test used to determine whether the user is human or not.

Google reCAPTCHA is a free service that protects your website from spam and abuse. reCAPTCHA uses an advanced risk analysis engine and adaptive CAPTCHAs to keep automated software from engaging in abusive activities on your site. It does this while letting your valid users pass through with ease.

In this article, I will be talking about how to implement Google reCAPTCHA in a Laravel registration API route. I will be keeping the article short and straight to the point.

# Diving In
To implement reCAPTCHA in a Laravel registration API route, you can follow these steps:

1. ### Get reCAPTCHA API keys:
   - Go to the reCAPTCHA website (https://www.google.com/recaptcha) and sign in with your Google account.
   - Register a new site by providing the necessary details (e.g., domain, label).
   - Once registered, you'll receive a site key and a secret key.

2. ### Install required packages:
   - In your Laravel project, open the terminal and navigate to the project directory.
   - Run the following command to install the required package for reCAPTCHA integration:
     ```shell
     composer require google/recaptcha "~2.0"
     ```

3. ### Add the reCAPTCHA keys:
   - Open the `.env` file in your Laravel project and add the following lines:
     ```dotenv
     RECAPTCHA_SITE_KEY=your-site-key
     RECAPTCHA_SECRET_KEY=your-secret-key
     ```
   - Replace `your-site-key` and `your-secret-key` with the actual reCAPTCHA keys you obtained in step 1.

4. ### Create a form with reCAPTCHA:
   - Open the registration view file (`register.blade.php` or similar) and add the following code where you want to place the reCAPTCHA widget:
     ```html
     <div class="g-recaptcha" data-sitekey="{{ config('recaptcha.site_key') }}"></div>
     ```
   - Make sure to include the necessary JavaScript libraries by adding the following code to your layout file (`app.blade.php` or similar), usually in the `<head>` section:
     ```html
     <script src="https://www.google.com/recaptcha/api.js" async defer></script>
     ```

5. ### Validate reCAPTCHA in the registration API route:
   - Open the registration API route file (`api.php`) and locate the registration route or create a new one if it doesn't exist.
   - Add the reCAPTCHA validation code before processing the registration logic. For example:
     ```php
     use ReCaptcha\ReCaptcha;

     // ...

     Route::post('/register', function (Request $request) {
         $recaptcha = new ReCaptcha(config('recaptcha.secret_key'));
         $response = $recaptcha->verify($request->input('g-recaptcha-response'), $request->ip());

         if (!$response->isSuccess()) {
             // reCAPTCHA validation failed
             return response()->json(['error' => 'reCAPTCHA validation failed'], 422);
         }

         // Proceed with user registration logic
         // ...
     });
     ```

6. ### Test the registration API route:
   - Start your Laravel development server if it's not already running (`php artisan serve`).
   - Use a tool like cURL or Postman to send a POST request to your registration API route (`http://localhost:8000/api/register`) with the required registration data and the `g-recaptcha-response` parameter containing the reCAPTCHA response token.

That's it! You have now implemented reCAPTCHA in your Laravel registration API route. The reCAPTCHA verification will occur before processing the user registration logic, ensuring that only valid reCAPTCHA responses are accepted.

# Conclusion
In this article, I have shown you how to implement Google reCAPTCHA in a Laravel registration API route. I hope you found this article useful and that it helped you solve your problem. 
