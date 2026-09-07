# Phase 1: Core JavaScript 🧱

> **Goal**: Build an unbreakable foundation in JavaScript syntax, runtime mechanics, memory models, operators, and control flow.

---

## Table of Contents
1. [Module 1: Introduction to JavaScript & Engines](#module-1-introduction-to-javascript--engines)
   - [1.1 What is JavaScript?](#11-what-is-javascript)
   - [1.2 How JavaScript Works Under the Hood](#12-how-javascript-works-under-the-hood)
   - [1.3 The JavaScript Engine (V8, SpiderMonkey, JavaScriptCore)](#13-the-javascript-engine-v8-spidermonkey-javascriptcore)
   - [1.4 Browser Runtime vs Node.js Runtime](#14-browser-runtime-vs-nodejs-runtime)
   - [1.5 How to Run JavaScript](#15-how-to-run-javascript)
2. [Module 2: Variables, Data Types & Memory](#module-2-variables-data-types--memory)
   - [2.1 The Concept of Variables](#21-the-concept-of-variables)
   - [2.2 var vs let vs const](#22-var-vs-let-vs-const)
   - [2.3 The Temporal Dead Zone (TDZ)](#23-the-temporal-dead-zone-tdz)
   - [2.4 JavaScript Data Types](#24-javascript-data-types)
   - [2.5 Primitive vs Reference Types (Stack vs Heap)](#25-primitive-vs-reference-types-stack-vs-heap)
   - [2.6 Mutability vs Immutability](#26-mutability-vs-immutability)
3. [Module 3: Operators & Type Coercion](#module-3-operators--type-coercion)
   - [3.1 Arithmetic Operators](#31-arithmetic-operators)
   - [3.2 Assignment Operators (including Logical Assignment)](#32-assignment-operators-including-logical-assignment)
   - [3.3 Comparison Operators & The Equality Algorithm](#33-comparison-operators--the-equality-algorithm)
   - [3.4 `==` vs `===` vs `Object.is()`](#34--vs--vs-objectis)
   - [3.5 Logical Operators & Short-Circuiting](#35-logical-operators--short-circuiting)
   - [3.6 Truthy vs Falsy Values](#36-truthy-vs-falsy-values)
   - [3.7 Nullish Coalescing (`??`) vs Logical OR (`||`)](#37-nullish-coalescing--vs-logical-or-)
4. [Module 4: Control Flow & Iteration](#module-4-control-flow--iteration)
   - [4.1 Conditional Statements (if, else if, else, Ternary)](#41-conditional-statements-if-else-if-else-ternary)
   - [4.2 The switch Statement](#42-the-switch-statement)
   - [4.3 Loops: for, while, do...while](#43-loops-for-while-dowhile)
   - [4.4 Iterating Over Data: for...of vs for...in](#44-iterating-over-data-forof-vs-forin)
   - [4.5 Loop Control: break, continue, and Labeled Statements](#45-loop-control-break-continue-and-labeled-statements)
5. [Common Pitfalls & Interview Traps](#common-pitfalls--interview-traps)
6. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 1: Introduction to JavaScript & Engines

### 1.1 What is JavaScript?
JavaScript is a **high-level, single-threaded, garbage-collected, interpreted (or Just-In-Time compiled), multi-paradigm, prototype-based, dynamic language** with a non-blocking event loop concurrency model.

Let's dissect this definition:
- **High-Level**: You do not manage memory manually (unlike C/C++ with `malloc` and `free`). The engine manages allocation and deallocation automatically.
- **Single-Threaded**: JavaScript executes one instruction at a time on a single Call Stack.
- **Garbage-Collected**: An internal background process (Mark-and-Sweep algorithm) periodically purges unreferenced memory allocations.
- **Multi-Paradigm**: Supports Procedural, Object-Oriented (prototypal), and Functional programming styles.
- **Dynamic**: Types are bound to values, not variables. A variable holding a number can later hold a string.

#### ECMAScript vs JavaScript
- **ECMAScript (ES)** is the official open standard specification maintained by the **TC39 committee** (Ecma International technical committee 39).
- **JavaScript** is the commercial implementation of the ECMAScript standard, augmented with platform-specific APIs (such as DOM APIs in browsers, or File System APIs in Node.js).
- Modern milestones: **ES6 (2015)** was the biggest overhaul. Since then, ECMAScript releases yearly increments (ES2016 through ES2024+).

---

### 1.2 How JavaScript Works Under the Hood
When you pass JavaScript code to an engine, it does not immediately execute line-by-line machine instructions. It undergoes a pipeline:

```
Source Code
    │
    ▼
[ Lexer / Tokenizer ]  ──> Breaks source code into syntactic tokens: keywords, identifiers, symbols
    │
    ▼
[ Parser ]             ──> Validates syntax and generates an Abstract Syntax Tree (AST)
    │
    ▼
[ Interpreter (Ignition) ] ──> Produces unoptimized Bytecode and begins immediate execution
    │
    ▼
[ Profiler / Monitor ] ──> Observes "hot" code (frequently executed functions, consistent types)
    │
    ▼
[ JIT Compiler (TurboFan) ] ──> Compiles hot bytecode into highly-optimized Machine Code
    │
    └──> (If type assumptions fail ➔ "Deoptimization" drops back to Bytecode)
```

1. **Parsing**: The engine converts code into tokens and checks for syntax errors. If valid, it produces an **AST** (a tree representation of the syntactic structure of your program).
2. **Interpretation**: Google's V8 engine uses an interpreter called **Ignition** to convert the AST into bytecode and run it quickly without waiting for compilation.
3. **JIT Compilation (Just-In-Time)**: As the bytecode runs, the **Profiler** tracks functions called frequently ("hot functions") and the types of arguments passed to them.
4. **Optimization**: The optimizing compiler (**TurboFan** in V8) compiles the hot bytecode directly into native machine code. If subsequent runs violate earlier type assumptions (e.g., a function that received numbers suddenly receives a string), TurboFan **deoptimizes** and falls back to Ignition's bytecode.

---

### 1.3 The JavaScript Engine (V8, SpiderMonkey, JavaScriptCore)
Different platforms employ different engines:
- **V8**: Developed by Google. Written in C++. Powers Google Chrome, Chromium browsers (Edge, Brave, Opera), Node.js, and Deno.
- **SpiderMonkey**: Developed by Mozilla. Written in C++ & Rust. Powers Firefox. (First JS engine ever created by Brendan Eich in 1995).
- **JavaScriptCore (Nitro)**: Developed by Apple. Written in C++. Powers Safari and Bun.

---

### 1.4 Browser Runtime vs Node.js Runtime
A **JavaScript Engine** alone only implements the ECMAScript standard (e.g., `Array`, `Object`, `Math`, `Promise`). It has no concept of windows, buttons, or file systems. 

A **Runtime Environment** wraps the engine with platform-specific APIs:

```
+-------------------------------------------------------------+
|                     BROWSER RUNTIME                         |
|  +--------------------+   +-------------------------------+  |
|  |     V8 Engine      |   |           Web APIs            |  |
|  | [Heap] [Call Stack]|   | DOM, fetch, setTimeout,       |  |
|  +--------------------+   | LocalStorage, canvas, audio   |  |
|                           +-------------------------------+  |
|  +--------------------------------------------------------+  |
|  |        Event Loop & Callback / Microtask Queue         |  |
+-------------------------------------------------------------+

+-------------------------------------------------------------+
|                     NODE.JS RUNTIME                         |
|  +--------------------+   +-------------------------------+  |
|  |     V8 Engine      |   |       Node.js C++ APIs        |  |
|  | [Heap] [Call Stack]|   | fs, http, path, crypto, child |  |
|  +--------------------+   +-------------------------------+  |
|  +--------------------------------------------------------+  |
|  |         libuv (Cross-platform I/O & Event Loop)        |  |
+-------------------------------------------------------------+
```

Key Differences:
| Feature | Browser | Node.js |
| :--- | :--- | :--- |
| **Global Object** | `window` | `global` (both support `globalThis`) |
| **DOM Manipulation** | Yes (`document.querySelector`) | No (unless simulated via JSDOM) |
| **File System Access** | Restricted/Sandboxed | Yes (`fs`, `fs/promises`) |
| **Operating System Access** | No | Yes (`os`, `process`) |
| **Module Systems** | ES Modules (`import`/`export`) | CommonJS (`require`) & ES Modules |

---

### 1.5 How to Run JavaScript

#### 1. In the Browser:
- **DevTools Console**: Press `F12` or `Ctrl + Shift + I` in any browser -> Console tab.
- **HTML Script Tag**:
  ```html
  <!-- Standard inline script -->
  <script>
    console.log("Hello from browser!");
  </script>

  <!-- External script (blocking) -->
  <script src="app.js"></script>

  <!-- Async (downloads in background, executes immediately upon download) -->
  <script src="app.js" async></script>

  <!-- Defer (downloads in background, executes only after HTML is parsed - Recommended) -->
  <script src="app.js" defer></script>
  ```

#### 2. In Node.js:
- **Interactive REPL**:
  ```bash
  node
  > const sum = (a, b) => a + b;
  > sum(10, 20);
  30
  ```
- **File Execution**:
  ```bash
  node app.js
  ```

---

# Module 2: Variables, Data Types & Memory

### 2.1 The Concept of Variables
A variable is a symbolic label pointing to an allocated slot in computer memory that holds a value or a memory address.

```javascript
let score = 100;
```
1. The engine reserves memory space.
2. The identifier `score` is bound to that memory space.
3. The binary representation of `100` is stored in that slot.

---

### 2.2 var vs let vs const

Prior to ES6 (2015), `var` was the only way to declare variables. ES6 introduced `let` and `const` to fix scoping hazards.

#### Comparison Matrix
| Characteristic | `var` | `let` | `const` |
| :--- | :--- | :--- | :--- |
| **Scope** | Function or Global | Block (`{ ... }`) | Block (`{ ... }`) |
| **Hoisting** | Hoisted with `undefined` | Hoisted into **TDZ** | Hoisted into **TDZ** |
| **Re-declaration** | Allowed in same scope | SyntaxError | SyntaxError |
| **Re-assignment** | Allowed | Allowed | TypeError |
| **Attached to `window`?** | Yes (in global scope) | No | No |

#### Deep Dive into Scoping:
```javascript
// Function Scope (var)
function testVar() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (var leaks outside if-block!)
}
testVar();

// Block Scope (let & const)
function testLet() {
  if (true) {
    let y = 20;
    const z = 30;
  }
  // console.log(y); // ReferenceError: y is not defined
  // console.log(z); // ReferenceError: z is not defined
}
testLet();
```

---

### 2.3 The Temporal Dead Zone (TDZ)
A common misconception is that `let` and `const` are not hoisted. **They are hoisted**, but unlike `var` (which is initialized with `undefined`), `let` and `const` remain **uninitialized**.

The **Temporal Dead Zone** is the region of code between the entry into a block scope and the line where the variable declaration is evaluated. Accessing the variable in this zone throws a `ReferenceError`.

```javascript
// Example: Demonstrating TDZ
{
  // TDZ for myVar begins here
  // console.log(myVar); // ReferenceError: Cannot access 'myVar' before initialization
  
  let temp = "safe";
  console.log(temp); // "safe"
  
  let myVar = 42; // TDZ for myVar ends here
  console.log(myVar); // 42
}
```

Proof that `let` is hoisted:
```javascript
let x = "global";

function shadowTest() {
  // If 'x' were NOT hoisted, this would log "global".
  // Instead, the local 'x' is hoisted, enters the TDZ, and throws ReferenceError!
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = "local";
}
// shadowTest();
```

---

### 2.4 JavaScript Data Types
JavaScript is dynamically typed. As of the current ECMAScript specification, there are **8 data types**:

#### 7 Primitive Types:
1. **`number`**: Double-precision 64-bit binary format IEEE 754. Represents integers and floats up to $\pm(2^{53} - 1)$. Special values: `NaN`, `Infinity`, `-Infinity`, `-0`.
2. **`string`**: Sequence of 16-bit UTF-16 code units. Immutable.
3. **`boolean`**: Logical entity with two values: `true` and `false`.
4. **`undefined`**: A variable that has been declared but not assigned a value has the value `undefined`.
5. **`null`**: An intentional absence of any object value.
6. **`bigint`**: Arbitrary-precision integer for values larger than $2^{53} - 1$. Created with suffix `n` (e.g., `9007199254740995n`).
7. **`symbol`**: Unique and immutable identifier used primarily as object property keys.

#### 1 Reference Type:
8. **`object`**: Collections of key-value pairs. Arrays, Functions, Dates, RegExps, Maps, and Sets are all specialized objects.

#### Inspecting Types with `typeof`:
```javascript
console.log(typeof 42);             // "number"
console.log(typeof 3.1415);         // "number"
console.log(typeof NaN);            // "number" (Not-a-Number is numeric type!)
console.log(typeof "hello");        // "string"
console.log(typeof true);           // "boolean"
console.log(typeof undefined);      // "undefined"
console.log(typeof Symbol("id"));   // "symbol"
console.log(typeof 100n);           // "bigint"

// Historical bug in JS (kept for backward compatibility):
console.log(typeof null);           // "object" ⚠️ BUG!

// Objects, Arrays, Functions:
console.log(typeof { a: 1 });       // "object"
console.log(typeof [1, 2, 3]);      // "object" (Arrays are objects!)
console.log(typeof function() {});  // "function" (First-class callable object)
```

> [!WARNING]
> To reliably test if a value is strictly `null`:
> ```javascript
> const isNull = (val) => val === null;
> ```
> To reliably test if a value is an Array:
> ```javascript
> Array.isArray([1, 2, 3]); // true
> ```

---

### 2.5 Primitive vs Reference Types (Stack vs Heap)

Understanding how the engine stores values in memory is the single most important prerequisite to avoiding mutation bugs.

```
       CALL STACK                             MEMORY HEAP
+-----------------------+              +-------------------------+
| Variable | Value      |              | Address | Content       |
|----------|------------|              |---------|---------------|
| age      | 25         |              | 0x0012A | {             |
| name     | "Alice"    |              |         |   name: "Bob",|
| userPtr  | 0x0012A  ──┼─────────────>|         |   age: 30     |
+-----------------------+              |         | }             |
                                       +-------------------------+
```

#### Primitives are Stored by Value on the Stack:
- Fast, fixed-size memory slots allocated directly in the execution context's Call Stack.
- When copied, **an independent copy of the value is created**.

```javascript
let a = 10;
let b = a; // b gets a fresh copy of 10
b = 20;

console.log(a); // 10 (unaffected!)
console.log(b); // 20
```

#### Reference Types are Stored in the Heap:
- Objects can grow dynamically and have unpredictable sizes. They are allocated in the **Memory Heap** (an unstructured memory pool).
- The variable on the Call Stack stores only a **pointer (memory reference address)** to the heap location.
- When copied, **only the pointer is copied**, pointing to the exact same object in heap memory.

```javascript
let person1 = { name: "Alice", age: 25 };
let person2 = person1; // Copies the reference, NOT the object!

person2.age = 26;

console.log(person1.age); // 26 (Mutated person1 as well!)
console.log(person1 === person2); // true (Identical memory reference)
```

---

### 2.6 Mutability vs Immutability
- **Primitives are immutable**: You cannot mutate a primitive value in place. Any string/number method returns a brand-new value.
  ```javascript
  let str = "hello";
  str[0] = "H"; // Silently fails in non-strict mode; TypeError in strict mode
  console.log(str); // "hello"
  
  let upper = str.toUpperCase(); // Creates a new string
  console.log(upper); // "HELLO"
  ```
- **Objects are mutable**: Their properties can be added, deleted, or changed unless frozen with `Object.freeze()`.
- **`const` prevents re-assignment, NOT mutation**:
  ```javascript
  const user = { name: "John" };
  // user = { name: "Jane" }; // TypeError: Assignment to constant variable.
  user.name = "Jane"; // Completely valid! The reference hasn't changed.
  ```

---

# Module 3: Operators & Type Coercion

### 3.1 Arithmetic Operators
| Operator | Name | Example | Result |
| :--- | :--- | :--- | :--- |
| `+` | Addition / Concatenation | `5 + 2` / `"5" + 2` | `7` / `"52"` |
| `-` | Subtraction | `10 - 4` | `6` |
| `*` | Multiplication | `6 * 7` | `42` |
| `/` | Division | `15 / 2` | `7.5` |
| `%` | Remainder (Modulo) | `10 % 3` | `1` |
| `**` | Exponentiation | `2 ** 3` | `8` |
| `++` | Increment (pre/post) | `let x = 1; x++` | `2` |
| `--` | Decrement (pre/post) | `let x = 2; --x` | `1` |

#### Unary Plus and Unary Minus (Fast Type Conversion):
```javascript
+"42"      // 42 (number)
+true      // 1
+false     // 0
+null      // 0
+undefined // NaN
+"hello"   // NaN
-5         // -5
```

---

### 3.2 Assignment Operators
```javascript
let x = 10;
x += 5; // x = x + 5  (15)
x -= 3; // x = x - 3  (12)
x *= 2; // x = x * 2  (24)
x /= 4; // x = x / 4  (6)
x %= 4; // x = x % 4  (2)
x **= 3; // x = x ** 3 (8)

// Logical Assignment Operators (ES2021):
let a = null;
a ??= "default"; // Only assigns if 'a' is null or undefined -> "default"

let b = 1;
b &&= 100;       // Only assigns if 'b' is truthy -> 100

let c = 0;
c ||= 50;        // Assigns if 'c' is falsy (0 is falsy!) -> 50
```

---

### 3.3 Comparison Operators & The Equality Algorithm

JavaScript has two comparison systems:
1. **Abstract Equality (`==`)**: Performs implicit type coercion if types differ before comparing values.
2. **Strict Equality (`===`)**: Compares both type and value. If types differ, returns `false` immediately.

#### Type Coercion Rules for `==`:
- When comparing `number` with `string`: Converts the string to a `number`.
- When comparing `boolean` with anything: Converts the boolean to a `number` (`true -> 1`, `false -> 0`).
- `null == undefined` is **always true**. Neither `null` nor `undefined` equals anything else under `==`.
- When comparing `object` with `primitive`: Converts the object via `valueOf()` or `toString()`.

```javascript
// The Madness of Loose Equality (==):
console.log(0 == false);        // true  (false coerced to 0)
console.log("" == false);       // true  ("" -> 0, false -> 0)
console.log("" == 0);           // true  ("" -> 0)
console.log("0" == 0);          // true  ("0" -> 0)
console.log([] == false);       // true  ([].toString() -> "" -> 0)
console.log([] == ![]);         // true  (![] is false -> [] == false -> true)

// Strict Equality (===) - Safe & Predictable:
console.log(0 === false);       // false (number !== boolean)
console.log("" === false);      // false (string !== boolean)
console.log("" === 0);          // false
console.log("0" === 0);         // false
console.log([] === false);      // false
```

---

### 3.4 `==` vs `===` vs `Object.is()`

There are two edge cases where `===` behaves counter-intuitively:
1. `NaN === NaN` evaluates to `false`. (In IEEE 754, `NaN` is not equal to any value, including itself).
2. `+0 === -0` evaluates to `true`.

`Object.is()` solves both:
```javascript
// Edge case 1: NaN
console.log(NaN === NaN);           // false
console.log(Object.is(NaN, NaN));   // true

// Edge case 2: Signed Zeros
console.log(+0 === -0);             // true
console.log(Object.is(+0, -0));     // false
```

---

### 3.5 Logical Operators & Short-Circuiting

Logical operators in JavaScript do not just return booleans; they return the **actual operand value** based on short-circuit evaluation.

1. **Logical AND (`&&`)**: Evaluates left-to-right. Returns the **first falsy value** encountered. If all are truthy, returns the **last operand**.
   ```javascript
   console.log("apple" && "banana"); // "banana"
   console.log(null && "banana");    // null (short-circuits immediately)
   console.log(true && 0 && "cat");  // 0
   ```
2. **Logical OR (`||`)**: Evaluates left-to-right. Returns the **first truthy value** encountered. If all are falsy, returns the **last operand**.
   ```javascript
   console.log("" || "default");      // "default"
   console.log("admin" || "guest");   // "admin"
   console.log(false || null || 0);   // 0
   ```
3. **Logical NOT (`!`)**: Coerces operand to boolean and negates it. Double NOT (`!!`) is an idiomatic way to convert any value to its boolean equivalent.
   ```javascript
   console.log(!0);       // true
   console.log(!!"hello");// true
   console.log(!!null);   // false
   ```

---

### 3.6 Truthy vs Falsy Values

In JavaScript, there are exactly **8 Falsy values**. Every other value is **Truthy** (including empty objects `{}` and empty arrays `[]`).

#### The 8 Falsy Values:
1. `false`
2. `0`
3. `-0`
4. `0n` (BigInt zero)
5. `""` (empty string)
6. `null`
7. `undefined`
8. `NaN`

```javascript
// Common Pitfall: Non-empty strings with "0" or "false" are TRUTHY!
console.log(Boolean("0"));     // true
console.log(Boolean("false")); // true
console.log(Boolean([]));      // true (empty array is an object!)
console.log(Boolean({}));      // true (empty object is an object!)
```

---

### 3.7 Nullish Coalescing (`??`) vs Logical OR (`||`)
The **Nullish Coalescing Operator (`??`)** evaluates the right-hand operand only if the left-hand operand is **`null` or `undefined`** (nullish), NOT just any falsy value.

```javascript
// Problem with || when 0, false, or "" are valid values:
let userCount = 0;
let display1 = userCount || 10;
console.log(display1); // 10 ❌ (Wrong! 0 was a valid count, but || treated it as falsy)

let display2 = userCount ?? 10;
console.log(display2); // 0  ✅ (Correct! 0 is not null or undefined)

let enteredText = "";
let text1 = enteredText || "Default Text"; // "Default Text" ❌
let text2 = enteredText ?? "Default Text"; // ""             ✅
```

---

# Module 4: Control Flow & Iteration

### 4.1 Conditional Statements (if, else if, else, Ternary)

```javascript
const score = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else {
  console.log("F");
}

// Ternary Operator (condition ? exprIfTrue : exprIfFalse):
const access = score >= 80 ? "Granted" : "Denied";
```

> [!TIP]
> Avoid deeply nested ternary operators. They degrade readability. Use early returns or `if` statements instead.

---

### 4.2 The switch Statement
The `switch` statement evaluates an expression and matches its value against `case` clauses using **strict equality (`===`)**.

```javascript
const role = "editor";

switch (role) {
  case "admin":
    console.log("Full access");
    break; // Prevents fall-through!
  case "editor":
  case "moderator": // Intentional fall-through (both share the same logic)
    console.log("Edit and moderate content");
    break;
  case "viewer":
    console.log("Read-only access");
    break;
  default:
    console.log("Unknown role");
}
```

> [!IMPORTANT]
> If you omit `break`, execution will fall through to subsequent cases regardless of whether those cases match the condition.

---

### 4.3 Loops: for, while, do...while

#### 1. Classic `for` Loop (Best when index/iteration count is known):
```javascript
for (let i = 0; i < 5; i++) {
  console.log(`Iteration: ${i}`);
}
```

#### 2. `while` Loop (Best when termination condition is dynamic):
```javascript
let balance = 100;
while (balance > 0) {
  balance -= 30;
  console.log(`Remaining: ${balance}`);
}
```

#### 3. `do...while` Loop (Always executes at least once):
```javascript
let count = 0;
do {
  console.log(`Count is: ${count}`);
  count++;
} while (count < 0); // Condition is false immediately, but loop executed 1 time
```

---

### 4.4 Iterating Over Data: for...of vs for...in

| Loop | What it iterates over | Best used for |
| :--- | :--- | :--- |
| **`for...of`** | **Values** of iterable collections (Arrays, Strings, Maps, Sets) | Arrays, Strings, Sets |
| **`for...in`** | **Keys** (enumerable property names), including inherited prototype keys | Plain Objects (with care) |

```javascript
const colors = ["red", "green", "blue"];

// for...of iterates over VALUES:
for (const color of colors) {
  console.log(color); // "red", "green", "blue"
}

const user = { name: "Sarah", role: "Engineer", age: 29 };

// for...in iterates over KEYS:
for (const key in user) {
  // Good practice: check if property belongs directly to object
  if (Object.hasOwn(user, key)) {
    console.log(`${key}: ${user[key]}`);
  }
}
```

> [!CAUTION]
> Never use `for...in` to iterate over an Array! It iterates over all enumerable properties (including custom indices or prototype methods), and iteration order is not guaranteed.

---

### 4.5 Loop Control: break, continue, and Labeled Statements

- `break`: Terminates the loop immediately and jumps to the statement following the loop.
- `continue`: Skips the rest of the current iteration and jumps to the next iteration.

```javascript
for (let i = 1; i <= 5; i++) {
  if (i === 2) continue; // Skip 2
  if (i === 4) break;    // Stop at 4
  console.log(i); // Logs: 1, 3
}
```

#### Labeled Statements (Breaking Outer Loops):
When dealing with nested loops, a standard `break` only exits the innermost loop. Labels allow breaking out of outer loops directly:

```javascript
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      console.log(`Breaking out of outer loop at i=${i}, j=${j}`);
      break outerLoop; // Exits BOTH loops
    }
    console.log(`i=${i}, j=${j}`);
  }
}
```

---

# Common Pitfalls & Interview Traps

### Trap 1: Floating Point Math (`0.1 + 0.2 !== 0.3`)
```javascript
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```
**Why?** Numbers are stored in binary IEEE 754 float representation. Fractions like `0.1` ($1/10$) cannot be represented cleanly in binary, leading to rounding inaccuracies.  
**Fix**: Use `Number.EPSILON`:
```javascript
const isEqual = (a, b) => Math.abs(a - b) < Number.EPSILON;
console.log(isEqual(0.1 + 0.2, 0.3)); // true
```

### Trap 2: Automatic Semicolon Insertion (ASI) Return Pitfall
```javascript
function getUser() {
  return
  {
    name: "Alice"
  };
}
console.log(getUser()); // undefined!
```
**Why?** JavaScript automatically inserts a semicolon after `return` because of the newline: `return;`.  
**Fix**: Never break line directly after `return`:
```javascript
function getUser() {
  return {
    name: "Alice"
  };
}
```

### Trap 3: The `var` in `for` Loop Asynchronous Closure Trap
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output after 100ms: 3, 3, 3 (NOT 0, 1, 2)
```
**Why?** `var` is function-scoped. There is only ONE shared `i` variable in memory. By the time `setTimeout` fires, the loop finished and `i = 3`.  
**Fix**: Use `let`. In ES6, `let` creates a new binding for `i` in each loop iteration:
```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 ✅
```

---

# Hands-On Practice Challenges & Solutions

### Challenge 1: The Strict Truthy Filter
**Task**: Write a function `cleanFalsyValues(arr)` that takes an array and returns a new array with all 8 falsy values removed, but preserves all truthy values (including `{}` and `[]`).
```javascript
// Test input:
const mixed = [0, 1, false, 2, "", 3, null, "hello", undefined, NaN, [], {}, -0];
```

<details>
<summary>👉 View Solution</summary>

```javascript
function cleanFalsyValues(arr) {
  return arr.filter(Boolean);
}

// Or without array methods (using loop & truthy check):
function cleanFalsyValuesManual(arr) {
  const result = [];
  for (const item of arr) {
    if (item) {
      result.push(item);
    }
  }
  return result;
}

const mixed = [0, 1, false, 2, "", 3, null, "hello", undefined, NaN, [], {}, -0];
console.log(cleanFalsyValues(mixed));
// Output: [ 1, 2, 3, 'hello', [], {} ]
```
</details>

---

### Challenge 2: Deep Equality of Primitives and Objects (By Value)
**Task**: Given two variables `val1` and `val2`, write a function `isIdentical(val1, val2)` that:
- Returns `true` if they are both `NaN`.
- Distinguishes `+0` from `-0` (returns `false`).
- For other primitives, checks strict equality.

<details>
<summary>👉 View Solution</summary>

```javascript
function isIdentical(val1, val2) {
  return Object.is(val1, val2);
}

// Without Object.is (implementing the logic from scratch):
function isIdenticalManual(val1, val2) {
  // Test for NaN: NaN is the only value in JS not equal to itself
  if (val1 !== val1 && val2 !== val2) {
    return true;
  }
  // Test for +0 vs -0: 1 / 0 is Infinity, 1 / -0 is -Infinity
  if (val1 === 0 && val2 === 0) {
    return 1 / val1 === 1 / val2;
  }
  return val1 === val2;
}

console.log(isIdenticalManual(NaN, NaN)); // true
console.log(isIdenticalManual(+0, -0));   // false
console.log(isIdenticalManual(42, 42));   // true
console.log(isIdenticalManual("a", "b")); // false
```
</details>

---

### Challenge 3: FizzBuzz with Switch (Advanced Control Flow)
**Task**: Implement FizzBuzz for numbers 1 to 20 using a `switch (true)` statement. Print:
- `"FizzBuzz"` if divisible by both 3 and 5
- `"Fizz"` if divisible by 3
- `"Buzz"` if divisible by 5
- The number itself otherwise

<details>
<summary>👉 View Solution</summary>

```javascript
function runFizzBuzz(limit = 20) {
  for (let i = 1; i <= limit; i++) {
    switch (true) {
      case i % 15 === 0:
        console.log("FizzBuzz");
        break;
      case i % 3 === 0:
        console.log("Fizz");
        break;
      case i % 5 === 0:
        console.log("Buzz");
        break;
      default:
        console.log(i);
    }
  }
}

runFizzBuzz(15);
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 2: Functions 🧠](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/02-functions.md)** to master Function Declarations vs Expressions, Arrow Functions, Execution Scope, Closures Preview, Parameters, and Higher-Order Functions.
