# Phase 9: Working With Servers 🌍

> **Goal**: Master client-server communication, the HTTP protocol, REST conventions, the modern Fetch API, request lifecycle, authentication headers, error handling, and request abortion with `AbortController`.

---

## Table of Contents
1. [Module 21: APIs & HTTP Architecture](#module-21-apis--http-architecture)
   - [21.1 What is an API & REST Architecture](#211-what-is-an-api--rest-architecture)
   - [21.2 The HTTP Protocol & Request-Response Cycle](#212-the-http-protocol--request-response-cycle)
   - [21.3 HTTP Methods: GET, POST, PUT, PATCH, DELETE](#213-http-methods-get-post-put-patch-delete)
   - [21.4 HTTP Status Codes Master Reference](#214-http-status-codes-master-reference)
   - [21.5 Cross-Origin Resource Sharing (CORS) Fundamentals](#215-cross-origin-resource-sharing-cors-fundamentals)
2. [Module 22: The Modern Fetch API](#module-22-the-modern-fetch-api)
   - [22.1 Fetching Data (GET Requests)](#221-fetching-data-get-requests)
   - [22.2 The Great Fetch Gotcha: `response.ok`](#222-the-great-fetch-gotcha-responseok)
   - [22.3 Sending Data (POST Requests with JSON)](#223-sending-data-post-requests-with-json)
   - [22.4 Updating & Deleting (PUT, PATCH, DELETE)](#224-updating--deleting-put-patch-delete)
   - [22.5 Handling JSON: Stringify, Parse, Replacers, Revivers](#225-handling-json-stringify-parse-replacers-revivers)
   - [22.6 Request Cancellation & Timeouts with `AbortController`](#226-request-cancellation--timeouts-with-abortcontroller)
3. [Hands-On Practice Challenges & Solutions](#hands-on-practice-challenges--solutions)

---

# Module 21: APIs & HTTP Architecture

### 21.1 What is an API & REST Architecture
An **API (Application Programming Interface)** defines rules for software programs to communicate. A **REST (Representational State Transfer)** API treats system data as **Resources** identified by URLs (e.g., `/api/users/42`).

---

### 21.2 The HTTP Protocol & Request-Response Cycle
HTTP is a stateless, application-layer request-response protocol.

```
CLIENT (Browser)                                         SERVER
   │                                                       │
   ├─── 1. HTTP Request (Method, URL, Headers, Body) ────►│
   │                                                       │ (Processes logic, queries DB)
   │◄── 2. HTTP Response (Status Code, Headers, Body) ─────┤
```

---

### 21.3 HTTP Methods

| Method | Purpose | Has Body? | Safe? | Idempotent? |
| :--- | :--- | :---: | :---: | :---: |
| **GET** | Retrieve resource | ❌ No | ✅ Yes | ✅ Yes |
| **POST** | Create new subordinate resource | ✅ Yes | ❌ No | ❌ No |
| **PUT** | Completely replace existing resource | ✅ Yes | ❌ No | ✅ Yes |
| **PATCH** | Partially update existing resource | ✅ Yes | ❌ No | ❌ No |
| **DELETE** | Remove resource | ❌ No | ❌ No | ✅ Yes |

*Definitions*:
- **Safe**: Does not alter server state.
- **Idempotent**: Making $N > 0$ identical requests produces the identical server state as 1 request.

---

### 21.4 HTTP Status Codes Master Reference
- **`2xx` Success**:
  - `200 OK`: Request succeeded.
  - `201 Created`: Resource successfully created (common response to POST).
  - `204 No Content`: Succeeded, but response body is intentionally empty (common for DELETE).
- **`3xx` Redirection**:
  - `301 Moved Permanently`: Resource URL changed permanently.
  - `304 Not Modified`: Cached copy remains valid (saves bandwidth).
- **`4xx` Client Error**:
  - `400 Bad Request`: Malformed syntax or invalid payload schema.
  - `401 Unauthorized`: Authentication credentials missing or invalid.
  - `403 Forbidden`: Authenticated, but lacking permissions/authorization.
  - `404 Not Found`: Resource URL does not exist.
  - `429 Too Many Requests`: Rate limit exceeded.
- **`5xx` Server Error**:
  - `500 Internal Server Error`: Uncaught crash in server logic.
  - `502 Bad Gateway`: Proxy/load balancer received an invalid upstream response.
  - `503 Service Unavailable`: Server overloaded or undergoing maintenance.

---

### 21.5 Cross-Origin Resource Sharing (CORS) Fundamentals
By default, browsers enforce the **Same-Origin Policy** (same protocol, domain, and port). When your client app on `http://localhost:3000` fetches from `https://api.myapp.com`:
1. The browser sends a preflight **`OPTIONS`** HTTP request.
2. The server must respond with appropriate headers:
   - `Access-Control-Allow-Origin: http://localhost:3000` (or `*`)
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`

---

# Module 22: The Modern Fetch API

### 22.1 Fetching Data & 22.2 The Great Fetch Gotcha
> [!CRITICAL]
> The native `fetch()` Promise **does NOT reject on HTTP 404 or 500 errors!** It only rejects on total network failures (loss of internet connection, DNS failure, or CORS rejection).

To correctly handle API errors, you **must inspect `response.ok`**:

```javascript
async function fetchUserProfile(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

    // Check if HTTP status is outside the 200-299 range:
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText})`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error;
  }
}
```

---

### 22.3 Sending Data (POST) & Updating (PUT/PATCH)

```javascript
// POST: Creating a resource
async function createPost(newPost) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
    },
    body: JSON.stringify(newPost) // Must serialize object to JSON string!
  });

  if (!response.ok) throw new Error("Failed to create post");
  return await response.json();
}

// PATCH: Partially updating a resource
async function updatePostTitle(postId, newTitle) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle })
  });

  if (!response.ok) throw new Error("Update failed");
  return await response.json();
}

// DELETE: Removing a resource
async function deletePost(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    method: "DELETE"
  });

  if (!response.ok) throw new Error("Deletion failed");
  return true;
}
```

---

### 22.4 Request Cancellation with `AbortController`
`AbortController` allows cancelling ongoing network requests (e.g., when a user types in a search box and you want to abort the previous query):

```javascript
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
```

---

# Hands-On Practice Challenges & Solutions

### Challenge: Production-Grade Resilient HTTP Client
**Task**: Write an `apiClient(url, options)` wrapper that:
1. Automatically serializes JSON request bodies and sets `Content-Type: application/json`.
2. Checks `response.ok` and extracts error messages from JSON error responses if available.
3. Automatically retries failed requests up to `retries` times on `5xx` server errors with exponential backoff.

<details>
<summary>👉 View Solution</summary>

```javascript
async function apiClient(url, { body, headers = {}, retries = 2, delayMs = 500, ...customConfig } = {}) {
  const config = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, config);

      if (response.ok) {
        // Return null for 204 No Content, otherwise parse JSON:
        return response.status === 204 ? null : await response.json();
      }

      // If 4xx client error, do not retry:
      if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json().catch(() => ({}));
        const err = new Error(errorData.message || `Client error with status ${response.status}`);
        err.isClientError = true;
        throw err;
      }

      // If 5xx server error and retries remain, wait and retry:
      if (response.status >= 500 && attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt)));
        continue;
      }

      // Server 5xx with no retries left:
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    } catch (err) {
      // Never retry 4xx client errors or when retries are exhausted:
      if (err.isClientError || attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt)));
    }
  }
}
```
</details>

---

## 🚀 What's Next?
Proceed to **[Phase 10: Professional JavaScript 💼](file:///c:/Users/mritu/IdeaProjects/Javascript/learnings/10-professional-javascript.md)** to master ES Modules, Error Architecture, Browser Storage (Local, Session, Cookies), and Node.js fundamentals (`fs`, `process`, `npm`).
