# iOS Capacitor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Capacitor iOS target so the existing English Master IELTS app can be built for iPhone on macOS/Xcode.

**Architecture:** Reuse the existing Vite web app and Capacitor configuration. Add the iOS Capacitor package, npm scripts, generated `ios/` platform files, and documentation for the Apple build/signing step.

**Tech Stack:** React 18, Vite 5, Capacitor 8, iOS/Xcode.

---

### Task 1: Add iOS Package and Scripts

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install Capacitor iOS**

Run: `npm install @capacitor/ios@^8.3.4`

Expected: `package.json` and `package-lock.json` include `@capacitor/ios`.

- [ ] **Step 2: Add iOS scripts**

Modify `package.json` scripts so it includes:

```json
"ios:sync": "vite build && cap sync ios",
"ios:open": "vite build && cap sync ios && cap open ios"
```

Expected: Android scripts remain unchanged.

### Task 2: Generate iOS Platform

**Files:**
- Create: `ios/`

- [ ] **Step 1: Generate platform**

Run: `npx cap add ios`

Expected: Capacitor creates `ios/` using `appId` `com.nguyenanduong.englishmasterielts` and `appName` `English Master IELTS`.

- [ ] **Step 2: Sync web build**

Run: `npm run ios:sync`

Expected: Vite build succeeds, then Capacitor syncs the `dist` build into `ios/`.

### Task 3: Add iOS Build Documentation

**Files:**
- Create: `BUILD_IOS.md`

- [ ] **Step 1: Write iOS instructions**

Create `BUILD_IOS.md` explaining:

```text
- Windows can prepare the iOS target but cannot build/sign an IPA.
- A Mac with Xcode is required.
- Run npm install, npm run ios:sync, then npm run ios:open on the Mac.
- In Xcode, select a Team, connect the iPhone, choose the device, and press Run.
- For TestFlight/App Store, archive and upload from Xcode.
```

- [ ] **Step 2: Verify docs match scripts**

Run: `Select-String -Path package.json -Pattern 'ios:sync|ios:open'`

Expected: Both script names appear.

### Task 4: Final Verification

**Files:**
- Read-only verification across project files.

- [ ] **Step 1: Build web app**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 2: Check iOS platform status**

Run: `Test-Path ios`

Expected: `True` if platform generation succeeded. If Capacitor blocks generation on Windows, document that the same `npx cap add ios` command must be run on a Mac.
