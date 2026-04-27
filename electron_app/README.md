# Bunny Timer Electron App

This folder contains a desktop Electron version of Bunny Timer.

## Prerequisites

- Node.js 18+ (Node 20+ recommended)

## Install

From the project root:

```bash
cd electron_app
npm install
```

## Run

```bash
npm start
```

## Develop (auto-reload)

Use this during development to automatically reload/restart when files change.

```bash
npm run dev
```

## What is included

- `main.js`: Electron main process (creates the desktop window).
- `preload.js`: Safe bridge for renderer context.
- `renderer/index.html`: Renderer UI shell.
- `renderer/styles.css`: Bunny Timer styling and animations.
- `renderer/app.js`: Timer logic (start/pause/resume/reset and progress animation).

## Notes

- The timer logic is aligned with the original bunny app behavior (countdown, movement, pause/resume, and finished state).
- This Electron version is self-contained and does not rely on external image assets.
