# Phase 6: Object-Oriented JavaScript 🏗️

> **Goal**: Demystify JavaScript's prototype-based inheritance model, master ES6 Class architecture, private fields (`#`), `super`, Polymorphism, and clean object-oriented design.

---

## Table of Contents
1. [Module 13: Prototypes & The Prototype Chain](#module-13-prototypes--the-prototype-chain)
   - [13.1 `[[Prototype]]` vs `.prototype` vs `__proto__`](#131-prototype-vs-prototype-vs-__proto__)
   - [13.2 The Prototype Lookup Algorithm](#132-the-prototype-lookup-algorithm)
   - [13.3 Constructor Functions & Prototypal Inheritance](#133-constructor-functions--prototypal-inheritance)
   - [13.4 `Object.create()` & Pure Prototypal Systems](#134-objectcreate--pure-prototypal-systems)
2. [Module 14: ES6 Classes](#module-14-es6-classes)
   - [14.1 Class Declarations & Expressions](#141-class-declarations--expressions)
   - [14.2 The `constructor` Method](#142-the-constructor-method)
   - [14.3 Instance vs Prototype vs Static Methods](#143-instance-vs-prototype-vs-static-methods)
   - [14.4 Inheritance with `extends` and `super`](#144-inheritance-with-extends-and-super)
   - [14.5 Encapsulation: Private Fields (`#`) and Private Methods](#145-encapsulation-private-fields---and-private-methods)
   - [14.6 Polymorphism & Method Overriding](#146-polymorphism--method-overriding)
3. [Common Pitfalls & Traps](#common-pitfalls--traps)
4. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 13: Prototypes & The Prototype Chain

### 13.1 `[[Prototype]]` vs `.prototype` vs `__proto__`
This is one of the most confused distinctions in JavaScript:

1. **`[[Prototype]]`**: An internal, hidden slot on every JavaScript object that points to its prototype object (or `null`).
2. **`__proto__`**: A legacy historical accessor property (getter/setter) on `Object.prototype` that exposes the internal `[[Prototype]]`. Modern standard prefers `Object.getPrototypeOf(obj)`.
3. **`Function.prototype`**: A regular object property found **only on functions** (except arrow functions). When that function is used as a constructor with `new`, the newly created object's `[[Prototype]]` is set to point to that function's `.prototype`.

```
Constructor Function (e.g. User)
+------------------------------------+
| prototype: 0x112233                |
+-----------------│------------------+
                  ▼
         Prototype Object (0x112233)
         +---------------------------+
         | greet()                   |
         | constructor: User         |
         +---------------------------+
                  ▲
                  │ [[Prototype]]
Instance Object (e.g. user1 = new User("Alice"))
+------------------------------------+
| name: "Alice"                      |
| [[Prototype]] ─────────────────────┘
+------------------------------------+
```

---

### 13.2 The Prototype Lookup Algorithm
When accessing a property `obj.prop`:
1. The engine checks if the property exists directly on `obj` (an "own" property).
2. If not found, it checks `obj`'s prototype: `Object.getPrototypeOf(obj)`.
3. If not found, it checks *that* object's prototype.
4. This continues up the **Prototype Chain** until reaching `Object.prototype`.
5. The prototype of `Object.prototype` is `null`. If still not found, returns `undefined`.

```javascript
const animal = {
  eats: true,
  walk() { return "Animal walking"; }
};

const rabbit = Object.create(animal); // rabbit.[[Prototype]] is animal
rabbit.jumps = true;

console.log(rabbit.jumps); // true (Own property)
console.log(rabbit.eats);  // true (Found on animal prototype!)
console.log(rabbit.walk()); // "Animal walking" (Found on animal prototype!)
console.log(rabbit.flying); // undefined (Traversed to Object.prototype -> null)
```

---

### 13.3 Constructor Functions & Prototypal Inheritance
Before ES6 classes, constructor functions were the standard way to create reusable blueprints:

```javascript
function Person(name, birthYear) {
  // Instance-specific own properties:
  this.name = name;
  this.birthYear = birthYear;
}

// Methods are attached to .prototype so ALL instances share ONE copy in memory:
Person.prototype.calculateAge = function() {
  return 2026 - this.birthYear;
};

const john = new Person("John", 1995);
console.log(john.calculateAge()); // 31
console.log(john.hasOwnProperty("name"));         // true
console.log(john.hasOwnProperty("calculateAge")); // false (Shared via prototype!)
```

---

# Module 14: ES6 Classes

ES6 Classes are syntactically cleaner abstractions over JavaScript's prototypal inheritance model. Under the hood, they still use prototypes, but eliminate verbose prototype boilerplate.

### 14.1 Class Declarations
```javascript
class User {
  // Class body is always executed in strict mode ("use strict")!
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // Method defined on User.prototype:
  displayProfile() {
    return `${this.name} (${this.email})`;
  }
}

const user = new User("Maya", "maya@example.com");
console.log(user.displayProfile()); // "Maya (maya@example.com)"
console.log(typeof User); // "function" (Classes are functions under the hood!)
```

---

### 14.2 Instance vs Prototype vs Static Methods

```javascript
class Article {
  // 1. Static Property (Exists on the Class itself, NOT on instances):
  static category = "Engineering";

  // 2. Instance Field (Created uniquely on each instantiated object):
  createdAt = new Date();

  constructor(title, author) {
    this.title = title;
    this.author = author;
  }

  // 3. Prototype Method (Shared across all instances on Article.prototype):
  getSummary() {
    return `"${this.title}" by ${this.author}`;
  }

  // 4. Static Factory Method (Utility on the Class):
  static createDraft(title) {
    return new Article(title, "Anonymous");
  }
}

const post = new Article("Mastering JS", "Ada Lovelace");
console.log(post.getSummary()); // '"Mastering JS" by Ada Lovelace'

// Static methods called directly on Class:
console.log(Article.category); // "Engineering"
const draft = Article.createDraft("Draft Post");
console.log(draft.author);     // "Anonymous"
```

---

### 14.3 Inheritance with `extends` and `super`

```javascript
// Base / Parent Class
class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  work() {
    return `${this.name} is performing general duties.`;
  }
}

// Derived / Child Class
class Developer extends Employee {
  constructor(name, salary, programmingLanguage) {
    // ⚠️ MUST call super() before accessing 'this'!
    super(name, salary); // Calls parent constructor
    this.programmingLanguage = programmingLanguage;
  }

  // Overriding parent method:
  work() {
    return `${this.name} is coding in ${this.programmingLanguage}.`;
  }

  debugCode() {
    return `${this.name} is resolving a production issue.`;
  }
}

const dev = new Developer("Marcus", 120000, "TypeScript");
console.log(dev.work());       // "Marcus is coding in TypeScript."
console.log(dev.salary);     // 120000 (Inherited from Employee)
console.log(dev instanceof Developer); // true
console.log(dev instanceof Employee);  // true
```

---

### 14.4 Encapsulation: Private Fields (`#`) and Private Methods

Prior to ES2022, JavaScript had no real private class members (developers used the `_name` convention). Modern JavaScript supports **true hard private fields and methods** prefixed with `#`.

```javascript
class BankAccount {
  // Public field:
  accountHolder;

  // Hard private fields (inaccessible outside class):
  #balance;
  #accountNumber;

  constructor(accountHolder, initialBalance) {
    this.accountHolder = accountHolder;
    this.#balance = initialBalance;
    this.#accountNumber = Math.floor(Math.random() * 1e8);
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Invalid deposit");
    this.#balance += amount;
    this.#logTransaction("DEPOSIT", amount);
  }

  // Hard private method:
  #logTransaction(type, amount) {
    console.log(`[LOG] ${type}: $${amount}. New balance: $${this.#balance}`);
  }

  // Getter for safe reading:
  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount("Alice", 1000);
account.deposit(500); // [LOG] DEPOSIT: $500. New balance: $1500
console.log(account.balance); // 1500

// ❌ SyntaxError: Private field '#balance' must be declared in an enclosing class
// console.log(account.#balance);
```

---

### 14.5 Polymorphism
Polymorphism allows different classes to implement the same method interface, enabling client code to interact with them uniformly without knowing the exact concrete subclass.

```javascript
class Shape {
  calculateArea() {
    throw new Error("Method 'calculateArea()' must be implemented.");
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  calculateArea() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  calculateArea() {
    return this.width * this.height;
  }
}

// Polymorphic function:
function printTotalArea(shapes) {
  const total = shapes.reduce((sum, shape) => sum + shape.calculateArea(), 0);
  console.log(`Total Area: ${total.toFixed(2)}`);
}

printTotalArea([new Circle(5), new Rectangle(10, 4)]); // "Total Area: 118.54"
```

---

# Hands-On Practice Challenges & Solutions

### Challenge: EventEmitter Pattern with Classes
**Task**: Build a robust `EventEmitter` class from scratch that supports `.on(event, listener)`, `.emit(event, ...args)`, and `.off(event, listener)`.

<details>
<summary>👉 View Solution</summary>

```javascript
class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }
    this.#events.get(event).push(listener);
    return () => this.off(event, listener); // Returns unsubscribe function
  }

  emit(event, ...args) {
    const listeners = this.#events.get(event);
    if (!listeners || listeners.length === 0) return false;
    for (const listener of [...listeners]) {
      listener(...args);
    }
    return true;
  }

  off(event, listener) {
    const listeners = this.#events.get(event);
    if (!listeners) return;
    this.#events.set(
      event,
      listeners.filter(fn => fn !== listener)
    );
  }
}

// Verification:
const bus = new EventEmitter();
const unsubscribe = bus.on("userLoggedIn", user => {
  console.log(`Welcome, ${user.name}!`);
});

bus.emit("userLoggedIn", { name: "Grace" }); // "Welcome, Grace!"
unsubscribe();
bus.emit("userLoggedIn", { name: "Grace" }); // (No output)
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 7: The Browser & DOM 🌐](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/07-browser-and-dom.md)** to master DOM Tree architecture, element queries, mutation, Event Bubbling, Event Capturing, and Event Delegation.
