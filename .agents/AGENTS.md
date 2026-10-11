# Project-Scoped Agent Guidelines & Rules

Welcome to the **English Master IELTS** project workspace. To ensure the highest level of capability, efficiency, and engineering excellence, all agent operations in this workspace must strictly adhere to the following rules:

---

## 🚀 1. Logic & Coding Standards (Efficiency +300%)

- **No Placeholders**: Never write TODOs or placeholders in the codebase. All code edits must be complete, functional, and production-ready.
- **Strict Typing & Contracts**:
  - Always validate API contracts and input arguments.
  - Implement robust guard clauses (e.g., `if (!data) return;`) at the beginning of functions to prevent undefined references.
- **Resource Management**:
  - Always clean up event listeners, timers, subscriptions, and native listeners in `useEffect` or lifecycle hooks.
  - Properly dispose of media elements (e.g., `Audio` instances) to prevent memory leaks on Android WebViews.
- **Asynchronous Integrity**:
  - Never mix `Promise.then()` with `async/await`. Use `async/await` consistently.
  - Always wrap asynchronous native plugins (Capacitor) in `try/catch` blocks to handle hardware/permission failures gracefully.

---

## 🔒 2. Security Hardening (Security +300%)

- **Zero Hardcoded Credentials**: Never write API keys, client secrets, passwords, or configuration tokens in code. Use environment variables (via `process.env` or `import.meta.env`).
- **Data Protection**:
  - Do not log sensitive user data (credentials, personally identifiable information, transcriptions).
  - Use secure, native storage mechanisms for authentication tokens (e.g., Secure Storage Capacitor plugins instead of plain localStorage where possible).

---

## 🧪 3. Quality & Test-Driven Discipline (Reliability +300%)

- **Verification First**: Every bug fix or feature implementation must be verified.
  - For UI changes: Check component mounting and responsive layout.
  - For functional logic: Run existing test suites (`npm run test` or similar) to ensure zero regressions.
- **Regression Checks**: Before presenting results, check the build status locally using:
  - `npm run build`
  - `npx cap sync` (if native Android is affected)

---

## 📱 4. Offline-First & Mobile Optimization (Performance +300%)

- **WebView Guardrails**: Remember that the app runs inside an Android WebView. Do not use desktop-only browser APIs without polyfills (e.g., standard browser Speech Recognition).
- **SQLite Performance**:
  - Always use SQL transactions (`beginTransaction`/`commitTransaction`) when performing bulk database inserts or updates to avoid blocking the main UI thread.
  - Define explicit composite indexes for queries involving filter and sort clauses.
