# Phase 5: How JavaScript Actually Works 🧬

> **Goal**: Stop being a syntax writer and master JavaScript runtime internals. Understand Execution Contexts, the Scope Chain, Hoisting, the Temporal Dead Zone, Closures, and the complete 4-rule algorithm of `this` binding.

---

## Table of Contents
1. [The Execution Context & The Call Stack](#the-execution-context--the-call-stack)
   - [The Two Phases: Creation vs Execution](#the-two-phases-creation-vs-execution)
2. [Module 9: Scope & The Scope Chain](#module-9-scope--the-scope-chain)
   - [9.1 Global, Function, and Block Scope](#91-global-function-and-block-scope)
   - [9.2 Lexical (Static) Scoping](#92-lexical-static-scoping)
   - [9.3 The Scope Chain & Identifier Resolution](#93-the-scope-chain--identifier-resolution)
3. [Module 10: Hoisting & The Temporal Dead Zone](#module-10-hoisting--the-temporal-dead-zone)
   - [10.1 Variable Hoisting Mechanics](#101-variable-hoisting-mechanics)
   - [10.2 Function Hoisting vs Class Hoisting](#102-function-hoisting-vs-class-hoisting)
   - [10.3 The Temporal Dead Zone (TDZ) Explained Internally](#103-the-temporal-dead-zone-tdz-explained-internally)
4. [Module 11: Closures 🔥](#module-11-closures-)
   - [11.1 What is a Closure?](#111-what-is-a-closure)
   - [11.2 Memory & The `[[Scopes]]` Internal Slot](#112-memory--the-scopes-internal-slot)
   - [11.3 Real-World Enterprise Use Cases](#113-real-world-enterprise-use-cases)
5. [Module 12: The `this` Keyword Masterclass](#module-12-the-this-keyword-masterclass)
   - [12.1 What is `this`?](#121-what-is-this)
   - [12.2 The 4 Binding Rules of `this`](#122-the-4-binding-rules-of-this)
   - [12.3 Explicit Binding: `call()`, `apply()`, and `bind()`](#123-explicit-binding-call-apply-and-bind)
   - [12.4 Arrow Functions and Lexical `this`](#124-arrow-functions-and-lexical-this)
   - [12.5 The Order of Precedence](#125-the-order-of-precedence)
6. [Common Pitfalls & Interview Traps](#common-pitfalls--interview-traps)
7. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# The Execution Context & The Call Stack

Whenever JavaScript executes code, it does so inside an **Execution Context (EC)**. Think of an Execution Context as an environment or container holding information about the code currently running.

There are three types:
1. **Global Execution Context (GEC)**: Created when your script loads. There is only ever ONE GEC.
2. **Function Execution Context (FEC)**: Created every single time a function is invoked.
3. **Eval Execution Context**: Created when code runs inside `eval()` (rare and avoided).

### The Two Phases: Creation vs Execution
Every Execution Context is created in two distinct phases:

```
[ EXECUTION CONTEXT LIFECYCLE ]
       │
       ├─► Phase 1: Creation Phase (Compile / Setup)
       │    ├── 1. Creates the Variable Environment & Lexical Environment
       │    ├── 2. Scans for function declarations (registers entire definition)
       │    ├── 3. Scans for 'var' (registers identifier and initializes to 'undefined')
       │    ├── 4. Scans for 'let' & 'const' (registers identifier, leaves UNINITIALIZED in TDZ)
       │    ├── 5. Determines outer Scope Chain reference (outer Lexical Environment)
       │    └── 6. Binds 'this' context
       │
       └─► Phase 2: Execution Phase (Runtime)
            └── Executes code line-by-line, assigning values and running functions.
```

---

# Module 9: Scope & The Scope Chain

### 9.1 Global, Function, and Block Scope
**Scope** is the current context of execution that dictates where variables and functions can be accessed:

- **Global Scope**: Any variable declared outside of all functions or blocks. Accessible anywhere.
- **Function Scope**: Created inside a `function`. Variables declared with `var`, `let`, or `const` inside are private to that function.
- **Block Scope**: Introduced in ES6. Any code between curly braces `{ ... }` (in `if`, `for`, `while`, or standalone `{}`) forms a block. Variables declared with `let` and `const` are strictly trapped within this block!

```javascript
{
  var leaked = "I am everywhere";
  let trapped = "I cannot escape";
}
console.log(leaked);  // "I am everywhere"
// console.log(trapped); // ReferenceError: trapped is not defined
```

---

### 9.2 Lexical (Static) Scoping
JavaScript employs **Lexical Scoping** (also called Static Scoping). 

> **Rule of Lexical Scoping**: The scope of a variable or function is determined **statically by where it is written in the physical source code**, NOT by where or how it is called!

```javascript
const user = "Global Alice";

function printUser() {
  console.log(user); // Resolves lexically to the outer Global scope!
}

function caller() {
  const user = "Local Bob";
  printUser(); // What does this print?
}

caller(); // Logs: "Global Alice" (NOT "Local Bob"!)
```

---

### 9.3 The Scope Chain & Identifier Resolution
When the engine encounters a variable identifier, it executes an upward search algorithm:
1. Inspects the **current local Lexical Environment**.
2. If found, returns value.
3. If not found, follows the `outer` environment pointer to the parent Lexical Environment.
4. Repeats until reaching the **Global Lexical Environment**.
5. If still not found, throws a `ReferenceError: <variable> is not defined`.

```
[ Local Scope (inner) ]  ──outer──►  [ Parent Scope (outer) ]  ──outer──►  [ Global Scope ]
        ▲                                                                        ▲
        │                                                                        │
Identifier Lookup Starts Here ────────────────────────────────────────── Stops Here (or Error)
```

---

# Module 10: Hoisting & The Temporal Dead Zone

### 10.1 Variable Hoisting Mechanics
Hoisting is a colloquial term describing how the engine reserves space for declarations during the **Creation Phase** before running the **Execution Phase**.

```javascript
console.log(a); // undefined (var is hoisted and initialized to undefined)
var a = 10;
console.log(a); // 10
```

Under the hood during Phase 1:
- The engine encounters `var a = 10;`. It registers `a` in the environment record and initializes it to `undefined`.
- In Phase 2, line 1 reads `a` (which is `undefined`). Line 2 assigns `10` to `a`.

---

### 10.2 Function Hoisting vs Class Hoisting
- **Function Declarations are fully hoisted**: Both identifier and body are available immediately.
- **Function Expressions are not hoisted as functions**:
  ```javascript
  greet(); // "Hello!"
  function greet() { return "Hello!"; }

  // farewell(); // TypeError: farewell is not a function (if var), or ReferenceError (if let/const)
  var farewell = function() { return "Bye!"; };
  ```
- **Classes are NOT hoisted**: Even though class declarations look like function declarations, they are hoisted into the TDZ and throw a `ReferenceError` if accessed before declaration.

---

### 10.3 The Temporal Dead Zone (TDZ) Explained Internally
Variables declared with `let` and `const` enter the **TDZ** from the start of the enclosing lexical block until the interpreter evaluates the declaration line.

```javascript
function tdzInspection() {
  // TDZ for 'secret' starts here!
  // typeof secret; // ⚠️ Even typeof throws ReferenceError inside TDZ!
  
  const greeting = "Hello";
  console.log(greeting);
  
  let secret = 42; // TDZ for 'secret' ENDS here.
  console.log(secret); // 42
}
```

---

# Module 11: Closures 🔥

### 11.1 What is a Closure?
> **Definition**: A **Closure** is the combination of a function bundled together (enclosed) with references to its surrounding state (the **Lexical Environment**). In JavaScript, every function retains access to the variables of the scope where it was created, **even after the outer function has finished executing and returned from the Call Stack!**

```javascript
function createCounter() {
  let count = 0; // Private state variable

  return function() {
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2

// Notice: createCounter() has long finished executing!
// The stack frame is gone, yet counter1 still has access to 'count'!
```

---

### 11.2 Memory & The `[[Scopes]]` Internal Slot
How does JavaScript retain access to variables of returned functions without a memory leak?
1. In V8, when a child function is instantiated, it holds a hidden property: `[[Scopes]]`.
2. The engine analyzes which outer variables the child function actually closes over.
3. It moves those closed-over variables from the stack to an allocated **Closure Object on the Memory Heap**.
4. As long as `counter1` exists, that heap closure object is retained by the Garbage Collector.

---

### 11.3 Real-World Enterprise Use Cases

#### 1. Data Privacy & Encapsulation (Module Pattern):
```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Completely private!

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit amount must be positive");
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance);       // undefined (Cannot be accessed or manipulated directly!)
```

#### 2. Memoization Cache:
```javascript
function memoize(fn) {
  const cache = new Map(); // Preserved via closure

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key); // Fast cache hit!
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = n => {
  for (let i = 0; i < 1e7; i++) {} // Heavy computation simulation
  return n * n;
};

const fastSquare = memoize(slowSquare);
console.log(fastSquare(10)); // Computes and caches
console.log(fastSquare(10)); // Instant cache retrieval!
```

---

# Module 12: The `this` Keyword Masterclass

### 12.1 What is `this`?
The `this` keyword is **not** an author-time reference to the function itself, nor is it a reference to the function's lexical scope. 

> **Core Principle**: `this` is a runtime binding determined entirely by **how and where a function is called (the call-site)**.

---

### 12.2 The 4 Binding Rules of `this`

To determine what `this` refers to, find the call-site and apply these 4 rules in order:

#### Rule 1: Default Binding (Standalone Function Invocation)
When a function is called standalone without any context object:
- In **Non-Strict Mode**: `this` defaults to the Global Object (`window` in browsers, `global` in Node).
- In **Strict Mode (`"use strict"`)**: `this` is `undefined`.

```javascript
function showThis() {
  console.log(this);
}
showThis(); // window (or global), or undefined in strict mode
```

#### Rule 2: Implicit Binding (Object Method Invocation)
When a function is called with a context object (preceded by a dot):

```javascript
const person = {
  name: "Sarah",
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

person.greet(); // 'this' points to 'person' -> "Hello, my name is Sarah"
```

**Pitfall: Losing Implicit Binding**:
```javascript
const fn = person.greet;
fn(); // Default binding applies! -> "Hello, my name is undefined"
```

#### Rule 3: Explicit Binding (`call`, `apply`, `bind`)
Directly specifies the `this` target:

```javascript
function introduce(role, location) {
  console.log(`${this.name} is a ${role} based in ${location}`);
}

const user = { name: "David" };

// 1. call(thisArg, arg1, arg2, ...): Invokes immediately
introduce.call(user, "Software Architect", "Berlin");

// 2. apply(thisArg, [argsArray]): Invokes immediately with arguments as an array
introduce.apply(user, ["Software Architect", "Berlin"]);

// 3. bind(thisArg, arg1, ...): Returns a NEW hard-bound function
const boundIntroduce = introduce.bind(user, "Software Architect");
boundIntroduce("Berlin");
```

#### Rule 4: `new` Binding (Constructor Invocation)
When a function is invoked with the `new` operator:
1. A brand new empty object is created in memory: `{}`.
2. The new object is linked to the function's `prototype`.
3. The new object is bound as the `this` for the function execution.
4. Unless the function explicitly returns its own object, `this` is returned automatically.

```javascript
function Car(model) {
  this.model = model;
}

const myCar = new Car("Tesla Model 3");
console.log(myCar.model); // "Tesla Model 3"
```

---

### 12.3 Arrow Functions and Lexical `this`
Arrow functions **do not have their own `this` binding**! They inherit `this` lexically from their enclosing parent scope, exactly like a normal variable:

```javascript
const timer = {
  seconds: 0,
  start() {
    // Arrow function captures 'this' from start()'s implicit binding (the timer object):
    setTimeout(() => {
      this.seconds += 1;
      console.log(`Seconds elapsed: ${this.seconds}`);
    }, 100);
  }
};
timer.start(); // Logs: "Seconds elapsed: 1"
```

> [!IMPORTANT]
> `call()`, `apply()`, and `bind()` have **zero effect** on arrow functions. Their `this` cannot be altered.

---

### 12.4 The Order of Precedence
When multiple rules could apply, evaluate in this strict order:
1. **Was the function called with `new`?** If so, `this` is the newly constructed object.
2. **Was the function called with `call`, `apply`, or `bind`?** If so, `this` is the explicitly specified object.
3. **Was the function called with a context object (`obj.method()`)?** If so, `this` is that context object.
4. **Otherwise**: Default binding (`undefined` in strict mode, global object in non-strict mode).
*(Arrow functions bypass this algorithm entirely by resolving lexically).*

---

# Hands-On Practice Challenges & Solutions

### Challenge 1: The Infamous Loop Closure Problem
**Task**: Explain the bug below and fix it in two different ways (without changing the `setTimeout` delay):

```javascript
for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log("Value:", i);
  }, 100);
}
// Bug: Logs "Value: 4" three times!
```

<details>
<summary>👉 View Solution</summary>

**Why the bug occurs**: `var` is function-scoped, creating only one shared `i` variable in memory. When the callbacks run 100ms later, the loop has completed and `i = 4`.

**Fix 1: Use `let` (Block Scope per iteration)**:
```javascript
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log("Value:", i), 100);
}
```

**Fix 2: Use an IIFE (Immediately Invoked Function Expression) / Closure**:
```javascript
for (var i = 1; i <= 3; i++) {
  (function(lockedIndex) {
    setTimeout(() => console.log("Value:", lockedIndex), 100);
  })(i);
}
```
</details>

---

### Challenge 2: Implement a Polyfill for `Function.prototype.myBind`
**Task**: Write your own implementation of `bind()` called `myBind` on `Function.prototype` that supports:
- Setting the custom `this` context
- Currying / partial arguments application
- Support for calling with `new`

<details>
<summary>👉 View Solution</summary>

```javascript
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const originalFunction = this;

  if (typeof originalFunction !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  function boundFunction(...callArgs) {
    // If called with 'new', 'this' should be the newly created instance:
    const isNew = this instanceof boundFunction;
    const context = isNew ? this : thisArg;
    return originalFunction.apply(context, [...boundArgs, ...callArgs]);
  }

  // Preserve prototype chain for 'new' operator:
  if (originalFunction.prototype) {
    boundFunction.prototype = Object.create(originalFunction.prototype);
  }

  return boundFunction;
};

// Verification:
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: "Elena" };
const sayHiToElena = greet.myBind(user, "Hi");
console.log(sayHiToElena("!")); // "Hi, Elena!"
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 6: Object-Oriented JavaScript 🏗️](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/06-object-oriented-javascript.md)** to master Prototypes, Prototype Chains, Inheritance, ES6 Classes, `super`, Encapsulation with private fields (`#`), and Polymorphism.
