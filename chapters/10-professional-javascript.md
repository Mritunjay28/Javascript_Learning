# Phase 10: Professional JavaScript 💼

> **Goal**: Master production-grade JavaScript tooling and system design: ES Modules, Error Architecture & Custom Errors, Client-Side Storage engines, and Node.js backend fundamentals.

---

## Table of Contents
1. [Module 23: The Module System](#module-23-the-module-system)
   - [23.1 Evolution: IIFE to CommonJS to ES Modules (ESM)](#231-evolution-iife-to-commonjs-to-es-modules-esm)
   - [23.2 Named vs Default Exports](#232-named-vs-default-exports)
   - [23.3 Dynamic Imports & Code Splitting](#233-dynamic-imports--code-splitting)
   - [23.4 `<script type="module">` Browser Behavior](#234-script-typemodule-browser-behavior)
2. [Module 24: Professional Error Handling Architecture](#module-24-professional-error-handling-architecture)
   - [24.1 Anatomy of an Error Object & Error Cause (ES2022)](#241-anatomy-of-an-error-object--error-cause-es2022)
   - [24.2 Custom Error Classes](#242-custom-error-classes)
   - [24.3 Global Uncaught Error Catchers](#243-global-uncaught-error-catchers)
3. [Module 25: Client-Side Storage](#module-25-client-side-storage)
   - [25.1 LocalStorage vs SessionStorage vs Cookies vs IndexedDB](#251-localstorage-vs-sessionstorage-vs-cookies-vs-indexeddb)
   - [25.2 Type-Safe Storage Wrapper Pattern](#252-type-safe-storage-wrapper-pattern)
4. [Module 26: Node.js Core Fundamentals](#module-26-nodejs-core-fundamentals)
   - [26.1 Node.js Architecture (V8 + libuv)](#261-nodejs-architecture-v8--libuv)
   - [26.2 npm & `package.json`](#262-npm--packagejson)
   - [26.3 Asynchronous File System (`fs/promises`)](#263-asynchronous-file-system-fspromises)
   - [26.4 Environment Variables & Process Lifecycle](#264-environment-variables--process-lifecycle)
5. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 23: The Module System

### 23.1 Evolution: IIFE to CommonJS to ES Modules
- **IIFEs (1995-2009)**: Wrapped code in `(function() { ... })()` to prevent global scope pollution.
- **CommonJS (2009)**: Used by Node.js (`require()` and `module.exports`). Synchronous loading, designed for servers with local disk filesystems.
- **ES Modules (ESM - 2015+)**: Official ECMAScript standard (`import` and `export`). Static structure allows tree-shaking and asynchronous loading across networks.

---

### 23.2 Named vs Default Exports

```javascript
// mathUtils.js

// 1. Named Exports (Preferred for libraries with multiple utilities):
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// 2. Default Export (One per file, represents the primary entity):
export default class Calculator {
  compute() { return "Computing..."; }
}
```

```javascript
// app.js - Importing

// Named imports must match exported names (or be renamed with 'as'):
import Calculator, { PI, add as sum, multiply } from "./mathUtils.js";

// Import all as namespace:
import * as MathLib from "./mathUtils.js";
console.log(MathLib.PI); // 3.14159
```

---

### 23.3 Dynamic Imports
Enables **Code Splitting** by loading JavaScript bundles on demand:

```javascript
async function loadChartComponent() {
  // Returns a Promise that resolves to the module namespace:
  const { Chart } = await import("./analytics/chart.js");
  const chart = new Chart();
  chart.render();
}

button.addEventListener("click", loadChartComponent);
```

---

### 23.4 `<script type="module">` Browser Behavior
1. **Always runs in Strict Mode (`"use strict"`)** automatically.
2. **Has its own module scope** (variables never leak onto `window`).
3. **Deferred by default** (downloads in parallel, executes after HTML parsing completes).
4. **Enforces CORS** (cannot load from `file://` protocols without a local HTTP server).

---

# Module 24: Professional Error Handling Architecture

### 24.1 Anatomy of an Error & `cause` (ES2022)
```javascript
const error = new Error("Something went wrong");
console.log(error.name);    // "Error"
console.log(error.message); // "Something went wrong"
console.log(error.stack);   // Full stack trace

// Error Chaining with 'cause':
try {
  databaseConnect();
} catch (dbError) {
  // Wrap low-level error in high-level domain error while preserving cause:
  throw new Error("User service unavailable", { cause: dbError });
}
```

---

### 24.2 Custom Error Classes
In production, use semantic error subclasses to allow precise `catch` differentiation:

```javascript
class DomainError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class ValidationError extends DomainError {
  constructor(field, message) {
    super(`Validation failed on '${field}': ${message}`);
    this.field = field;
    this.statusCode = 400;
  }
}

class NotFoundError extends DomainError {
  constructor(resource, id) {
    super(`Resource '${resource}' with ID ${id} not found`);
    this.statusCode = 404;
  }
}

// Consuming custom errors:
try {
  throw new ValidationError("email", "Must be a valid email format");
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(`Status ${err.statusCode}: Field '${err.field}' is invalid`);
  } else {
    console.error("Unknown server fault");
  }
}
```

---

# Module 25: Client-Side Storage

| Technology | Capacity | Expiry | Accessible By | Ideal For |
| :--- | :--- | :--- | :--- | :--- |
| **LocalStorage** | ~5-10 MB | Never (until cleared) | JavaScript only | User UI preferences, theme |
| **SessionStorage** | ~5 MB | Closes with tab | JavaScript only | Wizard state, single-session data |
| **Cookies** | ~4 KB | Configurable date | Server & JS (unless `HttpOnly`) | Session tokens, auth cookies |
| **IndexedDB** | >500 MB | Never | JavaScript only (Async) | Large offline data, media, PWA |

---

# Module 26: Node.js Core Fundamentals

### 26.1 Node.js Architecture
Node.js combines Google V8 with **`libuv`**, an asynchronous event-driven C library providing a cross-platform thread pool for file system operations, networking, and DNS lookups.

---

### 26.2 Modern File System Operations (`fs/promises`)

```javascript
import fs from "node:fs/promises";
import path from "node:path";

async function manageConfig() {
  const filePath = path.resolve("settings.json");

  // 1. Writing formatted JSON:
  const config = { environment: "production", port: 8080 };
  await fs.writeFile(filePath, JSON.stringify(config, null, 2), "utf-8");
  console.log("File saved!");

  // 2. Reading and parsing JSON:
  const rawData = await fs.readFile(filePath, "utf-8");
  const loadedConfig = JSON.parse(rawData);
  console.log(`Port: ${loadedConfig.port}`);
}
```

---

### 26.3 Environment Variables
```javascript
// Accessing environment variables:
const port = process.env.PORT ?? 3000;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.warn("⚠️ Warning: DATABASE_URL is not set. Using local in-memory mock.");
}
```

---

# Hands-On Practice Challenges & Solutions

### Challenge: Safe Type-Safe LocalStorage Adapter
**Task**: Build a `StorageAdapter` class that serializes/deserializes JSON automatically, supports expiry TTL (Time-To-Live in milliseconds), and gracefully fails if LocalStorage quota is exceeded.

<details>
<summary>👉 View Solution</summary>

```javascript
class StorageAdapter {
  constructor(storage = typeof localStorage !== "undefined" ? localStorage : null) {
    this.storage = storage;
  }

  set(key, value, ttlMs = null) {
    if (!this.storage) return;
    const payload = {
      value,
      expiry: ttlMs ? Date.now() + ttlMs : null
    };
    try {
      this.storage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      console.error("Storage quota exceeded or disabled:", e);
    }
  }

  get(key) {
    if (!this.storage) return null;
    const itemStr = this.storage.getItem(key);
    if (!itemStr) return null;

    try {
      const payload = JSON.parse(itemStr);
      if (payload.expiry && Date.now() > payload.expiry) {
        this.storage.removeItem(key); // Expired!
        return null;
      }
      return payload.value;
    } catch {
      return null;
    }
  }

  remove(key) {
    this.storage?.removeItem(key);
  }
}
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 11: Advanced JavaScript 🧠🔥](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/11-advanced-javascript.md)** to master Garbage Collection algorithms, Memory Leaks, Deep Copy engines, Debouncing, Throttling, Recursion, and Gang-of-Four Design Patterns in JavaScript.
