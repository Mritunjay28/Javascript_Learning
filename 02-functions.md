# Phase 2: Functions 🧠

> **Goal**: Master JavaScript functions as first-class citizens, understand the critical differences between declarations, expressions, and arrow functions, and harness the power of Higher-Order Functions and Callbacks.

---

## Table of Contents
1. [Module 5: Functions Deep-Dive](#module-5-functions-deep-dive)
   - [5.1 Functions as First-Class Citizens](#51-functions-as-first-class-citizens)
   - [5.2 Function Declarations vs Function Expressions](#52-function-declarations-vs-function-expressions)
   - [5.3 Arrow Functions (ES6)](#53-arrow-functions-es6)
   - [5.4 Parameters vs Arguments](#54-parameters-vs-arguments)
   - [5.5 The `arguments` Object vs Rest Parameters](#55-the-arguments-object-vs-rest-parameters)
   - [5.6 Default Parameters & Parameter TDZ](#56-default-parameters--parameter-tdz)
   - [5.7 Return Values & Early Return Pattern](#57-return-values--early-return-pattern)
   - [5.8 Callback Functions](#58-callback-functions)
   - [5.9 Higher-Order Functions (HOFs)](#59-higher-order-functions-hofs)
2. [Functions Under the Hood: The Function Object](#functions-under-the-hood-the-function-object)
3. [Common Pitfalls & Traps](#common-pitfalls--traps)
4. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 5: Functions Deep-Dive

### 5.1 Functions as First-Class Citizens
In JavaScript, functions are **First-Class Citizens** (or first-class objects). This means functions are treated like any other value:
1. **Can be assigned to variables, object properties, or array elements.**
2. **Can be passed as arguments to other functions.**
3. **Can be returned as values from other functions.**
4. **Can have properties and methods attached to them.**

```javascript
// 1. Assigned to a variable:
const greet = function(name) { return `Hello, ${name}!`; };

// 2. Passed as an argument:
function runOperation(fn, val) {
  return fn(val);
}
console.log(runOperation(greet, "Alice")); // "Hello, Alice!"

// 3. Returned from another function:
function createMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}
const double = createMultiplier(2);
console.log(double(5)); // 10

// 4. Assigned properties:
greet.description = "A standard greeting utility";
console.log(greet.description); // "A standard greeting utility"
```

---

### 5.2 Function Declarations vs Function Expressions

There are two primary ways to define standard functions in JavaScript:

```javascript
// Function Declaration
function add(a, b) {
  return a + b;
}

// Function Expression
const subtract = function(a, b) {
  return a - b;
};
```

#### The Critical Distinction: Hoisting
- **Function Declarations are completely hoisted**: The engine moves both the function identifier and its entire body to the top of the enclosing scope during the compilation phase. You can call a function declaration **before** it appears in the code.
- **Function Expressions are NOT hoisted as functions**: The variable declaration (`var`, `let`, or `const`) is hoisted, but the function definition assignment happens at runtime when execution reaches that line.

```javascript
// ✅ Works! Function declaration is fully hoisted:
console.log(sayHi()); // "Hi!"
function sayHi() {
  return "Hi!";
}

// ❌ Throws ReferenceError: Cannot access 'sayBye' before initialization
// console.log(sayBye());
const sayBye = function() {
  return "Bye!";
};

// ❌ If declared with 'var', throws TypeError: sayHey is not a function
// (Because 'var' is hoisted as undefined, so undefined() causes TypeError!)
// console.log(sayHey());
var sayHey = function() {
  return "Hey!";
};
```

#### Anonymous vs Named Function Expressions
Function expressions can be named. Named function expressions are superior for debugging because the name appears in call stack error traces:

```javascript
// Anonymous function expression:
const doMath = function(n) {
  if (n <= 1) return 1;
  return n * doMath(n - 1);
};

// Named function expression:
const factorial = function fact(n) {
  if (n <= 1) return 1;
  // 'fact' is scoped ONLY inside the function body itself:
  return n * fact(n - 1);
};
console.log(factorial(5)); // 120
// console.log(fact(5)); // ReferenceError: fact is not defined outside
```

---

### 5.3 Arrow Functions (ES6)

Introduced in ECMAScript 2015 (ES6), arrow functions provide a concise syntax and unique lexical behavior.

#### Syntax Variations:
```javascript
// 1. Multiple parameters:
const multiply = (x, y) => x * y;

// 2. Single parameter (parentheses are optional):
const square = x => x * x;

// 3. No parameters (parentheses required):
const getRandom = () => Math.random();

// 4. Multi-line body (requires explicit return and braces):
const calculateTotal = (price, tax) => {
  const total = price + (price * tax);
  return total;
};

// 5. Returning an Object Literal (MUST wrap object in parentheses):
// Without parentheses, JS interprets { ... } as a function body block!
const makeUser = (name, age) => ({ name, age });
console.log(makeUser("Alice", 28)); // { name: 'Alice', age: 28 }
```

#### Architectural Differences Between Arrow Functions and Regular Functions

| Feature | Regular Function | Arrow Function |
| :--- | :--- | :--- |
| **`this` Binding** | Dynamic (determined by *how* the function is called) | **Lexical** (inherited from outer enclosing scope) |
| **`arguments` Object** | Available | **Not available** (ReferenceError in modules/strict mode) |
| **Constructible (`new`)** | Yes (`new MyFunc()`) | **No** (Throws `TypeError: ... is not a constructor`) |
| **`prototype` Property** | Has `.prototype` | **Does not have** `.prototype` |
| **Duplicate Parameters** | Allowed in non-strict mode | **Always a SyntaxError** |

```javascript
// Example: Arrow functions cannot be constructors
const User = (name) => {
  this.name = name;
};
// const user1 = new User("Bob"); // TypeError: User is not a constructor
```

---

### 5.4 Parameters vs Arguments
- **Parameters**: The variable names declared in the function signature definition.
- **Arguments**: The actual data values passed to the function when invoking it.

```javascript
//           parameters: [a, b]
function calculateArea(width, height) {
  return width * height;
}

//             arguments: (20, 50)
calculateArea(20, 50);
```

In JavaScript:
- Passing **fewer arguments** than declared parameters assigns `undefined` to missing parameters.
- Passing **more arguments** than declared parameters does not throw an error; extra arguments are simply ignored (unless accessed via rest parameters or `arguments`).

```javascript
function demoParams(a, b) {
  console.log(`a: ${a}, b: ${b}`);
}
demoParams(1);       // "a: 1, b: undefined"
demoParams(1, 2, 3); // "a: 1, b: 2" (3 is ignored)
```

---

### 5.5 The `arguments` Object vs Rest Parameters

#### The Legacy `arguments` Object
In regular functions, `arguments` is an **Array-like object** containing all arguments passed to the function.

```javascript
function sumAll() {
  console.log(arguments); // [Arguments] { '0': 1, '1': 2, '2': 3 }
  console.log(arguments.length); // 3
  
  // ⚠️ arguments is NOT an Array!
  // arguments.map(x => x * 2); // TypeError: arguments.map is not a function
  
  // Must convert to real array first:
  const argsArray = Array.from(arguments);
  return argsArray.reduce((acc, curr) => acc + curr, 0);
}
console.log(sumAll(1, 2, 3, 4)); // 10
```

#### Modern Rest Parameters (`...rest`)
Rest parameters (ES6) represent an indefinite number of arguments as a **genuine, standard Array**:

```javascript
// Rest parameter must ALWAYS be the last parameter!
function modernSum(multiplier, ...numbers) {
  // 'numbers' is a real JavaScript Array:
  return numbers.map(n => n * multiplier);
}
console.log(modernSum(10, 1, 2, 3)); // [ 10, 20, 30 ]
```

**Why Rest Parameters are superior:**
1. Work in both regular functions and arrow functions.
2. Produce a real `Array` with full access to `.map()`, `.filter()`, `.reduce()`.
3. Allow separating specific named parameters from the variable rest values.

---

### 5.6 Default Parameters & Parameter TDZ

ES6 default parameters allow initializing parameters with default values if no value or `undefined` is passed:

```javascript
function greetUser(name = "Guest", role = "Viewer") {
  return `User: ${name}, Role: ${role}`;
}

console.log(greetUser());                   // "User: Guest, Role: Viewer"
console.log(greetUser("Alice"));            // "User: Alice, Role: Viewer"
console.log(greetUser("Bob", undefined));   // "User: Bob, Role: Viewer" (undefined triggers default)
console.log(greetUser("Charlie", null));    // "User: Charlie, Role: null" (null does NOT trigger default!)
```

#### Default Parameters are Evaluated at Call Time:
Defaults are evaluated dynamically when the function is invoked, not when it is defined:

```javascript
let counter = 0;
function getUniqueId() {
  return ++counter;
}

function createUser(name, id = getUniqueId()) {
  return { name, id };
}

console.log(createUser("Alice")); // { name: 'Alice', id: 1 }
console.log(createUser("Bob"));   // { name: 'Bob', id: 2 }
```

#### The Parameter Scope & Temporal Dead Zone (TDZ):
Parameters have their own scope initialized from left to right. A parameter on the right can reference parameters on its left, but referencing a parameter to its right throws a `ReferenceError`!

```javascript
// ✅ Right parameter references left parameter:
function createRectangle(width, height = width * 2) {
  return { width, height };
}
console.log(createRectangle(10)); // { width: 10, height: 20 }

// ❌ Left parameter tries to reference right parameter (TDZ):
function badFunc(width = height * 2, height = 10) {
  return width + height;
}
// badFunc(); // ReferenceError: Cannot access 'height' before initialization
```

---

### 5.7 Return Values & Early Return Pattern

- Every function returns a value. If no `return` statement is specified, or if `return` is called with no expression, the function returns `undefined`.
- The `return` statement halts function execution immediately.

#### The Early Return (Guard Clauses) Pattern
Avoid "arrow-shaped code" with deep nested `if/else` blocks. Handle error and edge conditions at the top of the function and return immediately:

```javascript
// ❌ Poor Practice (Nested Pyramid of Doom):
function processOrder(order) {
  if (order) {
    if (order.items && order.items.length > 0) {
      if (order.isPaid) {
        return "Shipping order!";
      } else {
        return "Payment required.";
      }
    } else {
      return "Order has no items.";
    }
  } else {
    return "Invalid order.";
  }
}

// ✅ Clean Practice (Guard Clauses):
function processOrderClean(order) {
  if (!order) return "Invalid order.";
  if (!order.items || order.items.length === 0) return "Order has no items.";
  if (!order.isPaid) return "Payment required.";

  // Core business logic runs cleanly at base indent:
  return "Shipping order!";
}
```

---

### 5.8 Callback Functions

A **Callback** is a function passed as an argument to another function, intended to be executed ("called back") at a designated time.

#### 1. Synchronous Callbacks:
Executed immediately during the execution of the higher-order function:

```javascript
const numbers = [1, 2, 3, 4, 5];

// The arrow function passed to forEach is a synchronous callback:
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});
```

#### 2. Asynchronous Callbacks:
Executed at a later point in time after an asynchronous operation or event completes:

```javascript
console.log("Start");

// setTimeout callback is asynchronous:
setTimeout(() => {
  console.log("Timer elapsed (200ms)");
}, 200);

console.log("End");

// Output:
// Start
// End
// Timer elapsed (200ms)
```

---

### 5.9 Higher-Order Functions (HOFs)

A **Higher-Order Function** is a function that does at least one of the following:
1. **Accepts one or more functions as arguments.**
2. **Returns a function as its result.**

HOFs form the bedrock of Functional Programming in JavaScript.

#### Example 1: Function Accepting Functions (Custom Filter)
```javascript
function filterArray(arr, predicateFn) {
  const result = [];
  for (const item of arr) {
    if (predicateFn(item)) {
      result.push(item);
    }
  }
  return result;
}

const scores = [45, 82, 91, 33, 76];
const passingScores = filterArray(scores, score => score >= 75);
console.log(passingScores); // [ 82, 91, 76 ]
```

#### Example 2: Function Returning Functions (Function Factories)
```javascript
function createValidator(minLength, maxLength) {
  return function(text) {
    if (typeof text !== "string") return false;
    return text.length >= minLength && text.length <= maxLength;
  };
}

const isValidUsername = createValidator(3, 12);
console.log(isValidUsername("dev"));        // true
console.log(isValidUsername("jo"));         // false (too short)
console.log(isValidUsername("superlongusername123")); // false (too long)
```

#### Example 3: Function Composition (`pipe`)
HOFs allow building complex pipelines from small, pure, reusable functions:

```javascript
const trim = str => str.trim();
const toLower = str => str.toLowerCase();
const wrapInTag = tag => str => `<${tag}>${str}</${tag}>`;

// Higher-order pipe function:
const pipe = (...fns) => initialVal => fns.reduce((val, fn) => fn(val), initialVal);

const formatSlug = pipe(
  trim,
  toLower,
  wrapInTag("span")
);

console.log(formatSlug("   JavaScript Mastery   ")); 
// Output: "<span>javascript mastery</span>"
```

---

# Functions Under the Hood: The Function Object

In JavaScript, functions are specialized objects with hidden internal slots:
- `[[Call]]`: Internal method invoked when executing `fn()`.
- `[[Construct]]`: Internal method invoked when executing `new fn()`. (Arrow functions lack `[[Construct]]`).
- `[[Scope]]`: Internal slot holding a reference to the Lexical Environment where the function was born.

Built-in Properties on Functions:
```javascript
function greet(a, b, c = 10) {}

console.log(greet.name);   // "greet" (The identifier)
console.log(greet.length); // 2 (Number of parameters BEFORE the first default parameter)
```

---

# Common Pitfalls & Traps

### Trap 1: Arrow Function as Object Method
```javascript
const user = {
  name: "Alice",
  age: 30,
  // ⚠️ Arrow function does NOT bind its own 'this'!
  greet: () => {
    return `Hello, I'm ${this.name}`;
  },
  // ✅ Regular method shorthand binds 'this' to the user object:
  sayHello() {
    return `Hello, I'm ${this.name}`;
  }
};

console.log(user.greet());    // "Hello, I'm undefined" ❌
console.log(user.sayHello()); // "Hello, I'm Alice"     ✅
```

### Trap 2: Returning Object Literals in Arrow Functions
```javascript
// ❌ JS interprets {} as function block, not object! Returns undefined.
const getUserWrong = (name) => { name: name };
console.log(getUserWrong("Bob")); // undefined

// ✅ Wrap the object in parentheses:
const getUserRight = (name) => ({ name: name });
console.log(getUserRight("Bob")); // { name: 'Bob' }
```

### Trap 3: Accidental Mutation of Default Objects
```javascript
// ⚠️ Passing an object as default parameter shares default reference if modified incorrectly:
function addTag(item, tag, metadata = { tags: [] }) {
  metadata.tags.push(tag);
  return { item, metadata };
}

const item1 = addTag("Laptop", "tech");
const item2 = addTag("Chair", "furniture");

// Notice how item2 includes 'tech' because the default object was mutated!
console.log(item2.metadata.tags); // [ 'tech', 'furniture' ] ❌
```
**Fix**: Provide fresh instances or use immutable copy techniques:
```javascript
function addTagSafe(item, tag, metadata) {
  const meta = metadata ?? { tags: [] };
  return { item, metadata: { ...meta, tags: [...meta.tags, tag] } };
}
```

---

# Hands-On Practice Challenges & Solutions

### Challenge 1: The Once Function (HOF)
**Task**: Write a higher-order function `once(fn)` that ensures a given function can only be executed **once**. Subsequent calls should return the result of the first invocation without executing `fn` again.

```javascript
// Expected behavior:
let callCount = 0;
const pay = once((amount) => {
  callCount++;
  return `Paid $${amount}`;
});

console.log(pay(100)); // "Paid $100"
console.log(pay(500)); // "Paid $100" (does not execute again)
console.log(callCount); // 1
```

<details>
<summary>👉 View Solution</summary>

```javascript
function once(fn) {
  let hasRun = false;
  let cachedResult;

  return function(...args) {
    if (!hasRun) {
      cachedResult = fn.apply(this, args);
      hasRun = true;
    }
    return cachedResult;
  };
}

// Verification:
let callCount = 0;
const pay = once((amount) => {
  callCount++;
  return `Paid $${amount}`;
});

console.log(pay(100)); // "Paid $100"
console.log(pay(500)); // "Paid $100"
console.log(callCount);// 1
```
</details>

---

### Challenge 2: Custom Generic Reducer HOF
**Task**: Build your own version of array reduction called `myReduce(array, callback, initialValue)` without using the native `Array.prototype.reduce`.
- If `initialValue` is omitted, use the first element of the array as the accumulator and start iterating from index 1.
- Throw a `TypeError` if an empty array is passed without an `initialValue`.

<details>
<summary>👉 View Solution</summary>

```javascript
function myReduce(array, callback, initialValue) {
  if (array.length === 0 && initialValue === undefined) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator = initialValue !== undefined ? initialValue : array[0];
  const startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }

  return accumulator;
}

// Verification:
const numbers = [1, 2, 3, 4, 5];
const sum = myReduce(numbers, (acc, n) => acc + n, 0);
console.log(sum); // 15

const product = myReduce(numbers, (acc, n) => acc * n);
console.log(product); // 120
```
</details>

---

### Challenge 3: Function Curry Utility (Advanced HOF)
**Task**: Write a `curry(fn)` function that takes a normal multi-argument function and converts it into a curried function that continues returning a function until all required arguments (`fn.length`) have been supplied.

```javascript
function sum3(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum3);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
```

<details>
<summary>👉 View Solution</summary>

```javascript
function curry(fn) {
  return function curried(...args) {
    // If enough arguments have been supplied, execute the original function:
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // Otherwise, return a new function that gathers more arguments:
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// Verification:
function sum3(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum3);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 3: Data Structures 🔥](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/03-data-structures.md)** to master Arrays (mutating vs non-mutating methods, functional iterations), Objects, Maps, Sets, and structural memory layout.
