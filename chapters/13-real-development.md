# Phase 13: Real Development 🚀

> **Goal**: Master professional engineering workflows: Chrome DevTools debugging, ESLint & Prettier static analysis, automated testing (Unit & Integration with Vitest/Jest), Clean Architecture, performance optimization, and Web Application Security essentials.

---

## Table of Contents
1. [Debugging & Chrome DevTools Mastery](#debugging--chrome-devtools-mastery)
   - [1.1 Advanced Console APIs](#11-advanced-console-apis)
   - [1.2 Breakpoints & Call Stack Inspection](#12-breakpoints--call-stack-inspection)
   - [1.3 Network & Memory Profiling](#13-network--memory-profiling)
2. [Code Quality & Tooling](#code-quality--tooling)
   - [2.1 ESLint vs Prettier](#21-eslint-vs-prettier)
   - [2.2 Git Hooks & Automated Pre-Commit Checks](#22-git-hooks--automated-pre-commit-checks)
3. [Automated Testing](#automated-testing)
   - [3.1 The Testing Pyramid (Unit, Integration, E2E)](#31-the-testing-pyramid-unit-integration-e2e)
   - [3.2 Unit Testing with Vitest / Jest](#32-unit-testing-with-vitest--jest)
   - [3.3 Mocking Dependencies](#33-mocking-dependencies)
4. [Clean Code & Project Architecture](#clean-code--project-architecture)
   - [4.1 SOLID Principles Applied to JavaScript](#41-solid-principles-applied-to-javascript)
   - [4.2 Layered vs Feature-Based Folder Architecture](#42-layered-vs-feature-based-folder-architecture)
5. [Web Performance Optimization](#web-performance-optimization)
   - [5.1 Bundle Size & Tree Shaking](#51-bundle-size--tree-shaking)
   - [5.2 Core Web Vitals (LCP, INP, CLS)](#52-core-web-vitals-lcp-inp-cls)
6. [Web Security Fundamentals](#web-security-fundamentals)
   - [6.1 Cross-Site Scripting (XSS) & Defenses](#61-cross-site-scripting-xss--defenses)
   - [6.2 Cross-Site Request Forgery (CSRF) & SameSite Cookies](#62-cross-site-request-forgery-csrf--samesite-cookies)
   - [6.3 Content Security Policy (CSP) & Secure Headers](#63-content-security-policy-csp--secure-headers)

---

# Debugging & Chrome DevTools Mastery

### 1.1 Advanced Console APIs
Stop using `console.log()` for everything:

```javascript
const users = [
  { id: 1, name: "Alice", role: "Admin" },
  { id: 2, name: "Bob", role: "Editor" }
];

// 1. console.table: Formats arrays/objects into clean ASCII tables
console.table(users);

// 2. console.time & console.timeEnd: Precise benchmark timing
console.time("ArrayProcessing");
for (let i = 0; i < 1e6; i++) {}
console.timeEnd("ArrayProcessing"); // "ArrayProcessing: 2.14ms"

// 3. console.group / console.groupEnd: Nested collapsible log blocks
console.group("User Authentication Flow");
console.log("Validating credentials...");
console.log("Generating JWT token...");
console.groupEnd();

// 4. console.trace: Dumps the entire Call Stack up to that point
function deepCall() { console.trace("Tracing execution point"); }
deepCall();
```

---

### 1.2 Breakpoints & Call Stack Inspection
- **`debugger;` statement**: Placing `debugger;` in your code pauses browser execution when DevTools is open.
- **Conditional Breakpoints**: Right-click line number in DevTools $\to$ "Add conditional breakpoint..." (e.g. `userId === 42`).
- **DOM Breakpoints**: Right-click an element in Elements tab $\to$ "Break on..." (Subtree modifications, attribute modifications, or node removal).
- **Scope & Call Stack Panel**: Inspect the exact values of Local variables, Closure scopes, and navigate up the Call Stack.

---

# Code Quality & Tooling

### 2.1 ESLint vs Prettier
- **Prettier** handles **Code Formatting**: Line length, quotes (single vs double), semicolons, trailing commas, and indentation. It does not inspect code semantics.
- **ESLint** handles **Code Quality & Bug Detection**: Catches unused variables, undeclared identifiers, duplicate keys, unreachable code, and enforces best practices.

```json
// Modern eslint.config.js snippet:
export default [
  {
    rules: {
      "no-unused-vars": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "eqeqeq": ["error", "always"] // Enforces === everywhere
    }
  }
];
```

---

# Automated Testing

### 3.1 The Testing Pyramid
```
        / \
       /   \        E2E Tests (Cypress, Playwright) - Slow, high confidence
      /-----\
     /       \      Integration Tests - Test multiple units working together
    /---------\
   /           \    Unit Tests (Vitest, Jest) - Fast, test isolated pure functions
  /-------------\
```

---

### 3.2 Unit Testing with Vitest / Jest

```javascript
// math.js
export function calculateDiscount(price, discountPercent) {
  if (price < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new RangeError("Invalid discount parameters");
  }
  return price - (price * (discountPercent / 100));
}
```

```javascript
// math.test.js
import { describe, it, expect } from "vitest";
import { calculateDiscount } from "./math.js";

describe("calculateDiscount", () => {
  it("applies standard discount correctly", () => {
    const result = calculateDiscount(100, 20);
    expect(result).toBe(80);
  });

  it("handles 0% and 100% boundary discounts", () => {
    expect(calculateDiscount(50, 0)).toBe(50);
    expect(calculateDiscount(50, 100)).toBe(0);
  });

  it("throws RangeError on negative inputs", () => {
    expect(() => calculateDiscount(-10, 10)).toThrow(RangeError);
    expect(() => calculateDiscount(100, 150)).toThrow(RangeError);
  });
});
```

---

# Clean Code & Project Architecture

### 4.1 SOLID Principles Applied to JavaScript
1. **Single Responsibility Principle (SRP)**: A function or module should have one, and only one, reason to change.
2. **Open/Closed Principle (OCP)**: Entities should be open for extension, but closed for modification.
3. **Liskov Substitution Principle (LSP)**: Subclasses must be substitutable for their base class without altering program correctness.
4. **Interface Segregation Principle (ISP)**: Clients should not be forced to depend on methods they do not use.
5. **Dependency Inversion Principle (DIP)**: High-level modules should depend on abstractions/interfaces, not low-level concrete details.

---

### 4.2 Feature-Based Directory Architecture (Recommended)
Instead of grouping by file type (`/controllers`, `/models`, `/views`), group by business feature:

```
src/
├── features/
│   ├── auth/
│   │   ├── api/          # fetch login, register calls
│   │   ├── components/   # LoginForm.js, AuthButton.js
│   │   ├── services/     # tokenStorage.js
│   │   └── types/        # auth.types.ts
│   └── billing/
│       ├── api/
│       ├── components/
│       └── utils/
├── shared/               # Reusable buttons, modals, http client
└── index.js
```

---

# Web Performance Optimization

### 5.1 Core Web Vitals
1. **LCP (Largest Contentful Paint)**: Measures loading performance. The main content should render within **2.5 seconds**.
2. **INP (Interaction to Next Paint)**: Replaced FID. Measures page responsiveness. User clicks/taps should respond within **200 milliseconds**.
3. **CLS (Cumulative Layout Shift)**: Measures visual stability. Content should not jump around as images load; score should be **< 0.1**.

---

# Web Security Fundamentals

### 6.1 Cross-Site Scripting (XSS)
- **Vulnerability**: Attacker injects malicious JavaScript into your site (e.g. via comments or URL query parameters). When executed, it can steal authentication tokens.
- **Defenses**:
  - Never insert raw untrusted user input into `innerHTML` or `document.write`.
  - Use `textContent` or use sanitization libraries like **DOMPurify**.
  - Store sensitive auth tokens in **`HttpOnly` cookies** so JavaScript cannot read them!

---

### 6.2 Cross-Site Request Forgery (CSRF)
- **Vulnerability**: An attacker tricks an authenticated user's browser into executing an unwanted action on another website where they are currently logged in.
- **Defenses**:
  - Set `SameSite=Strict` or `SameSite=Lax` on authentication cookies.
  - Implement Anti-CSRF verification tokens on sensitive form submissions.

---

### 6.3 Content Security Policy (CSP)
A CSP HTTP response header instructs the browser which domains and script sources are trusted:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.com;
```

---

## 🏆 You Have Reached JavaScript Mastery!
Congratulations! By mastering all 13 phases, you possess the full conceptual, architectural, and practical spectrum of modern JavaScript development: from low-level engine bytecodes to high-level system design.
