---
id: "0020"
title: "Laravel dynamic roles and permissions package"
description: "Roles and permissions are an important part of most applications, and as a result there has been a lot of packages built to make it easier for developers to implement.

..."
date: "2022-01-13"
categories: 
  - "Laravel"
  - "PHP"
tags: 
  - "Roles and Permissions"
  - "Security"
  - "Pivot Table"
  - "Many-to-many Relationship"
img: "blog/roles-and-permissions.webp"
cover: "blog/roles-and-permissions.webp"

language: "en"
alternates:
    - fr: ""
---

## Introduction
Roles and permissions are an important part of most applications, and as a result there has been a lot of packages built to make it easier for developers to implement.

The most popular Laravel `roles-and-permissions` package built by [Spatie](https://spatie.be/docs/laravel-permission) has proven to solve most roles-and-permissions related problems, except a few parts:

- Role hierarchy 
- Roles and permissions on a pivot table (`many-to-many` relationship)

In this post, I will talk about a Laravel package that allows you to assign roles and permissions to any Laravel model, or on a pivot table (many to many relationships), and also solves most of the problems highlighted above.

## Basic usage
Before diving in, here is a basic illustration of how it can be used.
```php
// Assign a 'Super Admin' role to this user
$user->assign(Role::SuperAdmin);

// Check the user role 
$user->isSuperAdmin(); // or 
$user->hasRole(Role::SuperAdmin);

// Check if the user can perform the operation
$user->canDeleteTransactions(); // or
$user->can(Permission::DeleteTransactions);

// Check if the user has multiple permissions
$user->holds(Permission::DeleteTransactions, Permission::BlockUsers);
```

### Roles and permissions on many-to-many relationship (pivot table)
```php
// Assign a 'Super Admin' role to this user on the selected model
$user->of($merchant)->assign(Role::SuperAdmin);

// Or check the user role like this
$user->of($merchant)->isSuperAdmin();  // or
$user->of($merchant)->hasRole(Role::SuperAdmin); 

// Check if the user can 'delete transactions' on the selected model
$user->of($merchant)->canDeleteTransactions(); // or
$user->of($merchant)->can(Permission::DeleteTransactions); 

// Check if the user has multiple permissions on the selected model
$user->of($merchant)->holds(Permission::DeleteTransactions, Permission::BlockUsers);
```

## Installation
You can install the package via composer:
```
composer require ajimoti/roles-and-permissions
```

Once the package has been installed, run the command below, and you are set to use the package.

```
php artisan roles:install
```

## Explanation
After installing the package, the following files are being made available to your application

- `Ajimoti\RolesAndPermissions\HasRoles` trait, 
- `app\Enums\Role.php` 
- `app\Enums\Permission.php` 

This trait should be imported to the eloquent model you would like to assign roles and permissions to. Below is a sample of how the import and use the trait:

```php
use Illuminate\Foundation\Auth\User as Authenticatable;
use Ajimoti\RolesAndPermissions\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
    // ...
}
```

### Roles Declaration (`app\Enums\Role.php`)
This file is used when validating roles and permissions. You are expected to declare the roles available on this file, and assign permissions to them in the `permissions()` method.

Below is a sample of what the role class can look like:

```php
<?php

namespace App\Enums;

use Ajimoti\RolesAndPermissions\Helpers\BaseRole;

final class Role extends BaseRole
{
    const SuperAdmin = 'super_admin';
    const Admin = 'admin';
    const Customer = 'customer';

    public static $useHierarchy = true;

    /**
    * Set available roles and their permissions.
    *
    * @return array
    */
    final public static function permissions(): array
    {
        return [
            self::SuperAdmin  => [
                Permission::DeleteProducts, 
                Permission::DeleteTransactions, 
                Permission::ViewTransactions,
            ],

            self::Admin  => [
                Permission::EditProducts, 
                Permission::CreateProducts, 
            ],

            self::Customer  => [
                Permission::BuyProducts,
            ],
        ];
    }
}
```

From the above class, the `SuperAdmin`, `Admin` and `Customer` constants are the declared roles, and as you can see, each role has been assigned permissions in the `permissions()` method.

Additionally, the role class has a `$useHierarchy` property set to `true` which means that the higher roles should inherit the permissions of their respective lower roles. As a result, the `SuperAdmin` role is known to be the highest level role because it is the first constant declared in the class, while the `Customer` role is believed to be the lowest level role as it appears last.

```
SuperAdmin > Admin > Customer
```

Hence, the `SuperAdmin` role has inherited every other role permission, 

Their permissions are as follows

| Role | Permissions |
| ----------- | ----------- |  
| **`SuperAdmin`** | *Delete products*, *Delete transactions*, *View transactions*, *Edit products*, *Create products*, *Buy products*  |
| **`Admin`** | *Edit products*, *Create products*, *Buy products*  | 
| **`Customer`** | *Buy products* | 


> [You can read the official documentation](https://roles.ajimoti.co/docs/intro) to better understand the `Permission` class

### Available methods
The example below explains some of the methods available on a model after installation.  

```php
use App\Enums\Role;
use App\Enums\Permission;

// Assign a 'Super Admin' role to this user
$user->assign(Role::SuperAdmin);

// Check if the user has the role
$user->hasRole(Role::SuperAdmin);

// Or check the user role like this
// $model->is{role_key}();
$user->isSuperAdmin();

// Check if the user can perform a operation
$user->can(Permission::DeleteTransactions);

// Or check if the user can perform the operation like this:
// $model->can{permission_key}();
$user->canDeleteTransactions();

// Check if the user has multiple permissions
$user->holds(Permission::DeleteTransactions, Permission::BlockUsers);

// Give a user a permission directly
$user->give(Permission::DeleteTransactions); // the user now has this permission
```

## Roles and permissions on a many-to-many relationship (Pivot table)

Using the package on a `many-to-many` relationship is slightly different from using it on a normal model. The following are required for the package to work correctly on a `many-to-many` relationship: 

- A pivot table is needed
- The pivot table **MUST** have a `role` column. This column will be used to keep track of the role assigned to the relationship. (if you want to use a different column name, you can set this in the config file).
- A `belongsToMany` relationship for the pivot table must exist on one of the models.

### Quick sample
The first step is to import the `Ajimoti\RolesAndPermissions\HasRoles` trait and have a `belongs-to-many` relationship on the model.

Let's assume we are building an application that allows `merchants` to manage their `users`, additionally, a user can be a member of many merchants, i.e a merchant has many users. 

Hence we have a database structure like this:
```
users
    id - integer
    name - string

merchant
    id - integer
    name - string

merchant_user (the pivot table)
    merchant_id - integer
    user_id - integer
    role - string (nullable)
```

From the above database structure, here is an illustration of what the user model should look like: 

```php
use Illuminate\Foundation\Auth\User as Authenticatable;
use Ajimoti\RolesAndPermissions\HasRoles;

class User extends Authenticatable
{
    use HasRoles;

    // ...
    public function merchants()
    {
    	return $this->belongsToMany(Merchant::class);
    }
    // ...
}
```
After doing the above, the HasRole trait provides an `of()` method that can be used to perform roles and permissions related logic between two models via the belongs to many relationships.

#### Usage
For the examples below, we would assume the variable `$merchant` is set to a merchant with name `wallmart` like so:

```php
$merchant = Merchant::where('name', 'wallmart')->first();
```

```php
use App\Enums\Role;
use App\Enums\Permission;

// Sample merchant
$merchant = Merchant::where('name', 'wallmart')->first();

// Assign a 'Super Admin' role to this user on the selected merchant (wallmart)
$user->of($merchant)->assign(Role::SuperAdmin);

// Check if the user has a super admin role on the selected merchant (wallmart)
$user->of($merchant)->hasRole(Role::SuperAdmin);

// Or check the user role like this
// $user->of($model)->is{role_key}();
$user->of($merchant)->isSuperAdmin();

// Check if the user can 'delete transactions' on the selected merchant (wallmart)
$user->of($merchant)->can(Permission::DeleteTransactions);

// Or check if the user can has the permissions like this
// $user->of($model)->can{permission_key}();
$user->of($merchant)->canDeleteTransactions();

// Check if the user has multiple permissions on the selected merchant (wallmart)
$user->of($merchant)->holds(Permission::DeleteTransactions, Permission::BlockUsers);
```

This is just a summary of a few things you can do with the package, a few other features still exists [on the documentation](https://roles.ajimoti.co/docs/intro). 

## Finally
If you find this useful, or you are searching for a package that supports roles and permissions on a `many-to-many` relationship, roles in hierarchy, or declaration of roles and permissions as enum constants, this is the package to work with.
