# Phase 7: The Browser & DOM 🌐

> **Goal**: Master DOM manipulation, browser rendering mechanics, high-performance element creation, and the Event-Driven architecture (Capturing, Bubbling, and Event Delegation).

---

## Table of Contents
1. [Module 15: The Document Object Model (DOM)](#module-15-the-document-object-model-dom)
   - [15.1 What is the DOM?](#151-what-is-the-dom)
   - [15.2 Querying Elements: NodeList vs HTMLCollection](#152-querying-elements-nodelist-vs-htmlcollection)
   - [15.3 Modifying Content: `textContent` vs `innerText` vs `innerHTML`](#153-modifying-content-textcontent-vs-innertext-vs-innerhtml)
   - [15.4 Styling & Class Management](#154-styling--class-management)
   - [15.5 Attributes & Dataset (`data-*`)](#155-attributes--dataset-data-)
   - [15.6 Creating, Appending, and Removing Elements](#156-creating-appending-and-removing-elements)
   - [15.7 High-Performance Batching with `DocumentFragment`](#157-high-performance-batching-with-documentfragment)
2. [Module 16: Browser Events Architecture](#module-16-browser-events-architecture)
   - [16.1 The Event-Driven Architecture & `addEventListener`](#161-the-event-driven-architecture--addeventlistener)
   - [16.2 The Event Object: `target` vs `currentTarget`](#162-the-event-object-target-vs-currenttarget)
   - [16.3 Event Propagation: Capturing vs Bubbling](#163-event-propagation-capturing-vs-bubbling)
   - [16.4 Event Delegation Pattern (Production Standard)](#164-event-delegation-pattern-production-standard)
   - [16.5 Preventing Defaults & Stopping Propagation](#165-preventing-defaults--stopping-propagation)
3. [Common Pitfalls & Performance Anti-Patterns](#common-pitfalls--performance-anti-patterns)
4. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 15: The Document Object Model (DOM)

### 15.1 What is the DOM?
The **Document Object Model (DOM)** is an object-oriented tree representation of an HTML document constructed by the browser during parsing. Every HTML tag, text chunk, and comment becomes a **Node** in the tree with programmable properties and methods.

```
                  [ document ]
                       │
                  [ <html> ]
                 ┌─────┴─────┐
             [ <head> ]  [ <body> ]
                 │           │
             [ <title> ] ┌───┴──────────┐
                         │              │
                     [ <h1> ]       [ <ul> ]
                         │          ┌───┴───┐
                     "Welcome"   [ <li> ] [ <li> ]
```

---

### 15.2 Querying Elements: NodeList vs HTMLCollection

```javascript
// Modern CSS Selector Queries (Preferred):
const heading = document.querySelector("#main-title");        // Returns first matching Element or null
const buttons = document.querySelectorAll(".btn-primary");    // Returns static NodeList

// Legacy Methods:
const container = document.getElementById("app");              // Fast ID lookup
const listItems = document.getElementsByTagName("li");         // Returns LIVE HTMLCollection
```

#### NodeList vs HTMLCollection:
| Feature | `NodeList` (`querySelectorAll`) | `HTMLCollection` (`getElementsBy...`) |
| :--- | :--- | :--- |
| **Live or Static?** | **Static snapshot** (does not reflect subsequent DOM mutations) | **Live** (automatically updates when DOM changes) |
| **Iteration** | Supports `.forEach()` directly | Must convert via `Array.from()` to loop |
| **Contents** | Can hold elements, text, or comment nodes | Holds **only Elements** |

---

### 15.3 Modifying Content: `textContent` vs `innerText` vs `innerHTML`

```javascript
const box = document.querySelector("#content-box");

// 1. textContent (Fastest & Safest for plain text):
// Returns raw text content of all elements, including <script> and hidden text.
box.textContent = "Hello Clean World";

// 2. innerText (Aware of CSS styling):
// Triggers a reflow/layout recalculation because it checks if elements are visible!
console.log(box.innerText);

// 3. innerHTML (Parses HTML string):
// ⚠️ XSS DANGER! Never pass unsanitized user input into innerHTML!
box.innerHTML = `<span class="badge">Active</span>`;
```

---

### 15.4 Styling & Class Management

```javascript
const card = document.querySelector(".card");

// 1. ClassList API (Best Practice):
card.classList.add("highlight", "active");
card.classList.remove("dimmed");
card.classList.toggle("selected"); // Adds if missing, removes if present
const hasActive = card.classList.contains("active"); // true

// 2. Inline Style (Modifies style attribute directly):
card.style.backgroundColor = "#1e293b";
card.style.fontSize = "1.25rem"; // Must include unit!
```

---

### 15.5 Attributes & Dataset (`data-*`)

```javascript
const btn = document.querySelector("#submit-btn");

// Standard attributes:
btn.setAttribute("disabled", "true");
btn.removeAttribute("disabled");
console.log(btn.hasAttribute("disabled")); // false

// Data Attributes (HTML: data-user-id="42" data-role="editor"):
console.log(btn.dataset.userId); // "42" (CamelCase conversion!)
btn.dataset.role = "admin";      // Updates data-role to "admin"
```

---

### 15.6 Creating, Appending, and Removing Elements

```javascript
// Create new element:
const item = document.createElement("li");
item.className = "list-item";
item.textContent = "New Notification";

const list = document.querySelector("#notification-list");

// Modern insertion APIs:
list.append(item);        // Appends 'item' to end of list
list.prepend(item);       // Moves 'item' to start of list

const extraItem = document.createElement("li");
extraItem.textContent = "Urgent Notification";
item.before(extraItem);   // Inserts 'extraItem' immediately before 'item'
item.after(extraItem);    // Inserts 'extraItem' immediately after 'item'

// Removal:
item.remove(); // Removes itself from DOM tree!
```

---

### 15.7 High-Performance Batching with `DocumentFragment`
Every time an element is appended to the live DOM, the browser may trigger a costly **Reflow (Layout calculation)** and **Repaint**. 

A **`DocumentFragment`** is an in-memory virtual container. Modifying it causes **zero reflows**. When appended to the DOM, only its child elements are inserted:

```javascript
const list = document.querySelector("#heavy-list");
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Batch item #${i}`;
  fragment.appendChild(li); // Zero DOM reflow!
}

list.appendChild(fragment); // Single reflow for all 1000 elements!
```

---

# Module 16: Browser Events Architecture

### 16.1 The Event-Driven Architecture & `addEventListener`

```javascript
const button = document.querySelector("#cta-button");

function handleClick(event) {
  console.log("Button clicked!", event);
}

// Attach listener:
button.addEventListener("click", handleClick);

// Clean up listener (to prevent memory leaks):
button.removeEventListener("click", handleClick);
```

---

### 16.2 The Event Object: `target` vs `currentTarget`

When an event triggers, an `Event` object is passed into the callback:
- **`event.target`**: The actual innermost DOM element that originated the event (e.g. the icon inside a button).
- **`event.currentTarget`**: The element to which the event handler is currently attached (equivalent to `this`).

```javascript
document.querySelector("#nav-bar").addEventListener("click", (e) => {
  console.log("Originating clicked element:", e.target);
  console.log("Attached listener container:", e.currentTarget);
});
```

---

### 16.3 Event Propagation: Capturing vs Bubbling

When you click an element inside nested containers, the browser executes a 3-phase propagation sequence:

```
                  1. CAPTURING PHASE (Window down to Target)
                 ┌────────────────────────────────────────┐
                 ▼                                        │
           [ Window ]                                     │
                 │                                        │
          [ Document ]                                    │
                 │                                        │
           [ <body> ]                                     │
                 │                                        │
           [ <div.parent> ]                               │
                 │                                        │
                 ▼                                        │
           [ <button> ] ◄── 2. TARGET PHASE               │
                 │                                        │
                 └────────────────────────────────────────┘
                  3. BUBBLING PHASE (Target back up to Window)
```

1. **Capturing Phase**: The event travels down from `window` through ancestors to the target. (Rarely used; enabled by passing `{ capture: true }` to `addEventListener`).
2. **Target Phase**: The event reaches the originating element.
3. **Bubbling Phase**: The event bubbles up from the target back through all its ancestors to `window`. (Default mode).

---

### 16.4 Event Delegation Pattern (Production Standard)

Instead of attaching hundreds of separate event listeners to individual items, attach **one single event listener to their common ancestor** and leverage **Event Bubbling**:

```html
<ul id="todo-list">
  <li data-id="1">Task 1 <button class="delete-btn">Delete</button></li>
  <li data-id="2">Task 2 <button class="delete-btn">Delete</button></li>
</ul>
```

```javascript
const todoList = document.querySelector("#todo-list");

// Single listener handles current AND future dynamic items!
todoList.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return; // Ignore clicks outside delete buttons

  const li = deleteBtn.closest("li");
  const id = li.dataset.id;
  console.log(`Deleting task ${id}`);
  li.remove();
});
```

**Benefits of Event Delegation:**
1. **Dramatically Lower Memory Consumption**: 1 listener instead of 1,000.
2. **Dynamic Elements**: New items added via AJAX/Fetch work immediately without re-binding listeners.

---

### 16.5 Preventing Defaults & Stopping Propagation

```javascript
const link = document.querySelector("a.custom-link");

link.addEventListener("click", (e) => {
  // 1. preventDefault(): Prevents default browser action (e.g. form submission, link redirect)
  e.preventDefault();

  // 2. stopPropagation(): Stops the event from bubbling up to parent ancestors
  e.stopPropagation();

  console.log("Custom modal opened instead of browser page navigation");
});
```

---

# Hands-On Practice Challenges & Solutions

### Challenge: Dynamic Filterable Todo App Logic
**Task**: Write the JavaScript logic for a todo list container with event delegation that:
1. Adds items dynamically.
2. Toggles a `.completed` class when the text is clicked.
3. Removes the item when a `.btn-delete` is clicked.

<details>
<summary>👉 View Solution</summary>

```javascript
function initTodoApp(containerElement) {
  // Event delegation on the parent container:
  containerElement.addEventListener("click", (e) => {
    const item = e.target.closest(".todo-item");
    if (!item) return;

    // Handle delete:
    if (e.target.matches(".btn-delete")) {
      item.remove();
      return;
    }

    // Handle toggle completed:
    item.classList.toggle("completed");
  });

  return {
    addTodo(text) {
      const li = document.createElement("li");
      li.className = "todo-item";
      li.innerHTML = `
        <span class="todo-text">${text}</span>
        <button class="btn-delete" type="button">×</button>
      `;
      containerElement.appendChild(li);
    }
  };
}
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 8: Asynchronous JavaScript 🚀](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/08-asynchronous-javascript.md)** to master Callbacks, Callback Hell, Promises, Chaining, `async`/`await`, and the engine Event Loop (Microtasks vs Macrotasks).
