---
id: "0050"
title: "Setting up and Installing WordPress on DigitalOcean with NGINX"
description: "WordPress is a popular content management system (CMS) that allows you to create and manage websites easily. In this tutorial, we will walk you through the process of setting up and installing WordPress on a DigitalOcean Linux server using NGINX.

..."
date: "2017-01-12"
categories: 
  - "PHP"
  - "Wordpress"
  - "NGINX"
tags: 
  - "Digital Ocean"
  - "Blog"
img: "blog/digitalocean.png"
cover: "blog/digitalocean.png"

language: "en"
alternates:
    - fr: ""
---

# Introduction
WordPress is a popular content management system (CMS) that allows you to create and manage websites easily. In this tutorial, we will walk you through the process of setting up and installing WordPress on a DigitalOcean Linux server using NGINX.

## Prerequisites
Before we begin, it's best you have the following:
- A DigitalOcean account. If you don't have one, sign up at [Digital Ocean](https://www.digitalocean.com/)
- Basic knowledge of the Linux command line.


## Installation
### Step 1: Create a DigitalOcean Droplet
First, we need to create a DigitalOcean droplet. A droplet is a virtual machine that runs on top of a Linux distribution. To create a droplet, log in to your DigitalOcean account and click the **Create** button at the top right corner of the page. Then, select **Droplets** from the dropdown menu.

Basically, the steps are as follows:
1. Log in to your DigitalOcean account.
2. Click on the "Create" button and select "Droplets" from the dropdown menu.
3. Choose a Linux distribution (e.g., Ubuntu) and the server size that meets your requirements.
4. Select a datacenter region, enable backups if desired, and choose an authentication method (password or SSH key).
5. Click "Create Droplet" to deploy your server.

For more information on how to create a droplet, check out the [DigitalOcean documentation](https://www.digitalocean.com/docs/droplets/how-to/create/).


### Step 2: Connect to Your Server
1. Once your Droplet is created, you'll receive an email with the server IP address, username, and password.
2. Use an SSH client (e.g., PuTTY on Windows or Terminal on macOS/Linux) to connect to your server using the provided IP address and credentials.

### Step 3: Update the Server
Update the package repository and upgrade existing packages by running the following commands:

```bash 
sudo apt update
sudo apt upgrade
```

### Step 4: Install NGINX
Install NGINX on your server by running the following command:

```bash
sudo apt install nginx
```

### Step 5: Configure NGINX
Create a new server block configuration file for your WordPress site by running the following command:

```bash
sudo nano /etc/nginx/sites-available/wordpress
```

After that, paste the following configuration into the file:

```conf
# Replace 'your_domain.com' and 'www.your_domain.com' with your actual domain or server IP address
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;
    root /var/www/html;

    index index.php;
    client_max_body_size 100M;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Enable the NGINX server block configuration:

```bash
sudo ln -s /etc/nginx/sites-available/wordpress /etc/nginx/sites-enabled/
```

Remove the default NGINX configuration:

```bash
sudo rm /etc/nginx/sites-enabled/default
``` 

Test the NGINX configuration:
    
```bash
sudo nginx -t
```

### Step 6: Install PHP (Required Extensions) and MySQL
The next step is to install PHP and the required PHP extensions; for now we will only install `php-fpm` and `php-mysql`. You can install other extensions later as needed.

```bash
sudo apt install php-fpm php-mysql
```

Install MySQL on your server by running the following command:
```bash
sudo apt install mysql-server
```

During the installation, you'll be prompted to set a password for the MySQL root user. Make sure to remember it.

Configure MySQL for improved security by running the following command:

```bash
sudo mysql_secure_installation
```

Follow the on-screen prompts and answer the questions according to your preferences. It's recommended to answer "Y" to all the prompts for improved security.

Then log in to the MySQL shell as the root user, and create a new database and user for WordPress:

```bash
sudo mysql -u root -p
```
Then run this SQL query to create a new database and user:

```sql
CREATE DATABASE wordpress;
CREATE USER 'wordpressuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpressuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

To make it more secure you're advised to change the database name, username, and password.

### Step 7: Download and Configure WordPress
Change to the NGINX web root directory and download the latest version of WordPress by running the following command:

```bash
cd /var/www/html
sudo wget https://wordpress.org/latest.tar.gz
sudo tar -xvzf latest.tar.gz
sudo chown -R www-data:www-data /var/www/html/wordpress
sudo mv wordpress/* .
sudo rm -rf wordpress latest.tar.gz
```

### Step 8: Set File Permissions
Set the correct file permissions for the WordPress installation by running the following commands:

```bash
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;
```

### Step 9: Configure WordPress
Create a configuration file by making a copy of the sample configuration:
```bash
cp /var/www/html/wp-config-sample.php /var/www/html/wp-config.php
```

Open the configuration file for editing:
```bash
sudo nano /var/www/html/wp-config.php
```

Update the following lines with your MySQL database details:
```php
define('DB_NAME', 'wordpress');
define('DB_USER', 'wordpressuser');
define('DB_PASSWORD', 'password');
define('DB_HOST', 'localhost');
```

Replace 'password' with the password you set for the MySQL user.

### Step 10: Restart NGINX and PHP-FPM
Restart NGINX and PHP-FPM to apply the changes:

```bash
sudo systemctl restart nginx
sudo systemctl restart php7.4-fpm
``` 

### Step 11: Complete the Installation
Open your browser and navigate to your server's domain name or IP address (e.g., http://your_domain.com or http://server_IP_address). You will see the WordPress installation page.
