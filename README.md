# 🗺️ JavaScript, from first principles
> **A 13-Chapter Interactive Engineering Reference with Zero-Command Browser Code Execution**

Welcome to the definitive JavaScript mastery handbook and interactive reading platform. Engineered to take you from foundational syntax to runtime mechanics (V8 AST, Call Stack, Memory Heap, Event Loop), clean architecture, and production readiness.

---

## ⚡ Quick Start: Zero-Command Interactive Web App

You do **not** need to use terminal commands or run `node` to test code. The entire curriculum is available as a local interactive web application.

### 🚀 How to Launch:
1. **Double-Click**: Open this folder in Windows Explorer and double-click [`start.bat`](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/start.bat) (or double-click [`index.html`](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/index.html)).
2. The web platform opens immediately in your browser. It runs **100% offline** with zero build steps and zero CORS restrictions.
3. *(Optional Dev Server)*: Run `npm start` and visit `http://localhost:3000/`.

---

## 🌟 Interactive Platform Features

- **Zero-Command Code Execution**: Every single JavaScript code block in the curriculum features a **Run Code ▶** button, inline code editor, and console output drawer with stdout, warnings, errors, and execution timing (`⚡ 1.2ms`).
- **West-Anchored "ON THIS PAGE" Navigation**: An elegant, sticky Table of Contents anchored to the far-left ("west") edge of your screen with real-time scrollspy for smooth section jumping.
- **Expandable Live Scratchpad**:
  - Slide-over drawer accessible from any page via the top navigation or floating action button.
  - Preloaded with [`practice.js`](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/practice.js) and presets for Event Loop, Closures, Prototypes, and Debouncing.
  - **Fullscreen & Side-by-Side Mode**: Expand to full viewport (`100vw × 100vh`) with side-by-side editor and terminal panes specifically designed for large architecture and memory diagrams.
  - Hotkey: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to execute immediately.
- **Global Omnibar Search**: Press <kbd>/</kbd> anywhere on the page to search across all chapters, modules, and code snippets in real time.
- **Progress Tracker**: Mark chapters as completed; progress is saved automatically in `localStorage`.
- **Editorial Dark Aesthetic**: High-contrast typography (*Newsreader* serif italic + *Inter* grotesque sans + *JetBrains Mono*), terracotta ember accents, and sleek dark surfaces.

---

## 📚 Curriculum Navigation

| Phase | Title | Focus Area | Status | Web App Route | Markdown Doc |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **01** | **Core JavaScript 🧱** | Engines, Execution Context, Data Types, Stack vs Heap, Operators, Control Flow | 🟢 Ready | `#chapter-01` | [01-core-javascript.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/01-core-javascript.md) |
| **02** | **Functions 🧠** | Declarations vs Expressions, Arrow Functions, Scope, Parameters, HOFs, Callbacks | 🟢 Ready | `#chapter-02` | [02-functions.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/02-functions.md) |
| **03** | **Data Structures 🔥** | Arrays (Mutating vs Non-mutating), Objects, Maps, Sets, WeakMap & WeakSet | 🟢 Ready | `#chapter-03` | [03-data-structures.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/03-data-structures.md) |
| **04** | **Modern JavaScript (ES6+) ⚡** | Destructuring, Rest/Spread, Optional Chaining, Nullish Coalescing, Modern Syntax | 🟢 Ready | `#chapter-04` | [04-modern-javascript-es6.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/04-modern-javascript-es6.md) |
| **05** | **How JS Actually Works 🧬** | Execution Context, Call Stack, Scope Chain, Hoisting, TDZ, Closures, `this` Binding | 🟢 Ready | `#chapter-05` | [05-how-javascript-works.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/05-how-javascript-works.md) |
| **06** | **Object-Oriented JS 🏗️** | Prototypes, `__proto__`, Prototype Chain, ES6 Classes, Inheritance, `super` | 🟢 Ready | `#chapter-06` | [06-object-oriented-javascript.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/06-object-oriented-javascript.md) |
| **07** | **The Browser & DOM 🌐** | DOM Tree, Querying, Event Bubbling & Capturing, Delegation, Performance | 🟢 Ready | `#chapter-07` | [07-browser-and-dom.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/07-browser-and-dom.md) |
| **08** | **Asynchronous JavaScript 🚀** | Event Loop, Microtasks vs Macrotasks, Promises, `async`/`await`, Concurrency | 🟢 Ready | `#chapter-08` | [08-asynchronous-javascript.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/08-asynchronous-javascript.md) |
| **09** | **Working With Servers 🌍** | HTTP Protocol, REST, Fetch API, Headers, Authentication Tokens, JSON | 🟢 Ready | `#chapter-09` | [09-working-with-servers.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/09-working-with-servers.md) |
| **10** | **Professional JavaScript 💼** | ESM Modules, Error Architecture, Storage (Local/Session/Cookies), Node.js Runtime | 🟢 Ready | `#chapter-10` | [10-professional-javascript.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/10-professional-javascript.md) |
| **11** | **Advanced JavaScript 🧠🔥** | Memory Leaks, GC Algorithms, Deep Copy, Debounce/Throttle, Design Patterns | 🟢 Ready | `#chapter-11` | [11-advanced-javascript.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/11-advanced-javascript.md) |
| **12** | **TypeScript 🔷** | Type System, Interfaces, Generics, Union/Intersection, Type Narrowing | 🟢 Ready | `#chapter-12` | [12-typescript.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/12-typescript.md) |
| **13** | **Real Development 🚀** | Debugging, DevTools, Clean Architecture, ESLint/Prettier, Unit Testing, Security | 🟢 Ready | `#chapter-13` | [13-real-development.md](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/chapters/13-real-development.md) |

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
│   │   └── style.css       # Design system & dark editorial aesthetic
│   └── js/
│       ├── app.js          # In-browser execution engine, parser, & routing
│       └── chapters-data.js# Pre-bundled curriculum data for zero-CORS offline operation
├── practice/               # Practice scripts and personal scratchpad
│   └── practice.js         # Initial scope & sandbox code
├── scripts/                # Tooling & build utilities
│   └── build-chapters.js   # Chapter bundler script
├── index.html              # Main web application entry point
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
