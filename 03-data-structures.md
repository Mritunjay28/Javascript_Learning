# Phase 3: Data Structures 🔥

> **Goal**: Master JavaScript's fundamental and modern collections: Arrays (mutating vs non-mutating methods, functional iteration algorithms), Objects (property descriptors, integrity methods), and keyed collections (Map, Set, WeakMap, WeakSet).

---

## Table of Contents
1. [Module 6: Arrays In-Depth](#module-6-arrays-in-depth)
   - [6.1 Array Creation & Memory Representation](#61-array-creation--memory-representation)
   - [6.2 Element Access & The `.at()` Method](#62-element-access--the-at-method)
   - [6.3 Mutating Methods (push, pop, shift, unshift, splice, reverse, sort)](#63-mutating-methods)
   - [6.4 Non-Mutating Methods (slice, concat, toSorted, toReversed, toSpliced, with)](#64-non-mutating-methods)
   - [6.5 Iteration Algorithms: map, filter, reduce, find, findIndex, some, every](#65-iteration-algorithms)
   - [6.6 Sorting Mechanics & Comparator Functions](#66-sorting-mechanics--comparator-functions)
   - [6.7 Flattening: flat & flatMap](#67-flattening-flat--flatmap)
2. [Module 7: Objects In-Depth](#module-7-objects-in-depth)
   - [7.1 Object Creation & Property Access](#71-object-creation--property-access)
   - [7.2 Computed Property Names & Shorthand Syntax](#72-computed-property-names--shorthand-syntax)
   - [7.3 Property Deletion & The `delete` Operator](#73-property-deletion--the-delete-operator)
   - [7.4 Object Static Methods: keys, values, entries, fromEntries](#74-object-static-methods)
   - [7.5 Property Descriptors & Getters/Setters](#75-property-descriptors--getterssetters)
   - [7.6 Object Integrity: freeze, seal, preventExtensions](#76-object-integrity)
3. [Keyed Collections: Map, Set, WeakMap, WeakSet](#keyed-collections-map-set-weakmap-weakset)
4. [Common Pitfalls & Traps](#common-pitfalls--traps)
5. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 6: Arrays In-Depth

### 6.1 Array Creation & Memory Representation
In JavaScript, arrays are not low-level contiguous memory buffers like in C. They are specialized objects whose keys are stringified numeric indices (`"0"`, `"1"`, etc.), equipped with automatic `.length` tracking and inherited methods from `Array.prototype`.

```javascript
// 1. Array Literal (Standard & Preferred):
const fruits = ["Apple", "Banana", "Orange"];

// 2. Array Constructor:
const emptySlots = new Array(3); // Creates sparse array with 3 empty slots!
console.log(emptySlots);         // [ <3 empty slots> ]
console.log(emptySlots.length);  // 3

// 3. Array.of (ES6) - Solves the single-argument ambiguity of new Array:
const singleElement = Array.of(3); // [ 3 ]

// 4. Array.from (ES6) - Converts array-like or iterables to genuine arrays:
const chars = Array.from("HELLO"); // [ 'H', 'E', 'L', 'L', 'O' ]
const range = Array.from({ length: 5 }, (_, i) => i + 1); // [ 1, 2, 3, 4, 5 ]
```

---

### 6.2 Element Access & The `.at()` Method
Traditionally, bracket notation `arr[arr.length - 1]` was required to read from the end of an array. ES2022 introduced `.at()` which supports relative negative indexing:

```javascript
const items = ["A", "B", "C", "D", "E"];

// Traditional:
console.log(items[items.length - 1]); // "E"

// Modern .at():
console.log(items.at(0));  // "A"
console.log(items.at(-1)); // "E" (last item)
console.log(items.at(-2)); // "D" (second to last)
```

---

### 6.3 Mutating Methods
These methods modify the original array in place (side effects!):

```javascript
const list = [10, 20, 30];

// push & pop (Operate at the END - O(1) amortized performance)
list.push(40, 50); // Returns new length (5). list is now [10, 20, 30, 40, 50]
const last = list.pop(); // Returns removed item (50). list is [10, 20, 30, 40]

// unshift & shift (Operate at the START - O(n) performance because all elements shift index!)
list.unshift(0);   // Returns new length (5). list is [0, 10, 20, 30, 40]
const first = list.shift(); // Returns 0. list is [10, 20, 30, 40]

// splice (start, deleteCount, ...itemsToAdd)
// Modifies in place AND returns array of deleted elements:
const deleted = list.splice(1, 2, 99, 100); 
console.log(deleted); // [ 20, 30 ]
console.log(list);    // [ 10, 99, 100, 40 ]

// reverse
list.reverse(); // [ 40, 100, 99, 10 ]
```

---

### 6.4 Non-Mutating Methods
To follow immutable and functional programming practices, modern JavaScript introduced immutable counterparts (ES2023):

```javascript
const original = [3, 1, 4, 1, 5];

// Traditional Non-Mutating:
const sliced = original.slice(1, 4); // [ 1, 4, 1 ] (does not touch original)
const combined = original.concat([9, 2]); // [ 3, 1, 4, 1, 5, 9, 2 ]

// Modern ES2023 Non-Mutating equivalents:
const sorted = original.toSorted((a, b) => a - b);
console.log(sorted);   // [ 1, 1, 3, 4, 5 ]
console.log(original); // [ 3, 1, 4, 1, 5 ] (Untouched!)

const reversed = original.toReversed(); // [ 5, 1, 4, 1, 3 ]
const spliced = original.toSpliced(1, 2, 99); // [ 3, 99, 1, 5 ]
const replaced = original.with(0, 999); // [ 999, 1, 4, 1, 5 ]
```

---

### 6.5 Iteration Algorithms
JavaScript provides declarative, expressive array methods:

```javascript
const users = [
  { id: 1, name: "Alice", active: true, score: 85 },
  { id: 2, name: "Bob", active: false, score: 62 },
  { id: 3, name: "Charlie", active: true, score: 95 },
  { id: 4, name: "Dana", active: true, score: 73 }
];

// 1. map() -> Transforms each item into a new array:
const names = users.map(u => u.name); // [ 'Alice', 'Bob', 'Charlie', 'Dana' ]

// 2. filter() -> Selects items satisfying the predicate:
const activeUsers = users.filter(u => u.active);

// 3. reduce() -> Accumulates array into a single value/structure:
const totalScore = users.reduce((sum, u) => sum + u.score, 0); // 315

// 4. find() -> Returns the FIRST matching item, or undefined:
const topStudent = users.find(u => u.score > 90); // Charlie

// 5. findIndex() -> Returns index of first match, or -1:
const bobIndex = users.findIndex(u => u.name === "Bob"); // 1

// 6. some() -> Returns true if AT LEAST ONE item satisfies condition:
const hasFailingUser = users.some(u => u.score < 65); // true

// 7. every() -> Returns true if ALL items satisfy condition:
const allPassed = users.every(u => u.score >= 50); // true
```

---

### 6.6 Sorting Mechanics & Comparator Functions
By default, `.sort()` converts all elements to **strings** and sorts them in **lexicographical (UTF-16 code unit)** order!

```javascript
// ⚠️ THE DEFAULT SORT TRAP:
const nums = [10, 5, 40, 25, 100, 1];
nums.sort();
console.log(nums); // [ 1, 10, 100, 25, 40, 5 ] ❌ (Sorted as strings!)
```

#### Proper Numerical Comparator:
```javascript
// Ascending Order: (a - b)
// If negative: 'a' comes first
// If positive: 'b' comes first
// If 0: order remains unchanged
const ascending = [10, 5, 40, 25, 100, 1].sort((a, b) => a - b);
console.log(ascending); // [ 1, 5, 10, 25, 40, 100 ] ✅

// Descending Order: (b - a)
const descending = [10, 5, 40, 25, 100, 1].sort((a, b) => b - a);
console.log(descending); // [ 100, 40, 25, 10, 5, 1 ] ✅
```

---

### 6.7 Flattening: flat & flatMap

```javascript
// flat(depth): Flattens nested arrays up to specified depth (default 1, Infinity for all)
const nested = [1, [2, [3, [4]]]];
console.log(nested.flat());          // [ 1, 2, [ 3, [ 4 ] ] ]
console.log(nested.flat(Infinity));  // [ 1, 2, 3, 4 ]

// flatMap: Maps each element using a mapping function, then flattens result by depth 1:
const sentences = ["Hello world", "JavaScript is awesome"];
const words = sentences.flatMap(s => s.split(" "));
console.log(words); // [ 'Hello', 'world', 'JavaScript', 'is', 'awesome' ]
```

---

# Module 7: Objects In-Depth

### 7.1 Object Creation & Property Access
```javascript
const keyName = "favoriteColor";

const person = {
  name: "Alex",
  age: 31,
  "home address": "123 Main St", // Quoted keys for spaces/special chars
  [keyName]: "teal"               // Computed property name
};

// Dot Notation (fast, for static identifier keys):
console.log(person.name); // "Alex"

// Bracket Notation (mandatory for dynamic keys, variables, or special characters):
console.log(person["home address"]); // "123 Main St"
console.log(person[keyName]);        // "teal"
```

---

### 7.2 Computed Property Names & Shorthand Syntax
```javascript
const prefix = "user_";
const role = "admin";
const id = 101;

const account = {
  // Property shorthand (when key and variable name match):
  id,
  role,
  // Computed property keys:
  [`${prefix}${id}`]: "Active Account"
};

console.log(account); // { id: 101, role: 'admin', user_101: 'Active Account' }
```

---

### 7.3 Property Deletion & The `delete` Operator
```javascript
const settings = { theme: "dark", volume: 80, autoSave: true };

// The delete operator removes the property from the object:
delete settings.volume;
console.log(settings); // { theme: 'dark', autoSave: true }

// Note: delete returns true unless property is non-configurable
```

---

### 7.4 Object Static Methods
```javascript
const stats = { speed: 85, defense: 60, attack: 92 };

// 1. Keys:
console.log(Object.keys(stats)); // [ 'speed', 'defense', 'attack' ]

// 2. Values:
console.log(Object.values(stats)); // [ 85, 60, 92 ]

// 3. Entries (Array of [key, value] pairs):
console.log(Object.entries(stats)); 
// [ [ 'speed', 85 ], [ 'defense', 60 ], [ 'attack', 92 ] ]

// 4. fromEntries (Reverses entries back into an object):
const modifiedEntries = Object.entries(stats).map(([key, val]) => [key, val * 1.1]);
const boostedStats = Object.fromEntries(modifiedEntries);
console.log(boostedStats); // { speed: 93.5, defense: 66, attack: 101.2 }
```

---

### 7.5 Property Descriptors & Getters/Setters
Every property in an object has internal descriptor attributes:
- `value`: The actual data value.
- `writable`: If `true`, the value can be changed.
- `enumerable`: If `true`, visible in `for...in` and `Object.keys()`.
- `configurable`: If `true`, the property can be deleted or its descriptor modified.

```javascript
const car = {};

Object.defineProperty(car, "vin", {
  value: "1HGCR2F83HA000000",
  writable: false,      // Read-only!
  enumerable: true,
  configurable: false   // Cannot delete or redefine!
});

// car.vin = "changed"; // Silently fails in non-strict, TypeError in strict mode!
// delete car.vin;      // Fails
console.log(car.vin);   // "1HGCR2F83HA000000"

// Getters and Setters:
const wallet = {
  _balance: 100,
  get balance() {
    return `$${this._balance.toFixed(2)}`;
  },
  set balance(amount) {
    if (amount < 0) throw new Error("Balance cannot be negative");
    this._balance = amount;
  }
};
console.log(wallet.balance); // "$100.00"
wallet.balance = 250;
console.log(wallet.balance); // "$250.00"
```

---

### 7.6 Object Integrity: freeze, seal, preventExtensions

| Method | Add New Properties? | Delete Properties? | Modify Existing Values? |
| :--- | :---: | :---: | :---: |
| `Object.preventExtensions(obj)` | ❌ No | ✅ Yes | ✅ Yes |
| `Object.seal(obj)` | ❌ No | ❌ No | ✅ Yes |
| `Object.freeze(obj)` | ❌ No | ❌ No | ❌ No |

```javascript
const frozen = Object.freeze({ token: "XYZ" });
// frozen.token = "ABC"; // Error in strict mode!
console.log(Object.isFrozen(frozen)); // true
```

> [!WARNING]
> `Object.freeze()` is **shallow**! Nested objects are NOT frozen unless recursively frozen.

---

# Keyed Collections: Map, Set, WeakMap, WeakSet

### Map vs Plain Object
- **Object**: Keys must be `string` or `symbol`. Order was historically arbitrary. Has prototype pollution risk.
- **Map**: Keys can be **any type** (including objects, functions, or numbers). Maintains insertion order. Has built-in `.size`.

```javascript
const map = new Map();
const objKey = { id: 1 };

map.set(objKey, "Metadata for object 1");
map.set(42, "Answer");

console.log(map.get(objKey)); // "Metadata for object 1"
console.log(map.has(42));      // true
console.log(map.size);        // 2
```

### Set (Unique Collections)
```javascript
// Automatically eliminates duplicates:
const rawTags = ["tech", "ai", "cloud", "tech", "web", "ai"];
const uniqueTags = [...new Set(rawTags)];
console.log(uniqueTags); // [ 'tech', 'ai', 'cloud', 'web' ]
```

### WeakMap & WeakSet
- Keys in a `WeakMap` and values in a `WeakSet` **must be objects**.
- References are held **weakly**: if no other reference to the object exists, it is eligible for garbage collection!
- Not iterable (no `.size`, no `for...of`). Ideal for storing private state or metadata without memory leaks.

---

# Common Pitfalls & Traps

### Trap 1: Shallow Copy Mutation
```javascript
const original = { name: "Alice", preferences: { theme: "dark" } };
const copy = { ...original }; // Shallow spread copy

copy.preferences.theme = "light";
console.log(original.preferences.theme); // "light" ❌ (Nested object reference was shared!)
```
**Fix**: Use modern `structuredClone()` for true deep copies:
```javascript
const deepCopy = structuredClone(original);
deepCopy.preferences.theme = "high-contrast";
console.log(original.preferences.theme); // "light" (Untouched!)
```

### Trap 2: Modifying an Array While Iterating with `forEach`
```javascript
const arr = [1, 2, 3, 4];
arr.forEach((num, idx) => {
  if (num === 2) arr.splice(idx, 1);
});
console.log(arr); // [ 1, 3, 4 ] (Skipped checking 3 due to shifted index!)
```

---

# Hands-On Practice Challenges & Solutions

### Challenge 1: Group By Utility (Data Transformation)
**Task**: Write an `aggregateBy(array, keyOrFn)` function that groups array elements into an object keyed by the extracted property or function result (similar to modern `Object.groupBy`).

```javascript
const inventory = [
  { name: "Asparagus", type: "vegetables", quantity: 5 },
  { name: "Banana", type: "fruit", quantity: 0 },
  { name: "Goat", type: "meat", quantity: 23 },
  { name: "Cherries", type: "fruit", quantity: 5 }
];
```

<details>
<summary>👉 View Solution</summary>

```javascript
function aggregateBy(array, keyOrFn) {
  return array.reduce((acc, item) => {
    const key = typeof keyOrFn === "function" ? keyOrFn(item) : item[keyOrFn];
    // Safe against prototype property collisions (like 'toString'):
    if (!Object.hasOwn(acc, key)) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

// Verification:
const inventory = [
  { name: "Asparagus", type: "vegetables", quantity: 5 },
  { name: "Banana", type: "fruit", quantity: 0 },
  { name: "Goat", type: "meat", quantity: 23 },
  { name: "Cherries", type: "fruit", quantity: 5 }
];

const grouped = aggregateBy(inventory, "type");
console.log(grouped);
// Output:
// {
//   vegetables: [ { name: 'Asparagus', ... } ],
//   fruit: [ { name: 'Banana', ... }, { name: 'Cherries', ... } ],
//   meat: [ { name: 'Goat', ... } ]
// }
```
</details>

---

### Challenge 2: Deep Freeze Utility
**Task**: Build a `deepFreeze(object)` function that recursively freezes the target object and all nested object properties to make it genuinely immutable, with protection against circular references.

<details>
<summary>👉 View Solution</summary>

```javascript
function deepFreeze(obj, seen = new WeakSet()) {
  // Primitives, functions or already visited objects:
  if (!obj || (typeof obj !== "object" && typeof obj !== "function") || seen.has(obj)) {
    return obj;
  }
  seen.add(obj);

  // Retrieve all property names (including non-enumerable & symbols) defined directly on obj:
  const propNames = Reflect.ownKeys(obj);

  for (const name of propNames) {
    const val = obj[name];
    if (val && (typeof val === "object" || typeof val === "function")) {
      deepFreeze(val, seen);
    }
  }

  return Object.freeze(obj);
}

// Verification:
const config = deepFreeze({
  api: {
    endpoints: {
      auth: "/login"
    }
  }
});

console.log(Object.isFrozen(config.api.endpoints)); // true
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 4: Modern JavaScript (ES6+) ⚡](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/04-modern-javascript-es6.md)** to master Destructuring, Spread/Rest operators, Optional Chaining, Nullish Coalescing, and Enhanced Object Literals.
