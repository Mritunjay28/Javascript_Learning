# Phase 12: TypeScript 🔷

> **Goal**: Transition from dynamic JavaScript to enterprise-grade TypeScript. Master static typing, interfaces, type aliases, union types, discriminated unions, generic abstractions, and utility types.

---

## Table of Contents
1. [Why TypeScript? (JavaScript vs TypeScript)](#why-typescript-javascript-vs-typescript)
2. [Fundamental Type System](#fundamental-type-system)
   - [2.1 Primitives, `any`, `unknown`, and `never`](#21-primitives-any-unknown-and-never)
   - [2.2 Type Annotations vs Type Inference](#22-type-annotations-vs-type-inference)
3. [Interfaces vs Type Aliases](#interfaces-vs-type-aliases)
   - [3.1 Type Aliases (`type`)](#31-type-aliases-type)
   - [3.2 Interfaces (`interface`)](#32-interfaces-interface)
   - [3.3 When to use which & Declaration Merging](#33-when-to-use-which--declaration-merging)
4. [Unions, Intersections & Type Narrowing](#unions-intersections--type-narrowing)
   - [4.1 Union Types (`|`) & Intersection Types (`&`)](#41-union-types--intersection-types-)
   - [4.2 Type Guards (`typeof`, `instanceof`, `in`)](#42-type-guards-typeof-instanceof-in)
   - [4.3 Discriminated Unions (The Gold Standard for State)](#43-discriminated-unions-the-gold-standard-for-state)
5. [Generics Deep-Dive](#generics-deep-dive)
   - [5.1 Generic Functions & Interfaces](#51-generic-functions--interfaces)
   - [5.2 Generic Constraints (`extends`)](#52-generic-constraints-extends)
6. [Essential Utility Types](#essential-utility-types)
   - [Partial, Required, Readonly, Pick, Omit, Record](#partial-required-readonly-pick-omit-record)
7. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Why TypeScript? (JavaScript vs TypeScript)

JavaScript is dynamically typed: types are checked at runtime. If a typo or incorrect argument type exists, it crashes in production.

**TypeScript** is a typed superset of JavaScript developed by Microsoft:
- Adds **compile-time static type checking**.
- **Erased at compilation**: TypeScript emits pure JavaScript; types have **zero runtime overhead**.
- Provides superior IDE autocompletion, instant refactoring, and automated documentation.

---

# Fundamental Type System

### 2.1 Primitives, `any`, `unknown`, and `never`

```typescript
// Primitives:
let score: number = 95;
let username: string = "alex_dev";
let isActive: boolean = true;
let emptyVal: null = null;
let notSet: undefined = undefined;

// Special Types:
// 1. any: Disables type checking completely (Avoid unless migrating legacy code!)
let wildCard: any = "hello";
wildCard.nonExistentMethod(); // Compiles, but crashes at runtime!

// 2. unknown: Type-safe counterpart to any. Forces type checking before use!
let safeInput: unknown = "secure message";
// safeInput.toUpperCase(); // ❌ Compile Error: Object is of type 'unknown'.
if (typeof safeInput === "string") {
  console.log(safeInput.toUpperCase()); // ✅ Safe! Narrowed to string.
}

// 3. never: Represents values that NEVER occur (functions that throw or infinite loops)
function throwFatalError(msg: string): never {
  throw new Error(`Fatal: ${msg}`);
}

// 4. void: Represents functions that return nothing
function logInfo(msg: string): void {
  console.log(msg);
}
```

---

### 2.2 Type Annotations vs Type Inference
TypeScript features powerful inference. You do **not** need to manually annotate obvious variables:

```typescript
// Redundant:
let counter: number = 0;

// Idiomatic (Inferred as number automatically):
let counter = 0;
```

---

# Interfaces vs Type Aliases

### 3.1 Type Aliases (`type`)
Can represent primitives, unions, tuples, and objects:

```typescript
type ID = string | number; // Union of primitives
type Point = [number, number]; // Tuple
type Coordinates = {
  x: number;
  y: number;
};
```

---

### 3.2 Interfaces (`interface`)
Designed specifically to define the shape of objects and classes:

```typescript
interface User {
  readonly id: number; // Cannot be reassigned after creation
  name: string;
  email: string;
  avatarUrl?: string;  // Optional property
}

// Interfaces can extend each other:
interface Admin extends User {
  permissions: string[];
}
```

---

### 3.3 Declaration Merging (Interfaces only)
If you declare an interface twice with the same name, TypeScript merges them:

```typescript
interface Cart {
  items: string[];
}

interface Cart {
  total: number;
}

// Merged into: { items: string[]; total: number; }
const myCart: Cart = { items: ["Book"], total: 20 };
```

---

# Unions, Intersections & Type Narrowing

### 4.1 Union Types & Intersection Types

```typescript
// Union (OR):
type Status = "idle" | "loading" | "success" | "error";

// Intersection (AND):
type Timestamps = { createdAt: Date; updatedAt: Date };
type Post = { id: string; title: string } & Timestamps;

const blogPost: Post = {
  id: "101",
  title: "Mastering TS",
  createdAt: new Date(),
  updatedAt: new Date()
};
```

---

### 4.2 Type Guards & 4.3 Discriminated Unions

#### The Discriminated Union Pattern (Production Standard for State):
Use a shared literal property (the "discriminant") to allow 100% type-safe conditional branching:

```typescript
type ApiResponse =
  | { status: "loading" }
  | { status: "success"; data: { id: number; title: string } }
  | { status: "error"; error: string };

function renderUI(state: ApiResponse) {
  switch (state.status) {
    case "loading":
      return "Loading spinner...";
    case "success":
      // TS knows 'data' exists ONLY inside this block:
      return `Loaded: ${state.data.title}`;
    case "error":
      // TS knows 'error' exists ONLY inside this block:
      return `Failed: ${state.error}`;
  }
}
```

---

# Generics Deep-Dive

Generics allow writing flexible, reusable code that maintains type safety across various data types.

### 5.1 Generic Functions
```typescript
// T is a type parameter placeholder:
function getFirstElement<T>(array: T[]): T | undefined {
  return array[0];
}

const num = getFirstElement([10, 20, 30]); // Type inferred as number
const str = getFirstElement(["a", "b", "c"]); // Type inferred as string
```

---

### 5.2 Generic Constraints (`extends`)
Restrict what types can be passed to a Generic:

```typescript
interface HasId {
  id: string | number;
}

// T MUST have an 'id' property:
function printId<T extends HasId>(entity: T): void {
  console.log(`Entity ID: ${entity.id}`);
}

printId({ id: 101, name: "Project Alpha" }); // ✅ Valid
// printId({ name: "Invalid" }); // ❌ Compile Error: Property 'id' is missing
```

---

# Essential Utility Types

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

// 1. Partial<T>: Makes all properties optional (great for updates)
type ProductUpdateInput = Partial<Product>;

// 2. Required<T>: Makes all properties mandatory
type StrictProduct = Required<Product>;

// 3. Readonly<T>: Freezes all properties from reassignment
type ImmutableProduct = Readonly<Product>;

// 4. Pick<T, K>: Picks specific properties
type ProductPreview = Pick<Product, "id" | "name">;

// 5. Omit<T, K>: Omits specific properties
type NewProductDraft = Omit<Product, "id">;

// 6. Record<K, T>: Creates an object type with specific key and value types
type Inventory = Record<string, number>;
const stock: Inventory = { "SKU-001": 50, "SKU-002": 12 };
```

---

# Hands-On Practice Challenges & Solutions

### Challenge: Type-Safe API Fetcher with Generics
**Task**: Write a generic TypeScript function `fetchApi<T>(url: string): Promise<T>` that performs a `fetch`, validates `res.ok`, and returns typed data.

<details>
<summary>👉 View Solution</summary>

```typescript
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const data: T = await response.json();
  return data;
}

// Usage:
interface UserProfile {
  id: number;
  name: string;
  email: string;
}

async function loadProfile() {
  // data is strictly typed as UserProfile:
  const profile = await fetchApi<UserProfile>("https://api.example.com/me");
  console.log(profile.email);
}
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 13: Real Development 🚀](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/13-real-development.md)** to complete your mastery with Debugging, Chrome DevTools, Testing (Unit, Integration), ESLint/Prettier, Clean Architecture, Performance Profiling, and Web Security fundamentals.
