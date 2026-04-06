# clientchat

An embeddable real-time chat widget for partner sites. Part of a two-repo chat system.

## Overview

Lightweight client-facing chat plugin designed to be embedded on external partner sites. Connects to the same WebSocket backend as the internal operator SPA ([chat-frontend](https://github.com/avainroot/chat-frontend)), giving end users a minimal chat interface without the full operator toolset.

## Features

- Real-time messaging via WebSocket (socket.io)
- Rich text input via React Quill
- Virtual scroll for message history (simplebar-react)
- MUI 5 UI components with Emotion styling
- SCSS for custom widget theming
- Deployable as static build (serve)

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18, TypeScript |
| UI | MUI 5 (Material UI), Emotion, SCSS |
| Rich text | React Quill |
| Real-time | socket.io-client, WebSocket |
| Utils | axios, date-fns |
| Build | CRA 5 |

## Related

- [chat-frontend](https://github.com/avainroot/chat-frontend) — internal operator chat SPA

## Getting Started

```bash
npm install
npm start
```

## Scripts

```bash
npm start         # development server
npm run build     # production build
npm run static    # serve production build locally on :3000
npm test          # run tests
```
