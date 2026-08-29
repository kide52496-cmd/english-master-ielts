# iOS Capacitor Design

## Goal

Prepare English Master IELTS for installation on iPhone by adding a Capacitor iOS target beside the existing Android target.

## Current State

- The app is a React/Vite project.
- Capacitor is already configured for Android.
- The web build is emitted to `dist`.
- No `ios/` project exists yet.
- This directory is not currently a Git repository, so design commits are not available here.

## Recommended Approach

Use Capacitor iOS. This keeps the current app code and wraps the existing offline web build in a native iOS shell. It matches the existing Android approach and avoids rewriting the app in Swift.

## Alternatives Considered

- PWA on iPhone: quickest, but not a real app package and has weaker native integration.
- Full Swift rewrite: native, but too much work and unnecessary for this app.

## Architecture

- Add `@capacitor/ios` as a project dependency.
- Keep `capacitor.config.json` as the shared native app configuration.
- Add npm scripts for iOS build/sync/open flows.
- Generate an `ios/` Capacitor project with the same app id and app name.
- Document the Mac/Xcode requirement for building and installing on iPhone.

## Build and Install Constraints

Windows can prepare the iOS target files, but Apple requires macOS and Xcode for simulator/device builds, code signing, archive export, TestFlight, and App Store distribution.

The deliverable from this Windows machine is a project that can be copied or opened on a Mac and built in Xcode.

## Verification

- `npm run build` must pass.
- `npx cap add ios` or equivalent iOS generation should complete if Capacitor supports it in this environment.
- `npm run ios:sync` should sync the latest `dist` into the iOS project when the platform exists.
- Documentation should clearly state how to finish the iPhone install on macOS.
