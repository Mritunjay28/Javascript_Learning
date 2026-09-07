# Phase 8: Asynchronous JavaScript 🚀

> **Goal**: Master asynchronous programming, Promises, `async`/`await`, and the exact mechanics of the JavaScript Event Loop, Call Stack, Microtask Queue, and Callback Queue.

---

## Table of Contents
1. [Module 17: The Asynchronous Paradigm](#module-17-the-asynchronous-paradigm)
   - [17.1 Synchronous vs Asynchronous JavaScript](#171-synchronous-vs-asynchronous-javascript)
   - [17.2 The Problem of Callback Hell & Inversion of Control](#172-the-problem-of-callback-hell--inversion-of-control)
2. [Module 18: Promises In-Depth](#module-18-promises-in-depth)
   - [18.1 What is a Promise? States & Lifecycle](#181-what-is-a-promise-states--lifecycle)
   - [18.2 Constructing Promises](#182-constructing-promises)
   - [18.3 Consuming Promises: `.then()`, `.catch()`, `.finally()`](#183-consuming-promises-then-catch-finally)
   - [18.4 Promise Chaining & Error Propagation](#184-promise-chaining--error-propagation)
   - [18.5 Promise Combinators: `all`, `allSettled`, `race`, `any`](#185-promise-combinators-all-allsettled-race-any)
3. [Module 19: `async` and `await`](#module-19-async-and-await)
   - [19.1 Syntax & Semantics](#191-syntax--semantics)
   - [19.2 Sequential vs Concurrent/Parallel Execution](#192-sequential-vs-concurrentparallel-execution)
   - [19.3 Error Handling Patterns with `try/catch`](#193-error-handling-patterns-with-trycatch)
   - [19.4 Top-Level Await](#194-top-level-await)
4. [Module 20: The Event Loop Demystified 🔥🔥](#module-20-the-event-loop-demystified-)
   - [20.1 Architectural Components: Call Stack, Web APIs, Queues](#201-architectural-components-call-stack-web-apis-queues)
   - [20.2 Microtasks vs Macrotasks](#202-microtasks-vs-macrotasks)
   - [20.3 The Event Loop Tick Algorithm](#203-the-event-loop-tick-algorithm)
   - [20.4 Predicting Output: Step-by-Step Tracing](#204-predicting-output-step-by-step-tracing)
5. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 17: The Asynchronous Paradigm

### 17.1 Synchronous vs Asynchronous JavaScript
JavaScript is single-threaded: it has one Call Stack and can execute only one instruction at a time.
- **Synchronous Execution**: Operations block the thread until completion. A long loop or file read freezes the UI entirely.
- **Asynchronous Execution**: Long-running operations (network requests, timers, disk I/O) are delegated to browser background threads or Node.js `libuv`. The main thread continues running other code without blocking.

---

### 17.2 The Problem of Callback Hell & Inversion of Control
Before ES6, asynchronous flows relied on nested callbacks:

```javascript
// ❌ The Callback Hell Pyramid of Doom:
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      processPayment(details, (err, receipt) => {
        if (err) return handleError(err);
        console.log("Success!", receipt);
      });
    });
  });
});
```

**Fatal Flaws:**
1. **Unreadable indentation pyramid.**
2. **Inversion of Control**: You hand over execution of your callback to a third-party function, trusting it won't call your callback twice, too early, or never.

---

# Module 18: Promises In-Depth

### 18.1 What is a Promise? States & Lifecycle
A **Promise** is a first-class object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

#### The 3 Immutable States:
1. **`pending`**: Initial state; neither fulfilled nor rejected.
2. **`fulfilled`**: The operation completed successfully (yields a *value*).
3. **`rejected`**: The operation failed (yields a *reason/error*).

> **Rule**: Once a Promise transitions from `pending` to either `fulfilled` or `rejected`, its state is **permanently settled and immutable**.

---

### 18.2 Constructing Promises
```javascript
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new RangeError("Delay cannot be negative"));
      return;
    }
    setTimeout(() => {
      resolve(`Waited ${ms}ms`);
    }, ms);
  });
}
```

---

### 18.3 Consuming Promises & 18.4 Chaining
```javascript
delay(100)
  .then(result => {
    console.log(result); // "Waited 100ms"
    return delay(200);   // Returning a Promise chains the sequence!
  })
  .then(result => {
    console.log(result); // "Waited 200ms"
    return "Complete!";  // Returning a value wraps it in an immediately resolved Promise
  })
  .then(msg => {
    console.log(msg);    // "Complete!"
  })
  .catch(err => {
    console.error("Caught error:", err.message); // Centralized error handling
  })
  .finally(() => {
    console.log("Cleanup actions executed regardless of success or failure.");
  });
```

---

### 18.5 Promise Combinators

| Method | Resolves When | Rejects When | Best For |
| :--- | :--- | :--- | :--- |
| **`Promise.all([p1, p2])`** | **All** promises fulfill | **First** promise rejects (fail-fast) | Dependent parallel requests |
| **`Promise.allSettled([p1, p2])`** | **All** promises settle (never rejects) | Never rejects | Independent batch tasks |
| **`Promise.race([p1, p2])`** | **First** promise settles (fulfills OR rejects) | First settles rejected | Network timeouts |
| **`Promise.any([p1, p2])`** | **First** promise fulfills | **All** reject (`AggregateError`) | Redundant fallback mirrors |

```javascript
// Promise.allSettled Example:
const p1 = Promise.resolve("Success");
const p2 = Promise.reject(new Error("Network Error"));

Promise.allSettled([p1, p2]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 'Success' },
  //   { status: 'rejected', reason: Error: Network Error }
  // ]
});
```

---

# Module 19: `async` and `await`

ES2017 introduced `async`/`await` as syntactic sugar over Promises, allowing asynchronous code to be structured like clean synchronous code.

### 19.1 Syntax & Semantics
- Declaring a function `async` guarantees it **always returns a Promise**.
- The `await` keyword pauses execution of the `async` function until the awaited Promise settles, then unwraps its value.

```javascript
async function fetchUserDashboard(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    return { user, orders };
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    throw error;
  }
}
```

---

### 19.2 Sequential vs Concurrent/Parallel Execution

```javascript
// ❌ Accidental Waterfall (Sequential - takes 2000ms total):
async function loadDataSlow() {
  const users = await delay(1000);   // waits 1000ms
  const products = await delay(1000);// waits another 1000ms
  return { users, products };
}

// ✅ Concurrent Execution (Parallel - takes only 1000ms total):
async function loadDataFast() {
  // Fire both promises simultaneously:
  const usersPromise = delay(1000);
  const productsPromise = delay(1000);

  // Await them together:
  const [users, products] = await Promise.all([usersPromise, productsPromise]);
  return { users, products };
}
```

---

# Module 20: The Event Loop Demystified 🔥🔥

### 20.1 Architectural Components
The runtime consists of 4 cooperating components:
1. **Call Stack**: Executes synchronous JavaScript instructions (LIFO).
2. **Web APIs / Node APIs**: Background threads handling timers, HTTP requests, and filesystem I/O.
3. **Microtask Queue**: High-priority queue holding:
   - Promise callbacks (`.then`, `.catch`, `.finally`)
   - `queueMicrotask()`
   - `process.nextTick()` (in Node.js, highest priority)
   - MutationObserver callbacks
4. **Macrotask (Callback) Queue**: Standard priority queue holding:
   - `setTimeout` / `setInterval`
   - `setImmediate` (Node.js)
   - I/O callbacks & UI rendering events

---

### 20.2 The Event Loop Tick Algorithm
The Event Loop executes continuously in a loop:

```
                  ┌────────────────────────────────────────┐
                  ▼                                        │
           [ Call Stack ] ◄── Synchronous execution        │
                  │ (Empty?)                               │
                  ├──► YES ──► Drain ENTIRE Microtask Queue│
                  │                  │ (Empty?)            │
                  │                  └──► Run 1 Macrotask ─┘
                  └──► NO ───► Keep executing stack
```

> **CRITICAL RULE**: The Event Loop will NEVER pick up a Macrotask until the **Microtask Queue is completely empty**! If microtasks spawn more microtasks, they drain before any timer fires.

---

### 20.3 Predicting Output: Classic Interview Question

What is the exact output order of the following snippet?

```javascript
console.log("1: Synchronous");

setTimeout(() => {
  console.log("2: Timeout (Macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Promise 1 (Microtask)");
}).then(() => {
  console.log("4: Promise 2 (Microtask)");
});

queueMicrotask(() => {
  console.log("5: queueMicrotask");
});

console.log("6: Synchronous End");
```

#### Step-by-Step Execution Trace:
1. `console.log("1: Synchronous")` runs on Call Stack $\to$ **Logs `1: Synchronous`**.
2. `setTimeout` registers timer with Web APIs $\to$ callback enters **Macrotask Queue**.
3. `Promise.resolve().then(...)` schedules callback in **Microtask Queue**.
4. `queueMicrotask(...)` schedules callback in **Microtask Queue**.
5. `console.log("6: Synchronous End")` runs on Call Stack $\to$ **Logs `6: Synchronous End`**.
6. **Call Stack is now empty!** The Event Loop checks the **Microtask Queue**:
   - Executes Promise callback $\to$ **Logs `3: Promise 1 (Microtask)`** (schedules second `.then`).
   - Executes `queueMicrotask` callback $\to$ **Logs `5: queueMicrotask`**.
   - Executes second `.then` $\to$ **Logs `4: Promise 2 (Microtask)`**.
7. **Microtask Queue is empty!** The Event Loop picks up **1 Macrotask**:
   - Executes setTimeout callback $\to$ **Logs `2: Timeout (Macrotask)`**.

**Final Output Order:**
```
1: Synchronous
6: Synchronous End
3: Promise 1 (Microtask)
5: queueMicrotask
4: Promise 2 (Microtask)
2: Timeout (Macrotask)
```

---

# Hands-On Practice Challenges & Solutions

### Challenge: Promise Timeout Wrapper
**Task**: Build a `timeoutPromise(promise, ms)` utility that rejects with `"Operation timed out"` if the target promise does not settle within `ms` milliseconds.

<details>
<summary>👉 View Solution</summary>

```javascript
function timeoutPromise(promise, ms) {
  let timerId;
  const timeout = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timerId); // Cleanup timer on fast resolution
  });
}

// Verification:
const fastTask = new Promise(res => setTimeout(() => res("Done!"), 50));
timeoutPromise(fastTask, 100).then(console.log); // "Done!"

const slowTask = new Promise(res => setTimeout(() => res("Late"), 200));
timeoutPromise(slowTask, 100).catch(err => console.log(err.message)); 
// "Operation timed out after 100ms"
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 9: Working With Servers 🌍](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/09-working-with-servers.md)** to master APIs, HTTP Methods (GET, POST, PUT, PATCH, DELETE), Status Codes, the Fetch API, Headers, Authentication, and JSON serialization.
