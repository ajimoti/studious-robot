---
id: "0014"
title: "Understanding SOLID Principles with Simple Examples"
description: "SOLID is a set of five principles that provide guidelines for designing and developing software that is maintainable, flexible, and robust. 

..."
date: "2018-07-07"
categories: 
  - "Python"
tags: 
  - "Coding Principles"
  - "Python"
img: "blog/solid-principles.png"
cover: "blog/solid-principles.png"

language: "en"
alternates:
    - fr: ""
---

# Introduction
SOLID is a set of five principles that provide guidelines for designing and developing software that is maintainable, flexible, and robust. These principles, introduced by Robert C. Martin (also known as Uncle Bob), help developers create code that is easier to understand, modify, and extend over time. In this article, I will explore each SOLID principle and illustrate them with simple examples to facilitate understanding.

## Single Responsibility Principle (SRP)
The Single Responsibility Principle states that a class should have only one reason to change. In other words, a class should have only one job. If a class has more than one responsibility, it becomes coupled. A change to one responsibility results in modification of the other responsibility. This can lead to unexpected bugs and a maintenance nightmare. Let’s look at an example of a class that violates the SRP.

Imagine you have a `Car` class that handles both car movement and car display. This violates the SRP since displaying the car is a separate responsibility from controlling its movement. A better approach would be to split these responsibilities into two separate classes: `Car` (for movement) and `CarDisplay` (for displaying).

```python
class Car:
    def __init__(self):
        self.position = 0

    def move_forward(self):
        self.position += 1

class CarDisplay:
    def __init__(self, car):
        self.car = car

    def display_position(self):
        print(f"The car is at position {self.car.position}")

car = Car()
car.move_forward()

display = CarDisplay(car)
display.display_position()
```

In the example above, we have separated the responsibilities of car movement and car display into two separate classes, Car and CarDisplay, respectively. This way, if we need to change the way the car is displayed, we can do so without affecting the car movement logic.

## Open/Closed Principle (OCP)
The Open-Closed Principle states that software entities (classes, modules, functions, etc.) should be open for extension but closed for modification. This principle encourages designing code that can be easily extended without modifying existing code. Let's look at an example:

Suppose we have a Shape class with a method called `calculateArea()`. If we want to add a new shape, such as a `Triangle`, instead of modifying the `Shape` class, we can extend it by creating a new `Triangle` class that inherits from `Shape` and overrides the `calculateArea()` method to provide the specific implementation for triangles. This way, we adhere to the OCP without modifying existing code.

```python
class Shape:
    def calculate_area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def calculate_area(self):
        return self.width * self.height

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height

    def calculate_area(self):
        return (self.base * self.height) / 2

shapes = [Rectangle(5, 3), Triangle(4, 6)]

for shape in shapes:
    print(f"Area: {shape.calculate_area()}")
```

In this example, we have a Shape base class with an abstract `calculate_area()` method. The Rectangle and Triangle classes extend Shape and provide their own implementations of the `calculate_area()` method.

## Liskov Substitution Principle (LSP)
The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program. In simpler terms, it implies that subclasses should be able to be used interchangeably with their parent class. Consider the following example:

We have a `Bird` class with a `fly()` method. If we create a `Penguin` class that extends Bird, the LSP dictates that the `Penguin` class should also have a `fly()` method. However, since penguins cannot fly, adhering to the LSP might involve creating an empty `fly()` method in the `Penguin` class or throwing an exception to indicate that it cannot fly. This principle ensures that substituting a subclass for its superclass does not cause unexpected behaviors.

```python
class Bird:
    def fly(self):
        pass

class Penguin(Bird):
    def swim(self):
        print("Penguin swimming!")

bird = Bird()
bird.fly()

penguin = Penguin()
penguin.swim()
```
In the above example, we have a Bird base class with a `fly()` method. The Penguin class extends Bird but does not implement the `fly()` method since penguins cannot fly. However, it adds a `swim()` method specific to penguins.

## Interface Segregation Principle (ISP)
The Interface Segregation Principle states that clients should not be forced to depend on interfaces they do not use. In other words, it promotes creating specific interfaces for clients rather than having a single large interface. Let's illustrate this with an example:

Suppose we have an `Animal` interface with methods like `walk()`, `fly()`, and `swim()`. If we have a client that only needs to work with animals that can walk, it would be burdensome for the client to depend on the entire `Animal` interface. Instead, we should create a separate `WalkingAnimal` interface that only contains the `walk()` method. This way, clients can depend on smaller, more focused interfaces that suit their needs.

```python
class WalkingAnimal:
    def walk(self):
        pass

class FlyingAnimal:
    def fly(self):
        pass

class SwimmingAnimal:
    def swim(self):
        pass

class Dog(WalkingAnimal):
    def walk(self):
        print("Dog walking!")

class Eagle(FlyingAnimal):
    def fly(self):
        print("Eagle flying!")

dog = Dog()
dog.walk()

eagle = Eagle()
eagle.fly()
```

In this example, we have separate interfaces (`WalkingAnimal`, `FlyingAnimal`, and `SwimmingAnimal`) for different types of animal behaviors. The `Dog` class implements the `WalkingAnimal` interface, while the `Eagle` class implements the `FlyingAnimal` interface.

## Dependency Inversion Principle (DIP)
The Dependency Inversion Principle states that high-level modules should not depend on low-level modules; both should depend on abstractions. It encourages loose coupling between modules and promotes the use of interfaces or abstractions to decouple code. Consider this example:

Suppose we have a `ReportGenerator` class that directly depends on a `DatabaseConnection` class to retrieve data. This tightly couples the `ReportGenerator` with the `DatabaseConnection` implementation. Instead, we can introduce an interface, say `Database`, that both the `ReportGenerator` and `DatabaseConnection` depend on. By using dependency injection, we can pass the appropriate implementation of `Database` to the `ReportGenerator`. This way, the `ReportGenerator` depends on an abstraction, adhering to the DIP.

```python
class Database:
    def retrieve_data(self):
        pass

class DatabaseConnection(Database):
    def retrieve_data(self):
        print("Data retrieved from the database.")

class ReportGenerator:
    def __init__(self, database):
        self.database = database

    def generate_report(self):
        data = self.database.retrieve_data()
        print(f"Generating report with data: {data}")

db_connection = DatabaseConnection()
report_generator = ReportGenerator(db_connection)
report_generator.generate_report()
```

In the above example, the `ReportGenerator` class depends on the `Database` abstraction instead of directly depending on the `DatabaseConnection` class. The `DatabaseConnection` class implements the `Database` abstraction and is injected into the `ReportGenerator` class.

# Conclusion
In this article, we covered the SOLID principles of object-oriented design. These principles are guidelines that can help us write better code. By adhering to these principles, we can write code that is easier to maintain, extend, and test.

The principles provide a solid foundation for building robust and flexible software systems, regardless of their size or complexity. Applying these principles can lead to code that is more modular, testable, and resistant to change, ultimately resulting in higher-quality software.



