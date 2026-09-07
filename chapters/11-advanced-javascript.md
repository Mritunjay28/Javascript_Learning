# Phase 11: Advanced JavaScript 🧠🔥

> **Goal**: Master memory architecture, garbage collection algorithms, memory leak prevention, performance optimization patterns (Debouncing, Throttling, Memoization), and enterprise Software Design Patterns in JavaScript.

---

## Table of Contents
1. [Module 27: Memory Management & Immutability](#module-27-memory-management--immutability)
   - [27.1 The Memory Lifecycle (Allocation, Usage, Release)](#271-the-memory-lifecycle-allocation-usage-release)
   - [27.2 Garbage Collection: Mark-and-Sweep vs Reference Counting](#272-garbage-collection-mark-and-sweep-vs-reference-counting)
   - [27.3 The 4 Most Common Memory Leaks in JavaScript](#273-the-4-most-common-memory-leaks-in-javascript)
   - [27.4 Shallow Copy vs Deep Copy & `structuredClone()`](#274-shallow-copy-vs-deep-copy--structuredclone)
   - [27.5 Immutability Strategies](#275-immutability-strategies)
2. [Module 28: Performance & Functional Patterns](#module-28-performance--functional-patterns)
   - [28.1 Debouncing (Theory & Implementation)](#281-debouncing-theory--implementation)
   - [28.2 Throttling (Theory & Implementation)](#282-throttling-theory--implementation)
   - [28.3 Advanced Currying & Partial Application](#283-advanced-currying--partial-application)
   - [28.4 Memoization with LRU (Least Recently Used) Cache](#284-memoization-with-lru-least-recently-used-cache)
   - [28.5 Recursion & Stack Overflow Prevention](#285-recursion--stack-overflow-prevention)
3. [Module 29: Gang-of-Four Design Patterns in JavaScript](#module-29-gang-of-four-design-patterns-in-javascript)
   - [29.1 The Module & Revealing Module Pattern](#291-the-module--revealing-module-pattern)
   - [29.2 The Singleton Pattern](#292-the-singleton-pattern)
   - [29.3 The Factory Pattern](#293-the-factory-pattern)
   - [29.4 The Observer / Pub-Sub Pattern](#294-the-observer--pub-sub-pattern)
4. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 27: Memory Management & Immutability

### 27.1 The Memory Lifecycle
1. **Allocate**: Memory is reserved when declaring variables, objects, or strings.
2. **Use**: Values are read and modified in calculations.
3. **Release**: When memory is no longer reachable, the **Garbage Collector (GC)** frees it.

---

### 27.2 Garbage Collection Algorithms

#### 1. Reference Counting (Legacy):
Tracks how many references point to each object. If reference count reaches 0, it is collected.
- **Fatal Flaw: Circular References**:
  ```javascript
  function circularLeak() {
    const objA = {};
    const objB = {};
    objA.ref = objB; // objA references objB
    objB.ref = objA; // objB references objA
    // Neither ever reaches reference count 0, leaking memory!
  }
  ```

#### 2. Mark-and-Sweep (Modern Standard in V8, SpiderMonkey, JSC):
- Begins at **Roots** (Global object, active Call Stack variables, DOM tree).
- Traverses the entire reference graph and **Marks** all reachable objects.
- Sweeps across memory and deallocates any memory slots that are **unmarked (unreachable)**.
- Circular references that are detached from the Root graph are cleanly collected!

---

### 27.3 The 4 Most Common Memory Leaks
1. **Accidental Global Variables**:
   Assigning without `let`/`const` binds variables to `window` or `globalThis`, preventing collection.
2. **Forgotten Timers & Callbacks**:
   An active `setInterval` keeps any variables captured in its closure in memory until `clearInterval` is explicitly invoked.
3. **Detached DOM Elements**:
   Storing a reference to a DOM node in a JS array even after removing it from the document body prevents the node tree from being collected.
4. **Closures Retaining Huge Scopes**:
   A small function sharing an outer scope with huge arrays keeps the whole lexical scope alive in heap memory.

---

### 27.4 Shallow Copy vs Deep Copy
- **Shallow Copy** (`{ ...obj }`, `Object.assign({}, obj)`): Only copies the top-level primitives. Nested objects share memory references.
- **JSON Deep Copy** (`JSON.parse(JSON.stringify(obj))`):
  - ❌ Drops functions, `undefined`, and `Symbol`s.
  - ❌ Converts `Date` to strings and `NaN`/`Infinity` to `null`.
  - ❌ Crashes on circular references (`TypeError: Converting circular structure to JSON`).
- **`structuredClone(obj)` (Modern Native Standard)**:
  - Preserves nested objects, Arrays, Dates, RegExps, Maps, Sets, and ArrayBuffers.
  - Safely handles circular references!

---

# Module 28: Performance & Functional Patterns

### 28.1 Debouncing
> **Concept**: Postpones execution until $X$ milliseconds have passed since the **last time** the event was triggered. Ideal for search typeaheads, auto-saving forms, and window resize calculations.

```javascript
function debounce(fn, delayMs) {
  let timerId = null;

  return function(...args) {
    const context = this;
    clearTimeout(timerId); // Reset timer on every keystroke

    timerId = setTimeout(() => {
      fn.apply(context, args);
    }, delayMs);
  };
}

// Usage:
const handleSearch = debounce((query) => {
  console.log(`Sending API request for: ${query}`);
}, 300);
```

---

### 28.2 Throttling
> **Concept**: Guarantees that the function is executed **at most once** every $X$ milliseconds, regardless of how many times the user fires the event. Ideal for scroll position tracking, games, and mouse movements.

```javascript
function throttle(fn, intervalMs) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= intervalMs) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Usage:
window.addEventListener("scroll", throttle(() => {
  console.log("Calculated scroll position:", window.scrollY);
}, 200));
```

---

### 28.3 Advanced Memoization with LRU Eviction
A simple cache can cause memory leaks if inputs are unbounded. An **LRU (Least Recently Used)** cache discards the least recently accessed items when reaching maximum capacity:

```javascript
function memoizeLRU(fn, capacity = 100) {
  const cache = new Map(); // Map preserves insertion order

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const val = cache.get(key);
      // Re-insert to mark as most recently used:
      cache.delete(key);
      cache.set(key, val);
      return val;
    }

    const result = fn.apply(this, args);

    // Evict oldest item if capacity is exceeded:
    if (cache.size >= capacity) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    cache.set(key, result);
    return result;
  };
}
```

---

# Module 29: Gang-of-Four Design Patterns in JavaScript

### 29.1 The Revealing Module Pattern
Hides private implementation details and exposes a clean public API object:

```javascript
const AuthModule = (() => {
  let privateToken = null;

  function setToken(token) {
    privateToken = token;
  }

  function isAuthenticated() {
    return privateToken !== null;
  }

  // Explicitly reveal public surface:
  return {
    login: (token) => setToken(token),
    isLoggedIn: isAuthenticated
  };
})();
```

---

### 29.2 The Singleton Pattern
Ensures a class has only one instance and provides a global access point:

```javascript
class DatabaseConnection {
  static #instance = null;

  constructor() {
    if (DatabaseConnection.#instance) {
      return DatabaseConnection.#instance;
    }
    this.connectionId = Math.random();
    DatabaseConnection.#instance = this;
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new DatabaseConnection();
    }
    return this.#instance;
  }
}

const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
console.log(db1 === db2); // true (Both share the exact same instance!)
```

---

### 29.3 The Factory Pattern
Decouples object creation from business logic, allowing dynamic instantiation based on criteria:

```javascript
class EmailNotification {
  send(msg) { return `Sending Email: ${msg}`; }
}

class SMSNotification {
  send(msg) { return `Sending SMS: ${msg}`; }
}

class PushNotification {
  send(msg) { return `Sending Push Notification: ${msg}`; }
}

class NotificationFactory {
  static create(type) {
    switch (type) {
      case "email": return new EmailNotification();
      case "sms": return new SMSNotification();
      case "push": return new PushNotification();
      default: throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

const notifier = NotificationFactory.create("email");
console.log(notifier.send("Your code is 1234"));
```

---

### 29.4 The Observer / Pub-Sub Pattern
Decouples publishers from subscribers:

```javascript
class PubSub {
  #channels = new Map();

  subscribe(channel, subscriber) {
    if (!this.#channels.has(channel)) {
      this.#channels.set(channel, new Set());
    }
    this.#channels.get(channel).add(subscriber);

    // Unsubscribe closure:
    return () => this.#channels.get(channel)?.delete(subscriber);
  }

  publish(channel, data) {
    const subs = this.#channels.get(channel);
    if (!subs) return;
    subs.forEach(fn => fn(data));
  }
}
```

---

# Hands-On Practice Challenges & Solutions

### Challenge: Debounce with Immediate (Leading-Edge) Execution
**Task**: Extend the standard `debounce` function with an `{ immediate: true }` option. If `immediate` is true, the function executes on the leading edge (immediately on the first trigger), but suppresses subsequent calls until the delay has elapsed without calls.

<details>
<summary>👉 View Solution</summary>

```javascript
function debounceAdvanced(fn, delayMs, immediate = false) {
  let timerId = null;

  return function(...args) {
    const context = this;
    const callNow = immediate && !timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    }, delayMs);

    if (callNow) {
      fn.apply(context, args);
    }
  };
}

// Verification:
const logImmediate = debounceAdvanced((msg) => console.log(msg), 500, true);
logImmediate("Triggered instantly!"); // Logs immediately
logImmediate("Suppressed");            // Suppressed
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 12: TypeScript 🔷](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/12-typescript.md)** to add static typing, Interfaces, Generics, Union types, and Type Narrowing to your JavaScript skill set.
