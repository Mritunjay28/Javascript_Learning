# 🗺️ JavaScript, from first principles
> **A 13-Chapter Interactive Engineering Reference with Zero-Command Browser Code Execution**

[![Live Demo](https://img.shields.io/badge/Live%20Platform-GitHub%20Pages-FF6436?style=for-the-badge&logo=github&logoColor=white)](https://mritunjay28.github.io/Javascript_Learning/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://mritunjay28.github.io/Javascript_Learning/)
[![Zero Commands](https://img.shields.io/badge/Zero--Command-In--Browser%20Execution-10B981?style=for-the-badge)](https://mritunjay28.github.io/Javascript_Learning/)

🔗 **Live Website**: **[https://mritunjay28.github.io/Javascript_Learning/](https://mritunjay28.github.io/Javascript_Learning/)**

Welcome to the definitive JavaScript mastery handbook and interactive reading platform. Engineered to take you from foundational syntax to runtime mechanics (V8 AST, Call Stack, Memory Heap, Event Loop), clean architecture, and production readiness.

---

## 🚀 Accessing the Platform

### 1. 🌐 Live Online (Recommended)
You can open and share the full interactive platform anywhere on desktop, tablet, or mobile without installing anything:
👉 **[https://mritunjay28.github.io/Javascript_Learning/](https://mritunjay28.github.io/Javascript_Learning/)**

### 2. 💻 Run Locally (100% Offline)
- **Windows Explorer**: Double-click [`start.bat`](start.bat) or open [`index.html`](index.html) directly in any web browser.
- **Node Dev Server**: Run `npm start` and visit `http://localhost:3000/`.
- Runs 100% offline with zero build steps and zero CORS restrictions.

---

## 📚 Curriculum Navigation

| Phase | Title | Focus Area | Status | Live Web App | Markdown Doc |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **01** | **Core JavaScript 🧱** | Engines, Execution Context, Data Types, Stack vs Heap, Operators, Control Flow | 🟢 Ready | [Launch Phase 01](https://mritunjay28.github.io/Javascript_Learning/#chapter-01) | [01-core-javascript.md](chapters/01-core-javascript.md) |
| **02** | **Functions 🧠** | Declarations vs Expressions, Arrow Functions, Scope, Parameters, HOFs, Callbacks | 🟢 Ready | [Launch Phase 02](https://mritunjay28.github.io/Javascript_Learning/#chapter-02) | [02-functions.md](chapters/02-functions.md) |
| **03** | **Data Structures 🔥** | Arrays (Mutating vs Non-mutating), Objects, Maps, Sets, WeakMap & WeakSet | 🟢 Ready | [Launch Phase 03](https://mritunjay28.github.io/Javascript_Learning/#chapter-03) | [03-data-structures.md](chapters/03-data-structures.md) |
| **04** | **Modern JavaScript (ES6+) ⚡** | Destructuring, Rest/Spread, Optional Chaining, Nullish Coalescing, Modern Syntax | 🟢 Ready | [Launch Phase 04](https://mritunjay28.github.io/Javascript_Learning/#chapter-04) | [04-modern-javascript-es6.md](chapters/04-modern-javascript-es6.md) |
| **05** | **How JS Actually Works 🧬** | Execution Context, Call Stack, Scope Chain, Hoisting, TDZ, Closures, `this` Binding | 🟢 Ready | [Launch Phase 05](https://mritunjay28.github.io/Javascript_Learning/#chapter-05) | [05-how-javascript-works.md](chapters/05-how-javascript-works.md) |
| **06** | **Object-Oriented JS 🏗️** | Prototypes, `__proto__`, Prototype Chain, ES6 Classes, Inheritance, `super` | 🟢 Ready | [Launch Phase 06](https://mritunjay28.github.io/Javascript_Learning/#chapter-06) | [06-object-oriented-javascript.md](chapters/06-object-oriented-javascript.md) |
| **07** | **The Browser & DOM 🌐** | DOM Tree, Querying, Event Bubbling & Capturing, Delegation, Performance | 🟢 Ready | [Launch Phase 07](https://mritunjay28.github.io/Javascript_Learning/#chapter-07) | [07-browser-and-dom.md](chapters/07-browser-and-dom.md) |
| **08** | **Asynchronous JavaScript 🚀** | Event Loop, Microtasks vs Macrotasks, Promises, `async`/`await`, Concurrency | 🟢 Ready | [Launch Phase 08](https://mritunjay28.github.io/Javascript_Learning/#chapter-08) | [08-asynchronous-javascript.md](chapters/08-asynchronous-javascript.md) |
| **09** | **Working With Servers 🌍** | HTTP Protocol, REST, Fetch API, Headers, Authentication Tokens, JSON | 🟢 Ready | [Launch Phase 09](https://mritunjay28.github.io/Javascript_Learning/#chapter-09) | [09-working-with-servers.md](chapters/09-working-with-servers.md) |
| **10** | **Professional JavaScript 💼** | ESM Modules, Error Architecture, Storage (Local/Session/Cookies), Node.js Runtime | 🟢 Ready | [Launch Phase 10](https://mritunjay28.github.io/Javascript_Learning/#chapter-10) | [10-professional-javascript.md](chapters/10-professional-javascript.md) |
| **11** | **Advanced JavaScript 🧠🔥** | Memory Leaks, GC Algorithms, Deep Copy, Debounce/Throttle, Design Patterns | 🟢 Ready | [Launch Phase 11](https://mritunjay28.github.io/Javascript_Learning/#chapter-11) | [11-advanced-javascript.md](chapters/11-advanced-javascript.md) |
| **12** | **TypeScript 🔷** | Type System, Interfaces, Generics, Union/Intersection, Type Narrowing | 🟢 Ready | [Launch Phase 12](https://mritunjay28.github.io/Javascript_Learning/#chapter-12) | [12-typescript.md](chapters/12-typescript.md) |
| **13** | **Real Development 🚀** | Debugging, DevTools, Clean Architecture, ESLint/Prettier, Unit Testing, Security | 🟢 Ready | [Launch Phase 13](https://mritunjay28.github.io/Javascript_Learning/#chapter-13) | [13-real-development.md](chapters/13-real-development.md) |

---

## 📁 Repository Organization

```text
learnings/
├── chapters/               # Full 13-phase comprehensive Markdown curriculum
│   ├── 01-core-javascript.md
│   ├── ...
│   └── 13-real-development.md
├── assets/                 # Web application runtime assets
│   ├── css/
│   │   └── style.css       # Design system, responsive layout & dark editorial aesthetic
│   └── js/
│       ├── app.js          # In-browser execution engine, scroll-sync, parser & routing
│       └── chapters-data.js# Pre-bundled curriculum data for zero-CORS offline operation
├── practice/               # Practice scripts and personal scratchpad
│   └── practice.js         # Initial scope & sandbox code
├── scripts/                # Tooling & build utilities
│   └── build-chapters.js   # Chapter bundler script
├── index.html              # Main web application entry point (GitHub Pages root)
├── start.bat               # Windows double-click launcher
├── package.json            # npm start & npm run build scripts
├── README.md               # Main project documentation
└── .gitignore              # Git ignore rules
```

---

## 🛠️ Updating Chapter Content

If you edit any markdown file in `chapters/`:
1. Run `npm run build` (or `node scripts/build-chapters.js`).
2. Refresh the web page in your browser. All new text, diagrams, and code snippets are automatically bundled into the interactive runner!
3. Commit and push to update the live site on GitHub Pages:
   ```bash
   git add .
   git commit -m "docs: update curriculum content"
   git push origin main
   ```
