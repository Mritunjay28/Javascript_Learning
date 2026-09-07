/**
 * JavaScript, from first principles
 * Interactive Web Application Engine & Runner
 */

(function () {
  'use strict';

  // --- Preset Snippets for Scratchpad ---
  const PRESET_SNIPPETS = {
    practice: window.CHAPTERS_DATA ? window.CHAPTERS_DATA.practiceCode : `// Function Scope (var)
function testVar() {
    if (true) {
        var x = 10;
    }
    console.log("var x inside function:", x); // 10 (var leaks outside if-block!)
}
testVar();

// Block Scope (let & const)
function testLet() {
    if (true) {
        let y = 20;
        const z = 30;
    }
    try {
        console.log(y);
    } catch (err) {
        console.error("let is block-scoped! Caught error:", err.message);
    }
}
testLet();`,

    diagrams: `// ===============================================================
// ARCHITECTURE DIAGRAMS & RUNTIME VISUALIZATIONS
// ===============================================================

console.log(\`
┌────────────────────────────────────────────────────────────────┐
│               THE JAVASCRIPT EVENT LOOP ENGINE                 │
└────────────────────────────────────────────────────────────────┘

                   ┌────────────────────────────────────────┐
                   ▼                                        │
            [ Call Stack ] ◄── Synchronous execution        │
                   │ (Empty?)                               │
                   ├──► YES ──► Drain ENTIRE Microtask Queue│
                   │                  │ (Empty?)            │
                   │                  └──► Run 1 Macrotask ─┘
                   └──► NO ───► Keep executing stack

------------------------------------------------------------------
PRIORITY OF EXECUTION IN THE ENGINE:
  1. Synchronous Stack  (Functions, variable assignments)
  2. Microtask Queue    (Promise.then, queueMicrotask)
  3. Macrotask Queue    (setTimeout, setInterval, I/O)
==================================================================
\`);

console.log(\`
┌────────────────────────────────────────────────────────────────┐
│          MEMORY MODEL: CALL STACK vs HEAP ALLOCATION           │
└────────────────────────────────────────────────────────────────┘

  [ CALL STACK ] (Fast, fixed size)      [ MEMORY HEAP ] (Dynamic)
  ┌──────────────────────────────┐       ┌────────────────────────┐
  │ primitiveAge: 25             │       │                        │
  │ isEngineer:   true           │       │  {                     │
  │ userPointer:  0x7ffd19b0 ────┼──────►│     name: "Ada",       │
  │ arrPointer:   0x7ffd19c8 ────┼──┐    │     role: "Architect"  │
  └──────────────────────────────┘  │    │  }                     │
                                    │    │                        │
                                    └───►│  [ 10, 20, 30, 40 ]    │
                                         └────────────────────────┘
\`);`,

    domtree: `// ===============================================================
// DOCUMENT OBJECT MODEL (DOM) HIERARCHY TREE
// ===============================================================

console.log(\`
                   [ Document Node ]
                          │
                     [ <html> ]
                    ┌─────┴─────┐
                [ <head> ]  [ <body> ]
                    │           │
                [ <title> ] ┌───┴──────────┐
                            │              │
                        [ <header> ]   [ <main> ]
                            │          ┌───┴───┐
                        [ <h1> ]    [ <p> ] [ <article> ]
                            │          │       │
                        "Welcome"   "Text"  [ <code> ]
\`);`,

    closure: `// Closures & Lexical Scope
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable encapsulated in closure
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counterA = createCounter(10);
console.log("A after increment:", counterA.increment()); // 11
console.log("A after increment:", counterA.increment()); // 12

const counterB = createCounter(0);
console.log("B initial:", counterB.getCount()); // 0 (independent state!)
console.log("A current:", counterA.getCount()); // 12`,

    eventloop: `// Event Loop & Microtask Queue Priority
console.log("1. Synchronous Start");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout 0ms)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise 1)");
}).then(() => {
  console.log("3b. Microtask (Promise 2 chained)");
});

queueMicrotask(() => {
  console.log("3c. Microtask (queueMicrotask)");
});

console.log("2. Synchronous End");`,

    prototype: `// Prototype Chain & Inheritance
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return \`\${this.name} makes a sound.\`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Super constructor call
  this.breed = breed;
}

// Wire up the prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return \`\${this.name} the \${this.breed} barks!\`;
};

const buddy = new Dog("Buddy", "Golden Retriever");
console.log(buddy.speak()); // Inherited from Animal
console.log(buddy.bark());  // Own method
console.log("Is buddy an Animal?", buddy instanceof Animal); // true`,

    debounce: `// Debouncing Implementation
function debounce(fn, delayMs) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}

const simulateSearch = debounce((query) => {
  console.log("⚡ Executing search API call for:", query);
}, 300);

console.log("Triggering 3 rapid keystrokes...");
simulateSearch("r");
simulateSearch("re");
simulateSearch("react"); // Only this one will execute after 300ms!`,

    deepclone: `// Deep Clone using StructuredClone or Recursion
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (hash.has(obj)) return hash.get(obj); // Cycle reference protection

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], hash);
  }
  return clone;
}

const original = {
  name: "V8 Engine",
  specs: { memory: "64MB", threads: 1 },
  languages: ["JavaScript", "WebAssembly"]
};

const copied = deepClone(original);
copied.specs.memory = "128MB"; // Modifying clone does NOT mutate original

console.log("Original specs memory:", original.specs.memory); // "64MB"
console.log("Copied specs memory:", copied.specs.memory);     // "128MB"`,

    empty: `// Write and run arbitrary JavaScript
console.log("Hello from JavaScript from First Principles!");
`
  };

  // --- State Management ---
  const STORAGE_KEY_PROGRESS = 'js_principles_completed_chapters';
  const STORAGE_KEY_THEME = 'js_principles_theme';
  const STORAGE_KEY_SCRATCHPAD = 'js_principles_scratchpad_code';

  let completedChapters = new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (saved) completedChapters = new Set(JSON.parse(saved));
  } catch (e) {}

  let savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const chaptersData = window.CHAPTERS_DATA || { phases: [], chapters: [] };

  // --- DOM Elements ---
  const homeView = document.getElementById('home-view');
  const readerView = document.getElementById('reader-view');
  const curriculumContainer = document.getElementById('curriculum-container');
  const statsProgressCount = document.getElementById('stats-progress-count');
  const navProgressText = document.getElementById('nav-progress-text');
  const breadcrumbContainer = document.getElementById('breadcrumb-container');
  const breadcrumbChapter = document.getElementById('breadcrumb-chapter');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const iconMoon = themeToggleBtn.querySelector('.icon-moon');
  const iconSun = themeToggleBtn.querySelector('.icon-sun');

  // Reader Elements
  const readerChapterBadge = document.getElementById('reader-chapter-badge');
  const readerTimeBadge = document.getElementById('reader-time-badge');
  const readerChapterTitle = document.getElementById('reader-chapter-title');
  const readerChapterSynopsis = document.getElementById('reader-chapter-synopsis');
  const readerMarkdownContent = document.getElementById('reader-markdown-content');
  const markCompleteBtn = document.getElementById('mark-complete-btn');
  const markCompleteText = document.getElementById('mark-complete-text');
  const sidebarToc = document.getElementById('sidebar-toc');
  const chapterSelectDropdown = document.getElementById('chapter-select-dropdown');
  const prevChapterBtn = document.getElementById('prev-chapter-btn');
  const nextChapterBtn = document.getElementById('next-chapter-btn');
  const prevChapterTitle = document.getElementById('prev-chapter-title');
  const nextChapterTitle = document.getElementById('next-chapter-title');

  // Scratchpad Elements
  const scratchpadOverlay = document.getElementById('scratchpad-overlay');
  const scratchpadDrawer = document.getElementById('scratchpad-drawer');
  const scratchpadCloseBtn = document.getElementById('scratchpad-close-btn');
  const scratchpadToggleBtn = document.getElementById('scratchpad-toggle-btn');
  const heroScratchpadBtn = document.getElementById('hero-scratchpad-btn');
  const readerOpenScratchpad = document.getElementById('reader-open-scratchpad');
  const floatingScratchpadBtn = document.getElementById('floating-scratchpad-btn');
  const scratchpadTextarea = document.getElementById('scratchpad-textarea');
  const scratchpadRunBtn = document.getElementById('scratchpad-run-btn');
  const scratchpadClearBtn = document.getElementById('scratchpad-clear-btn');
  const scratchpadResetBtn = document.getElementById('scratchpad-reset-btn');
  const scratchpadConsole = document.getElementById('scratchpad-console');
  const scratchpadExecTime = document.getElementById('scratchpad-exec-time');
  const scratchpadTemplateSelect = document.getElementById('scratchpad-template-select');

  // Search Elements
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const heroSearchBtn = document.getElementById('hero-search-btn');
  const searchModalBackdrop = document.getElementById('search-modal-backdrop');
  const searchModalCloseBtn = document.getElementById('search-modal-close-btn');
  const globalSearchInput = document.getElementById('global-search-input');
  const searchResultsContainer = document.getElementById('search-results-container');

  let currentChapterIndex = 0;

  // --- Initial Theme Setup ---
  function updateThemeUI() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      iconMoon.style.display = 'block';
      iconSun.style.display = 'none';
    } else {
      iconMoon.style.display = 'none';
      iconSun.style.display = 'block';
    }
  }
  updateThemeUI();

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
    updateThemeUI();
  });

  // --- Progress Management ---
  function updateProgressDisplay() {
    const total = chaptersData.chapters.length || 13;
    const count = completedChapters.size;
    const text = `${count} / ${total}`;
    if (statsProgressCount) statsProgressCount.textContent = text;
    if (navProgressText) navProgressText.textContent = text;

    // Update phase headers if present
    chaptersData.phases.forEach(phase => {
      const phaseCount = phase.chapterNumbers.filter(num => completedChapters.has(num)).length;
      const el = document.getElementById(`phase-progress-${phase.phaseId}`);
      if (el) el.textContent = `${phaseCount} / ${phase.chapterNumbers.length}`;
    });

    // Update card badges
    chaptersData.chapters.forEach(ch => {
      const cardEl = document.getElementById(`card-${ch.id}`);
      if (cardEl) {
        const isDone = completedChapters.has(ch.number);
        cardEl.classList.toggle('completed', isDone);
        const badge = cardEl.querySelector('.card-status-badge');
        if (badge) {
          badge.className = `card-status-badge ${isDone ? 'done' : ''}`;
          badge.innerHTML = isDone ? '✓ Completed' : 'Pending';
        }
      }
    });

    // Update reader checkmark button if on chapter
    const currentChapter = chaptersData.chapters[currentChapterIndex];
    if (currentChapter && markCompleteBtn) {
      const isDone = completedChapters.has(currentChapter.number);
      markCompleteBtn.classList.toggle('completed', isDone);
      markCompleteText.textContent = isDone ? 'Chapter Completed' : 'Mark as Completed';
    }
  }

  function toggleChapterComplete(chNum) {
    if (completedChapters.has(chNum)) {
      completedChapters.delete(chNum);
    } else {
      completedChapters.add(chNum);
    }
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(Array.from(completedChapters)));
    updateProgressDisplay();
  }

  // --- Safe In-Browser Code Execution Engine ---
  async function executeJavaScript(codeString, outputContainer, timeBadgeEl) {
    if (!outputContainer) return;
    outputContainer.innerHTML = '';

    const logs = [];
    const startTime = performance.now();

    function formatArg(arg) {
      if (arg === undefined) return 'undefined';
      if (arg === null) return 'null';
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'function') return arg.toString();
      if (typeof arg === 'symbol') return arg.toString();
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return Object.prototype.toString.call(arg);
        }
      }
      return String(arg);
    }

    function appendLine(type, text) {
      const line = document.createElement('div');
      line.className = `log-line log-${type}`;
      line.textContent = text;
      outputContainer.appendChild(line);
      outputContainer.scrollTop = outputContainer.scrollHeight;
    }

    // Custom console to capture logs
    const mockConsole = {
      log: (...args) => appendLine('info', args.map(formatArg).join(' ')),
      info: (...args) => appendLine('info', args.map(formatArg).join(' ')),
      warn: (...args) => appendLine('warn', '⚠ ' + args.map(formatArg).join(' ')),
      error: (...args) => appendLine('error', '✖ ' + args.map(formatArg).join(' ')),
      table: (data) => {
        try {
          appendLine('info', JSON.stringify(data, null, 2));
        } catch (e) {
          appendLine('info', String(data));
        }
      }
    };

    try {
      // AsyncFunction wrapper so await and promises work smoothly
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const runner = new AsyncFunction('console', `
        "use strict";
        ${codeString}
      `);

      const result = await runner(mockConsole);

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(1);
      if (timeBadgeEl) {
        timeBadgeEl.style.display = 'inline-block';
        timeBadgeEl.textContent = `⚡ ${duration}ms`;
      }

      // If expression returned something and nothing was logged
      if (result !== undefined && outputContainer.children.length === 0) {
        appendLine('return', `↳ ${formatArg(result)}`);
      } else if (outputContainer.children.length === 0) {
        appendLine('info', '// Code executed successfully (no logs produced)');
      }
    } catch (err) {
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(1);
      if (timeBadgeEl) {
        timeBadgeEl.style.display = 'inline-block';
        timeBadgeEl.textContent = `⚡ ${duration}ms`;
      }
      appendLine('error', `Error: ${err.name}: ${err.message}`);
      if (err.stack) {
        const cleanStack = err.stack.split('\n').slice(0, 3).join('\n');
        appendLine('error', cleanStack);
      }
    }
  }

  // --- Robust Client-Side Markdown Parser ---
  function parseMarkdown(mdText) {
    if (!mdText) return '';

    let html = '';
    const lines = mdText.split('\n');
    let inCodeBlock = false;
    let codeLang = '';
    let codeLines = [];
    let inTable = false;
    let tableRows = [];
    let inList = false;
    let listType = '';
    let inBlockquote = false;
    let blockquoteLines = [];

    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function formatInline(text) {
      // Inline code `...`
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
      // Bold **...**
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // Italic *...*
      text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      // Links [text](url)
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="content-link">$1</a>');
      return text;
    }

    function flushBlockquote() {
      if (inBlockquote) {
        html += `<blockquote>${formatInline(blockquoteLines.join('<br>'))}</blockquote>`;
        blockquoteLines = [];
        inBlockquote = false;
      }
    }

    function flushList() {
      if (inList) {
        html += `</${listType}>`;
        inList = false;
        listType = '';
      }
    }

    function flushTable() {
      if (inTable) {
        if (tableRows.length > 0) {
          html += '<table>';
          // Check if row 1 is header
          const headerCols = tableRows[0];
          html += '<thead><tr>';
          headerCols.forEach(col => {
            html += `<th>${formatInline(col)}</th>`;
          });
          html += '</tr></thead><tbody>';

          for (let i = 1; i < tableRows.length; i++) {
            // skip separator rows like |:---|:---|
            if (tableRows[i].some(c => /^:?-+:?$/.test(c.trim()))) continue;
            html += '<tr>';
            tableRows[i].forEach(col => {
              html += `<td>${formatInline(col)}</td>`;
            });
            html += '</tr>';
          }
          html += '</tbody></table>';
        }
        tableRows = [];
        inTable = false;
      }
    }

    let codeBlockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks ```
      if (line.trim().startsWith('```')) {
        flushBlockquote();
        flushList();
        flushTable();

        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.trim().replace(/^```/, '').trim().toLowerCase();
          codeLines = [];
        } else {
          inCodeBlock = false;
          const codeContent = codeLines.join('\n');
          const rawLang = codeLang.trim().toLowerCase();

          // Detect if it's an ASCII diagram, pipeline, or architecture schema:
          const hasDiagramChars =
            /[┌├└│─▼▲◄►┬┴┤┼═║╔╗╚╝╠╣╦╩╬]/.test(codeContent) ||
            /──>/.test(codeContent) ||
            /-->/.test(codeContent) ||
            /<──/.test(codeContent) ||
            /<--/.test(codeContent) ||
            /\+[-]{3,}/.test(codeContent) ||
            /\|\s*(\[|\w+)/.test(codeContent) ||
            /\[\s*[^\]\n]+\s*\]\s*──>/.test(codeContent) ||
            /Source Code[\s\S]*Lexer/i.test(codeContent) ||
            /Call Stack[\s\S]*Microtask/i.test(codeContent) ||
            /BROWSER RUNTIME|NODE\.JS RUNTIME/i.test(codeContent) ||
            /\[ document \]|\[ <html> \]/i.test(codeContent) ||
            /Constructor Function[\s\S]*Prototype Object/i.test(codeContent);

          const isDiagram = rawLang === 'diagram' || 
                            rawLang === 'ascii' || 
                            rawLang === 'text' || 
                            rawLang === 'flow' || 
                            rawLang === 'mermaid' || 
                            hasDiagramChars;

          const isJs = !isDiagram && (rawLang === 'javascript' || rawLang === 'js' || (!rawLang && !isDiagram));
          const displayBadge = isDiagram ? 'ARCHITECTURE DIAGRAM' : (rawLang ? rawLang.toUpperCase() : 'JAVASCRIPT');
          const blockId = `code-block-${++codeBlockIndex}`;

          html += `
            <div class="code-block-wrapper ${isDiagram ? 'is-diagram' : ''}" id="${blockId}">
              <div class="code-block-header">
                <span class="code-lang-badge ${isDiagram ? 'badge-diagram' : ''}">${displayBadge}</span>
                <div class="code-block-actions">
                  ${isJs ? `
                    <button class="code-action-btn btn-run-code" data-block-id="${blockId}" title="Run JavaScript Code">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      <span>Run Code</span>
                    </button>
                    <button class="code-action-btn btn-edit-code" data-block-id="${blockId}" title="Edit Code">
                      <span>Edit</span>
                    </button>
                    <button class="code-action-btn btn-reset-code" data-block-id="${blockId}" style="display: none;" title="Reset to Original">
                      <span>Reset</span>
                    </button>
                  ` : ''}
                  <button class="code-action-btn btn-copy-code" data-block-id="${blockId}" title="Copy Code">
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <div class="code-editor-box">
                <textarea class="code-textarea ${isDiagram ? 'diagram-textarea' : ''}" data-original-code="${escapeHtml(codeContent)}" readonly spellcheck="false">${escapeHtml(codeContent)}</textarea>
              </div>
              ${isJs ? `
                <div class="inline-console-drawer" id="${blockId}-console-drawer" style="display: none;">
                  <div class="inline-console-header">
                    <span class="console-title">CONSOLE OUTPUT</span>
                    <div class="console-actions">
                      <span class="execution-time-badge" id="${blockId}-exec-time" style="display: none;">⚡ 0.0ms</span>
                      <button class="btn btn-clear-console" data-block-id="${blockId}" title="Clear & Hide Output">Clear ✕</button>
                    </div>
                  </div>
                  <div class="inline-console-content" id="${blockId}-console-content"></div>
                </div>
              ` : ''}
            </div>
          `;
          codeLines = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Blockquotes >
      if (line.trim().startsWith('>')) {
        flushList();
        flushTable();
        inBlockquote = true;
        blockquoteLines.push(line.replace(/^>\s?/, ''));
        continue;
      } else if (inBlockquote) {
        flushBlockquote();
      }

      // Tables | col | col |
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushBlockquote();
        flushList();
        inTable = true;
        const cols = line
          .trim()
          .slice(1, -1)
          .split('|')
          .map(c => c.trim());
        tableRows.push(cols);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Horizontal rules ---
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
        flushBlockquote();
        flushList();
        flushTable();
        html += '<hr>';
        continue;
      }

      // Headings # ## ### ####
      const hMatch = line.match(/^(#{1,4})\s+(.*)$/);
      if (hMatch) {
        flushBlockquote();
        flushList();
        flushTable();
        const level = hMatch[1].length;
        const text = hMatch[2].trim();
        const id = text.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');

        html += `<h${level} id="${id}">${formatInline(text)}</h${level}>`;
        continue;
      }

      // Unordered Lists - or *
      const ulMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
      if (ulMatch) {
        flushBlockquote();
        flushTable();
        if (!inList || listType !== 'ul') {
          flushList();
          inList = true;
          listType = 'ul';
          html += '<ul>';
        }
        html += `<li>${formatInline(ulMatch[2])}</li>`;
        continue;
      }

      // Ordered Lists 1. 2.
      const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
      if (olMatch) {
        flushBlockquote();
        flushTable();
        if (!inList || listType !== 'ol') {
          flushList();
          inList = true;
          listType = 'ol';
          html += '<ol>';
        }
        html += `<li>${formatInline(olMatch[2])}</li>`;
        continue;
      }

      if (inList && line.trim() === '') {
        flushList();
      }

      // Pass-through raw HTML blocks (details, summary, div, etc.) without wrapping in <p>
      const trimmed = line.trim();
      if (trimmed.startsWith('<details') || trimmed.startsWith('</details>') ||
          trimmed.startsWith('<summary') || trimmed.startsWith('</summary>') ||
          (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
        flushBlockquote();
        flushList();
        flushTable();
        html += line + '\n';
        continue;
      }

      // Normal paragraph
      if (line.trim().length > 0) {
        flushBlockquote();
        flushList();
        flushTable();
        html += `<p>${formatInline(line)}</p>`;
      }
    }

    flushBlockquote();
    flushList();
    flushTable();

    return html;
  }

  // --- Attach Interactive Runner to Rendered Code Blocks ---
  function attachCodeBlockListeners(container) {
    if (!container) return;

    // Run Buttons
    container.querySelectorAll('.btn-run-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const blockId = btn.dataset.blockId;
        const blockEl = document.getElementById(blockId);
        if (!blockEl) return;

        const textarea = blockEl.querySelector('.code-textarea');
        const drawer = document.getElementById(`${blockId}-console-drawer`);
        const consoleContent = document.getElementById(`${blockId}-console-content`);
        const timeBadge = document.getElementById(`${blockId}-exec-time`);

        if (drawer) drawer.style.display = 'block';
        if (textarea && consoleContent) {
          executeJavaScript(textarea.value, consoleContent, timeBadge);
          setTimeout(() => {
            drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 80);
        }
      });
    });

    // Edit Buttons
    container.querySelectorAll('.btn-edit-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const blockId = btn.dataset.blockId;
        const blockEl = document.getElementById(blockId);
        if (!blockEl) return;

        const textarea = blockEl.querySelector('.code-textarea');
        const resetBtn = blockEl.querySelector('.btn-reset-code');

        if (textarea.hasAttribute('readonly')) {
          textarea.removeAttribute('readonly');
          textarea.focus();
          btn.innerHTML = '<span>Editing</span>';
          btn.style.color = 'var(--accent-primary)';
          if (resetBtn) resetBtn.style.display = 'inline-flex';
        } else {
          textarea.setAttribute('readonly', 'true');
          btn.innerHTML = '<span>Edit</span>';
          btn.style.color = '';
        }
      });
    });

    // Reset Buttons
    container.querySelectorAll('.btn-reset-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const blockId = btn.dataset.blockId;
        const blockEl = document.getElementById(blockId);
        if (!blockEl) return;

        const textarea = blockEl.querySelector('.code-textarea');
        const orig = textarea.dataset.originalCode;
        if (orig !== undefined) {
          textarea.value = orig;
        }
      });
    });

    // Copy Buttons
    container.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', async () => {
        const blockId = btn.dataset.blockId;
        const blockEl = document.getElementById(blockId);
        if (!blockEl) return;

        const textarea = blockEl.querySelector('.code-textarea');
        if (textarea) {
          try {
            await navigator.clipboard.writeText(textarea.value);
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(() => {
              btn.innerHTML = originalHtml;
            }, 1800);
          } catch (e) {
            // fallback
            textarea.select();
            document.execCommand('copy');
          }
        }
      });
    });

    function fitTextarea(ta) {
      if (!ta) return;
      const lines = (ta.value || '').split('\n').length;
      const estLineHeight = Math.max(70, lines * 24 + 48);
      ta.style.height = 'auto';
      const actualScroll = ta.scrollHeight;
      const finalHeight = Math.max(estLineHeight, actualScroll > 0 ? actualScroll + 16 : 0);
      ta.style.height = finalHeight + 'px';
    }

    // Auto-expand all code and diagram textareas with appropriate space
    container.querySelectorAll('.code-textarea').forEach(textarea => {
      // Pre-set line-based height immediately so even hidden/closed <details> have natural room
      const lines = (textarea.value || '').split('\n').length;
      const est = Math.max(70, lines * 24 + 48);
      textarea.style.minHeight = est + 'px';
      textarea.style.height = est + 'px';

      fitTextarea(textarea);
      setTimeout(() => fitTextarea(textarea), 60);
      setTimeout(() => fitTextarea(textarea), 250);

      textarea.addEventListener('input', () => fitTextarea(textarea));
    });

    // Support expanding <details> accordions (Solutions): auto-fit inner textareas on open
    container.querySelectorAll('details').forEach(det => {
      det.addEventListener('toggle', () => {
        if (det.open) {
          det.querySelectorAll('.code-textarea').forEach(ta => {
            fitTextarea(ta);
            setTimeout(() => fitTextarea(ta), 40);
            setTimeout(() => fitTextarea(ta), 160);
          });
        }
      });
    });

    // ResizeObserver ensures that if any container changes size or becomes visible, textareas fit
    if (window.ResizeObserver) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const ta = entry.target;
          if (ta.offsetParent !== null) {
            fitTextarea(ta);
          }
        }
      });
      container.querySelectorAll('.code-textarea').forEach(ta => ro.observe(ta));
    }

    // Clear Console Buttons (Automatically hides and removes console log bar after clear)
    container.querySelectorAll('.btn-clear-console').forEach(btn => {
      btn.addEventListener('click', () => {
        const blockId = btn.dataset.blockId;
        const drawer = document.getElementById(`${blockId}-console-drawer`);
        const consoleContent = document.getElementById(`${blockId}-console-content`);
        const timeBadge = document.getElementById(`${blockId}-exec-time`);
        if (consoleContent) consoleContent.innerHTML = '';
        if (timeBadge) timeBadge.style.display = 'none';
        if (drawer) {
          drawer.style.display = 'none'; // Automatically remove console log bar
        }
      });
    });
  }

  // --- Render Home / Curriculum Catalog ---
  function renderCurriculum() {
    if (!curriculumContainer) return;
    curriculumContainer.innerHTML = '';

    chaptersData.phases.forEach((phase, phaseIndex) => {
      const phaseBlock = document.createElement('div');
      phaseBlock.className = 'phase-block';

      const phaseChapters = chaptersData.chapters.filter(ch =>
        phase.chapterNumbers.includes(ch.number)
      );

      const phaseCompletedCount = phase.chapterNumbers.filter(num =>
        completedChapters.has(num)
      ).length;

      phaseBlock.innerHTML = `
        <div class="phase-header">
          <div class="phase-title-group">
            <h2 class="phase-title">${phase.phaseName}</h2>
            <p class="phase-desc">${phase.description}</p>
          </div>
          <div class="phase-meta">
            <span class="phase-range">${phase.range}</span>
            <span class="phase-progress" id="phase-progress-${phase.phaseId}">
              ${phaseCompletedCount} / ${phase.chapterNumbers.length}
            </span>
          </div>
        </div>
        <div class="cards-grid" id="grid-${phase.phaseId}"></div>
      `;

      const cardsGrid = phaseBlock.querySelector(`#grid-${phase.phaseId}`);

      phaseChapters.forEach(ch => {
        const isDone = completedChapters.has(ch.number);
        const card = document.createElement('a');
        card.href = `#${ch.id}`;
        card.className = `chapter-card ${isDone ? 'completed' : ''}`;
        card.id = `card-${ch.id}`;

        card.innerHTML = `
          <div class="card-top">
            <span class="card-number">${ch.number}</span>
            <h3 class="card-title">${ch.title}</h3>
          </div>
          <p class="card-desc">${ch.subtitle}</p>
          <div class="card-footer">
            <span class="card-duration">${ch.duration}</span>
            <span class="card-status-badge ${isDone ? 'done' : ''}">
              ${isDone ? '✓ Completed' : 'Pending'}
            </span>
          </div>
        `;
        cardsGrid.appendChild(card);
      });

      curriculumContainer.appendChild(phaseBlock);
    });

    // Also populate chapter select dropdown in reader sidebar
    if (chapterSelectDropdown) {
      chapterSelectDropdown.innerHTML = '';
      chaptersData.chapters.forEach((ch, idx) => {
        const opt = document.createElement('option');
        opt.value = ch.id;
        opt.textContent = `${ch.number} · ${ch.title}`;
        chapterSelectDropdown.appendChild(opt);
      });
      chapterSelectDropdown.addEventListener('change', (e) => {
        window.location.hash = `#${e.target.value}`;
      });
    }
  }

  // --- Scroll Synchronization Engine (Reading Progress Bar + Sidebar TOC Auto-Scroll) ---
  let isTocClickScrolling = false;
  let tocClickTimer = null;

  function updateScrollSync() {
    // 1. Synchronize Top Reading Progress Bar with Document Scroll
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
        progressBar.style.width = `${pct}%`;
      } else {
        progressBar.style.width = '0%';
      }
    }

    // Only synchronize TOC if reader view is active and not during manual click animation
    if (readerView.style.display === 'none') return;
    if (isTocClickScrolling) return;

    const headings = Array.from(readerMarkdownContent.querySelectorAll('h1, h2, h3, h4'));
    if (headings.length === 0) return;

    // Header offset threshold (92px header clearance)
    const headerOffset = 130;
    let activeHeading = headings[0];

    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

    if (isAtBottom) {
      activeHeading = headings[headings.length - 1];
    } else {
      for (let i = 0; i < headings.length; i++) {
        const h = headings[i];
        const top = h.getBoundingClientRect().top;
        if (top <= headerOffset) {
          activeHeading = h;
        } else {
          break;
        }
      }
    }

    if (activeHeading) {
      const activeId = activeHeading.id;
      let activeItem = null;

      sidebarToc.querySelectorAll('.toc-item').forEach(item => {
        const isMatch = item.dataset.targetId === activeId;
        item.classList.toggle('active', isMatch);
        if (isMatch) activeItem = item;
      });

      // Keep active TOC item automatically scrolled into view in sidebar
      if (activeItem) {
        const sidebarRect = sidebarToc.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        if (itemRect.top < sidebarRect.top + 30 || itemRect.bottom > sidebarRect.bottom - 30) {
          const scrollTarget = (itemRect.top - sidebarRect.top) - (sidebarRect.height / 2) + (itemRect.height / 2);
          sidebarToc.scrollBy({
            top: scrollTarget,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  // Attach global passive scroll listener
  window.addEventListener('scroll', updateScrollSync, { passive: true });

  // --- Render Reader View for Specific Chapter ---
  function renderChapterReader(chapterId) {
    const chIndex = chaptersData.chapters.findIndex(c => c.id === chapterId);
    if (chIndex === -1) {
      showHomeView();
      return;
    }

    currentChapterIndex = chIndex;
    const ch = chaptersData.chapters[chIndex];

    // Toggle views
    homeView.style.display = 'none';
    readerView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Breadcrumbs
    breadcrumbContainer.style.display = 'flex';
    breadcrumbChapter.textContent = `Chapter ${ch.number}`;

    // Meta Block
    readerChapterBadge.textContent = `CHAPTER ${ch.number}`;
    readerTimeBadge.textContent = ch.duration;
    readerChapterTitle.textContent = ch.title;
    readerChapterSynopsis.textContent = ch.subtitle;

    // Checkbox status
    const isDone = completedChapters.has(ch.number);
    markCompleteBtn.classList.toggle('completed', isDone);
    markCompleteText.textContent = isDone ? 'Chapter Completed' : 'Mark as Completed';

    // Dropdown value sync
    if (chapterSelectDropdown) chapterSelectDropdown.value = ch.id;

    // Render TOC in Sidebar
    sidebarToc.innerHTML = '';
    if (ch.toc && ch.toc.length > 0) {
      ch.toc.forEach(item => {
        const a = document.createElement('a');
        a.href = `#${item.id}`;
        a.className = `toc-item toc-level-${item.level}`;
        a.dataset.targetId = item.id;
        a.textContent = item.text;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const targetEl = document.getElementById(item.id);
          if (targetEl) {
            isTocClickScrolling = true;
            clearTimeout(tocClickTimer);

            sidebarToc.querySelectorAll('.toc-item').forEach(it => it.classList.remove('active'));
            a.classList.add('active');

            // Scroll sidebar TOC to center this item
            const sidebarRect = sidebarToc.getBoundingClientRect();
            const itemRect = a.getBoundingClientRect();
            const scrollTarget = (itemRect.top - sidebarRect.top) - (sidebarRect.height / 2) + (itemRect.height / 2);
            sidebarToc.scrollBy({ top: scrollTarget, behavior: 'smooth' });

            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

            tocClickTimer = setTimeout(() => {
              isTocClickScrolling = false;
              updateScrollSync();
            }, 600);
          }
        });
        sidebarToc.appendChild(a);
      });
    }

    // Render Markdown Content
    const parsedHtml = parseMarkdown(ch.content);
    readerMarkdownContent.innerHTML = parsedHtml;

    // Attach runner handlers
    attachCodeBlockListeners(readerMarkdownContent);

    // Initial sync
    setTimeout(updateScrollSync, 60);

    // Previous / Next Chapter Buttons
    const prevCh = chaptersData.chapters[chIndex - 1];
    const nextCh = chaptersData.chapters[chIndex + 1];

    if (prevCh) {
      prevChapterBtn.style.visibility = 'visible';
      prevChapterTitle.textContent = `${prevCh.number} · ${prevCh.title}`;
      prevChapterBtn.onclick = () => { window.location.hash = `#${prevCh.id}`; };
    } else {
      prevChapterBtn.style.visibility = 'hidden';
    }

    if (nextCh) {
      nextChapterBtn.style.visibility = 'visible';
      nextChapterTitle.textContent = `${nextCh.number} · ${nextCh.title}`;
      nextChapterBtn.onclick = () => { window.location.hash = `#${nextCh.id}`; };
    } else {
      nextChapterBtn.style.visibility = 'hidden';
    }
  }

  function showHomeView() {
    homeView.style.display = 'block';
    readerView.style.display = 'none';
    breadcrumbContainer.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateProgressDisplay();
  }

  // --- Mark Complete Button Handler ---
  markCompleteBtn.addEventListener('click', () => {
    const ch = chaptersData.chapters[currentChapterIndex];
    if (ch) {
      toggleChapterComplete(ch.number);
    }
  });

  // --- Router ---
  function handleRoute() {
    const hash = window.location.hash.slice(1);
    if (!hash || hash === 'home') {
      showHomeView();
    } else if (hash.startsWith('chapter-')) {
      renderChapterReader(hash);
    } else {
      // Check if it's an anchor on current page
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  window.addEventListener('hashchange', handleRoute);

  const heroStartBtn = document.getElementById('hero-start-btn');
  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#chapter-01';
      handleRoute();
    });
  }

  const brandLink = document.getElementById('brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#home';
      handleRoute();
    });
  }

  // --- Scratchpad Setup & Handlers ---
  function openScratchpad(presetKey) {
    scratchpadOverlay.style.display = 'flex';
    if (presetKey && PRESET_SNIPPETS[presetKey]) {
      scratchpadTextarea.value = PRESET_SNIPPETS[presetKey];
      if (scratchpadTemplateSelect) scratchpadTemplateSelect.value = presetKey;
    } else if (!scratchpadTextarea.value.trim()) {
      const savedCode = localStorage.getItem(STORAGE_KEY_SCRATCHPAD);
      scratchpadTextarea.value = savedCode || PRESET_SNIPPETS.practice;
    }
    scratchpadTextarea.focus();
  }

  function closeScratchpad() {
    scratchpadOverlay.style.display = 'none';
    localStorage.setItem(STORAGE_KEY_SCRATCHPAD, scratchpadTextarea.value);
  }

  scratchpadToggleBtn.addEventListener('click', () => openScratchpad());
  if (heroScratchpadBtn) heroScratchpadBtn.addEventListener('click', () => openScratchpad());
  if (readerOpenScratchpad) readerOpenScratchpad.addEventListener('click', () => openScratchpad());
  if (floatingScratchpadBtn) floatingScratchpadBtn.addEventListener('click', () => openScratchpad());

  scratchpadCloseBtn.addEventListener('click', closeScratchpad);
  scratchpadOverlay.addEventListener('click', (e) => {
    if (e.target === scratchpadOverlay) closeScratchpad();
  });

  scratchpadTemplateSelect.addEventListener('change', (e) => {
    const key = e.target.value;
    if (PRESET_SNIPPETS[key]) {
      scratchpadTextarea.value = PRESET_SNIPPETS[key];
      scratchpadConsole.innerHTML = '';
      scratchpadExecTime.style.display = 'none';
    }
  });

  scratchpadRunBtn.addEventListener('click', () => {
    executeJavaScript(scratchpadTextarea.value, scratchpadConsole, scratchpadExecTime);
  });

  scratchpadClearBtn.addEventListener('click', () => {
    scratchpadConsole.innerHTML = '';
    scratchpadExecTime.style.display = 'none';
  });

  const scratchpadBody = document.querySelector('.scratchpad-body');
  const scratchpadLayoutBtn = document.getElementById('scratchpad-layout-btn');
  const layoutBtnLabel = document.getElementById('layout-btn-label');
  const scratchpadExpandBtn = document.getElementById('scratchpad-expand-btn');
  const expandBtnLabel = document.getElementById('expand-btn-label');

  const STORAGE_KEY_SCRATCHPAD_LAYOUT = 'js_principles_scratchpad_layout';
  const STORAGE_KEY_SCRATCHPAD_EXPAND = 'js_principles_scratchpad_expand';

  // Apply saved layout
  const savedLayout = localStorage.getItem(STORAGE_KEY_SCRATCHPAD_LAYOUT) || 'side-by-side';
  if (savedLayout === 'stacked' && scratchpadBody) {
    scratchpadBody.classList.add('layout-stacked');
    if (layoutBtnLabel) layoutBtnLabel.textContent = 'Stacked';
  } else if (scratchpadBody) {
    scratchpadBody.classList.remove('layout-stacked');
    if (layoutBtnLabel) layoutBtnLabel.textContent = 'Side-by-Side';
  }

  // Apply saved expand state
  const isExpanded = localStorage.getItem(STORAGE_KEY_SCRATCHPAD_EXPAND) === 'true';
  if (isExpanded && scratchpadDrawer) {
    scratchpadDrawer.classList.add('is-expanded');
    if (expandBtnLabel) expandBtnLabel.textContent = 'Collapse';
    if (scratchpadExpandBtn) scratchpadExpandBtn.classList.add('active');
  }

  if (scratchpadLayoutBtn) {
    scratchpadLayoutBtn.addEventListener('click', () => {
      const isStacked = scratchpadBody.classList.toggle('layout-stacked');
      const newLayout = isStacked ? 'stacked' : 'side-by-side';
      if (layoutBtnLabel) layoutBtnLabel.textContent = isStacked ? 'Stacked' : 'Side-by-Side';
      localStorage.setItem(STORAGE_KEY_SCRATCHPAD_LAYOUT, newLayout);
    });
  }

  if (scratchpadExpandBtn) {
    scratchpadExpandBtn.addEventListener('click', () => {
      const expanded = scratchpadDrawer.classList.toggle('is-expanded');
      scratchpadExpandBtn.classList.toggle('active', expanded);
      if (expandBtnLabel) expandBtnLabel.textContent = expanded ? 'Collapse' : 'Expand';
      localStorage.setItem(STORAGE_KEY_SCRATCHPAD_EXPAND, expanded ? 'true' : 'false');
    });
  }

  scratchpadResetBtn.addEventListener('click', () => {
    scratchpadTextarea.value = PRESET_SNIPPETS.practice;
    scratchpadConsole.innerHTML = '';
    scratchpadExecTime.style.display = 'none';
  });

  // Hotkey: Ctrl+Enter to run in scratchpad
  scratchpadTextarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeJavaScript(scratchpadTextarea.value, scratchpadConsole, scratchpadExecTime);
    }
    // Tab indent support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = scratchpadTextarea.selectionStart;
      const end = scratchpadTextarea.selectionEnd;
      scratchpadTextarea.value =
        scratchpadTextarea.value.substring(0, start) + '  ' + scratchpadTextarea.value.substring(end);
      scratchpadTextarea.selectionStart = scratchpadTextarea.selectionEnd = start + 2;
    }
  });

  // --- Search Omnibar Implementation ---
  function openSearch() {
    searchModalBackdrop.style.display = 'flex';
    globalSearchInput.value = '';
    globalSearchInput.focus();
    renderSearchResults('');
  }

  function closeSearch() {
    searchModalBackdrop.style.display = 'none';
  }

  function renderSearchResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      searchResultsContainer.innerHTML = `
        <div class="search-empty-state">
          Type a keyword, concept (e.g. <code>closures</code>, <code>event loop</code>, <code>prototype</code>, <code>destructuring</code>), or chapter title.
        </div>
      `;
      return;
    }

    const results = [];

    chaptersData.chapters.forEach(ch => {
      // Title match
      if (ch.title.toLowerCase().includes(q)) {
        results.push({
          chapter: ch,
          type: 'Chapter Title',
          snippet: ch.subtitle,
          anchor: ''
        });
      }

      // TOC / Module match
      if (ch.toc) {
        ch.toc.forEach(item => {
          if (item.text.toLowerCase().includes(q)) {
            results.push({
              chapter: ch,
              type: 'Section Heading',
              snippet: item.text,
              anchor: `#${item.id}`
            });
          }
        });
      }

      // Content match snippet
      const contentLower = ch.content.toLowerCase();
      const idx = contentLower.indexOf(q);
      if (idx !== -1 && results.length < 20) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(ch.content.length, idx + 80);
        const snippet = '...' + ch.content.slice(start, end).replace(/\n/g, ' ') + '...';
        results.push({
          chapter: ch,
          type: 'Content Match',
          snippet: snippet,
          anchor: ''
        });
      }
    });

    if (results.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="search-empty-state">
          No matches found for "<strong>${escapeSearch(q)}</strong>". Try another keyword.
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = '';
    results.slice(0, 15).forEach(res => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="search-result-header">
          <span class="search-result-badge">${res.chapter.number}</span>
          <span class="search-result-title">${res.chapter.title}</span>
          <span class="shortcut-key" style="margin-left:auto">${res.type}</span>
        </div>
        <div class="search-result-match">${escapeSearch(res.snippet)}</div>
      `;

      item.addEventListener('click', () => {
        closeSearch();
        window.location.hash = `#${res.chapter.id}${res.anchor}`;
      });

      searchResultsContainer.appendChild(item);
    });
  }

  function escapeSearch(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  searchTriggerBtn.addEventListener('click', openSearch);
  if (heroSearchBtn) heroSearchBtn.addEventListener('click', openSearch);
  searchModalCloseBtn.addEventListener('click', closeSearch);

  searchModalBackdrop.addEventListener('click', (e) => {
    if (e.target === searchModalBackdrop) closeSearch();
  });

  globalSearchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Press '/' to search (unless inside an active input or textarea)
    if (
      e.key === '/' &&
      document.activeElement.tagName !== 'INPUT' &&
      document.activeElement.tagName !== 'TEXTAREA'
    ) {
      e.preventDefault();
      openSearch();
    }
    // Press Esc to close search or scratchpad
    if (e.key === 'Escape') {
      if (searchModalBackdrop.style.display !== 'none') closeSearch();
      if (scratchpadOverlay.style.display !== 'none') closeScratchpad();
    }
  });

  // --- Initial Boot ---
  renderCurriculum();
  updateProgressDisplay();
  handleRoute();

})();
