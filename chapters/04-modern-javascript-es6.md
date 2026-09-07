# Phase 4: Modern JavaScript (ES6+) ⚡

> **Goal**: Master modern ECMAScript specifications (ES6 through ES2024+). Write clean, expressive, and concise JavaScript utilizing Destructuring, Rest & Spread, Optional Chaining, Nullish Coalescing, Tagged Templates, and Enhanced Literals.

---

## Table of Contents
1. [Module 8: Modern JavaScript Syntactic Superpowers](#module-8-modern-javascript-syntactic-superpowers)
   - [8.1 Template Literals & Tagged Template Literals](#81-template-literals--tagged-template-literals)
   - [8.2 Destructuring: Arrays & Objects Deep-Dive](#82-destructuring-arrays--objects-deep-dive)
   - [8.3 The Spread Operator (`...`)](#83-the-spread-operator-)
   - [8.4 The Rest Operator (`...`)](#84-the-rest-operator-)
   - [8.5 Optional Chaining (`?.`)](#85-optional-chaining-)
   - [8.6 Nullish Coalescing (`??`) & Logical Assignment](#86-nullish-coalescing---logical-assignment)
   - [8.7 Enhanced Object Literals](#87-enhanced-object-literals)
   - [8.8 Symbols & Well-Known Symbols](#88-symbols--well-known-symbols)
2. [Modern Idioms & Clean Code Patterns](#modern-idioms--clean-code-patterns)
3. [Common Pitfalls & Traps](#common-pitfalls--traps)
4. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 8: Modern JavaScript Syntactic Superpowers

### 8.1 Template Literals & Tagged Template Literals
Template literals use backticks (`` ` ``) instead of quotes, offering multi-line strings and expression interpolation (`${...}`).

```javascript
const name = "Alice";
const cartTotal = 149.99;

// Basic interpolation & multi-line formatting:
const receipt = `
Customer: ${name.toUpperCase()}
Total: $${cartTotal.toFixed(2)}
Date: ${new Date().toISOString()}
`;
console.log(receipt);
```

#### Advanced: Tagged Template Literals
A **Tagged Template** is a function call that receives string fragments and interpolated values separately, allowing preprocessing (used heavily by libraries like `styled-components` and SQL sanitizers).

```javascript
// Tag function: (stringsArray, ...values)
function sanitize(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const val = values[i - 1];
    // Sanitize any inserted strings against XSS:
    const cleanVal = typeof val === "string" 
      ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") 
      : (val ?? "");
    return acc + cleanVal + str;
  });
}

const userInput = "<script>alert('hacked')</script>";
const safeHTML = sanitize`<div>Welcome, ${userInput}!</div>`;
console.log(safeHTML);
// Output: <div>Welcome, &lt;script&gt;alert('hacked')&lt;/script&gt;!</div>
```

---

### 8.2 Destructuring: Arrays & Objects Deep-Dive

#### 1. Array Destructuring:
Positions correspond to indices:

```javascript
const coordinates = [10, 25, 50, 100];

// Basic, skipping indices, and rest:
const [x, y, , max] = coordinates; // x=10, y=25, max=100

// Swapping variables without temporary variable:
let first = "A";
let second = "B";
[first, second] = [second, first];
console.log(first, second); // "B", "A"

// Default values:
const [a = 1, b = 2, c = 3] = [42];
console.log(a, b, c); // 42, 2, 3
```

#### 2. Object Destructuring:
Matches by property name:

```javascript
const user = {
  id: 101,
  profile: {
    firstName: "Sarah",
    lastName: "Connor"
  },
  role: "admin"
};

// Renaming, default values, and nested destructuring:
const {
  id: userId, // Renamed 'id' to 'userId'
  profile: { firstName }, // Nested extraction
  status = "active" // Default value
} = user;

console.log(userId);    // 101
console.log(firstName); // "Sarah"
console.log(status);    // "active"
```

#### 3. Destructuring in Function Signatures:
```javascript
// Clean API options pattern:
function configureServer({ port = 3000, host = "localhost", ssl = false } = {}) {
  return `Server running on ${ssl ? "https" : "http"}://${host}:${port}`;
}

console.log(configureServer({ port: 8080 })); // "Server running on http://localhost:8080"
console.log(configureServer());               // "Server running on http://localhost:3000"
```

---

### 8.3 The Spread Operator (`...`)
The spread operator unpacks elements of an iterable (Array, String, Set, Map) or properties of an Object into a new context.

```javascript
// 1. Array combination & cloning:
const odds = [1, 3, 5];
const evens = [2, 4, 6];
const combined = [0, ...odds, ...evens]; // [ 0, 1, 3, 5, 2, 4, 6 ]

// 2. Passing array as individual arguments:
const numbers = [45, 12, 89, 32];
console.log(Math.max(...numbers)); // 89

// 3. Object cloning & merging:
const baseConfig = { timeout: 1000, debug: false, apiVersion: "v1" };
const customConfig = { ...baseConfig, debug: true, port: 4000 };
console.log(customConfig);
// { timeout: 1000, debug: true, apiVersion: 'v1', port: 4000 }
```

---

### 8.4 The Rest Operator (`...`)
While Spread **unpacks**, Rest **gathers** remaining items into a single entity.

```javascript
// 1. In Array Destructuring:
const [head, second, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [ 3, 4, 5 ]

// 2. In Object Destructuring (Omitting properties):
const userWithPassword = { id: 1, name: "Alice", passwordHash: "secret123", email: "a@test.com" };

// Exclude sensitive property cleanly:
const { passwordHash, ...safeUserData } = userWithPassword;
console.log(safeUserData); // { id: 1, name: 'Alice', email: 'a@test.com' }
```

---

### 8.5 Optional Chaining (`?.`)
Avoids tedious `if (obj && obj.user && obj.user.address)` chains. If the target is `null` or `undefined`, evaluation short-circuits to `undefined` without throwing a `TypeError`.

```javascript
const account = {
  id: 42,
  getStatement() { return "Balance: $500"; }
};

// 1. Deep property access:
console.log(account?.customer?.address?.city); // undefined (No TypeError thrown!)

// 2. Optional method invocation:
console.log(account.getStatement?.()); // "Balance: $500"
console.log(account.getInvoice?.());   // undefined (Safe!)

// 3. Optional dynamic bracket access & arrays:
const key = "balance";
console.log(account?.[key]); // undefined
const usersList = null;
console.log(usersList?.[0]);  // undefined
```

---

### 8.6 Nullish Coalescing (`??`) & Logical Assignment

```javascript
// Logical Assignment:
let config = { maxRetries: 0, title: "" };

// ??= (Assign only if null or undefined)
config.maxRetries ??= 3;
console.log(config.maxRetries); // 0 (0 was kept!)

config.timeout ??= 5000;
console.log(config.timeout);    // 5000

// ||= (Assign if falsy)
config.title ||= "Default Title";
console.log(config.title);      // "Default Title"

// &&= (Assign if truthy)
let loggedIn = true;
loggedIn &&= "Active Session";
console.log(loggedIn);          // "Active Session"
```

---

### 8.7 Enhanced Object Literals
```javascript
const prop = "score";
const value = 99;

const player = {
  // 1. Property value shorthand:
  value,
  
  // 2. Method definition shorthand (no 'function' keyword needed):
  levelUp() {
    this.value += 10;
  },
  
  // 3. Computed dynamic keys:
  [`stat_${prop}`]: value,
  
  // 4. Super calls in object prototypes:
  __proto__: {
    getBaseRole() { return "Player"; }
  },
  getRole() {
    return super.getBaseRole();
  }
};

console.log(player.stat_score); // 99
```

---

### 8.8 Symbols & Well-Known Symbols
A `Symbol` is a primitive value guaranteed to be globally unique. It cannot be coerced into a string accidentally.

```javascript
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false

// Symbol as non-enumerable hidden property key:
const secureStore = {
  [id1]: "TopSecretPayload"
};
console.log(secureStore[id1]); // "TopSecretPayload"
console.log(Object.keys(secureStore)); // [] (Hidden from standard inspection!)

// Well-known Symbol: Symbol.iterator
// Enables any custom object to work with for...of:
const rangeIterator = {
  start: 1,
  end: 3,
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const num of rangeIterator) {
  console.log(num); // 1, 2, 3
}
```

---

# Common Pitfalls & Traps

### Trap 1: Destructuring Null or Undefined
```javascript
// ❌ Throws TypeError: Cannot destructure property 'x' of 'undefined' as it is undefined.
const { x } = undefined;

// ✅ Defensive default pattern:
const { x } = undefined ?? {};
console.log(x); // undefined (No crash!)
```

### Trap 2: Spread Operator Performance on Large Collections
Spreading arrays inside loops (like `.reduce((acc, curr) => [...acc, curr], [])`) creates $O(n^2)$ time complexity and massive garbage collection overhead! Use `.push()` inside mutations or standard loops when building large arrays.

---

# Hands-On Practice Challenges & Solutions

### Challenge 1: Deep Merge Utility
**Task**: Build a `deepMerge(target, source)` function using modern ES features that recursively combines two nested configuration objects without mutating either source object.

<details>
<summary>👉 View Solution</summary>

```javascript
function deepMerge(target, source) {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      key in result &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// Verification:
const defaultSettings = {
  theme: "dark",
  network: { timeout: 3000, retries: 2 }
};

const customSettings = {
  network: { retries: 5, cache: true },
  logging: true
};

const merged = deepMerge(defaultSettings, customSettings);
console.log(merged);
// Output:
// {
//   theme: 'dark',
//   network: { timeout: 3000, retries: 5, cache: true },
//   logging: true
// }
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 5: How JavaScript Actually Works 🧬](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/05-how-javascript-works.md)** to conquer Execution Contexts, the Call Stack, Scope Chains, Hoisting, the Temporal Dead Zone, Closures, and dynamic `this` binding mechanics.
