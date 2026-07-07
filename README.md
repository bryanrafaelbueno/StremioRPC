<div align="center">
  <img src="Assets/DiscordRPCStremioLarge.png" alt="StremioRPC logo" />
  <h1>StremioRPC</h1>
  <p><em>Desktop dashboard for sending your Stremio activity to Discord Rich Presence</em></p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
    <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  </p>
</div>

## Overview

StremioRPC brings your Stremio activity into Discord Rich Presence with a simple desktop experience. After installing a release, you can launch the app, connect your Discord account, and let it automatically show what you are watching without extra setup.

## What you get

- A small dashboard to configure Discord and optional metadata lookup
- Automatic Rich Presence updates for movies and series
- A tray-friendly experience with minimization and startup options
- A quick install flow for the local Stremio addon from the app itself

## How it works for users

1. Install the latest release for your platform.
2. Launch StremioRPC and enter your Discord Client ID.
3. Optionally add an OMDb API key for cleaner titles.
4. Start watching in Stremio and your Discord status updates automatically.

## Requirements

Before using the app, make sure you have:

- Discord Desktop running
- Stremio installed on your machine

## Configuration

Open the dashboard and fill in the available fields:

- Discord Client ID: your Discord application ID
- OMDb API Key: optional, used to show the real media title
- Run on Boot: enables autostart for supported platforms
- Minimize to Tray: keeps the app running in the system tray instead of closing fully

The app stores its settings in the user data directory as a JSON file named config.json.

## Developer build instructions

To package the app for the current platform:

```bash
npm run dist
```

For explicit targets from Linux or macOS:

```bash
npm run dist:linux
npm run dist:win
```

Use `npm run dist:win` when you want a Windows build from a Linux or macOS machine. It produces the Windows executable package directly.

## Developer setup

If you want to work on the project locally:

```bash
git clone https://github.com/bryanrafaelbueno/StremioRPC.git
cd StremioRPC
npm install
npm start
```

## Building a distribution

To package the app for the current platform:

```bash
npm run dist
```

For explicit targets from Linux or macOS:

```bash
npm run dist:linux
npm run dist:win
```

Use `npm run dist:win` when you want a Windows build from a Linux or macOS machine. It produces the Windows executable package directly.

## Project structure

```text
StremioRPC/
├── Assets/                # App icons and images
├── index.js               # Electron main process and addon server logic
├── index.html             # Dashboard UI layout
├── preload.js             # IPC bridge for the renderer
├── renderer.js            # Dashboard behavior and status updates
├── package.json           # Scripts, dependencies, and electron-builder config
└── README.md              # Project documentation
```

## License

This project is licensed under the MIT license. See the LICENSE file for details.
