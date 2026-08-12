# RoadGuardian AI local Setup Guide

This document supplies step-by-step instructions to download, install, build, and run the **RoadGuardian AI Platform** on any clean local development machine.

---

## 💻 1. System Requirements & Node Version

Please verify your computer has the following prerequisites installed:

- **Node.js:** Recommended Version **`v18.x`, `v20.x`, or `v22.x`** (tested and verified in CI under matrix Node versions).
- **Package Manager:** **`npm`** (packaged automatically with Node.js).
- **Supported Operating Systems:** Linux, macOS, or Windows WSL2.

To check your current Node version, run:

```bash
node -v
```

---

## 📦 2. Installation Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/username/roadguardian-ai.git
   cd roadguardian-ai
   ```

2. **Clean Dependency Installation:**
   Run the standard clean npm install script to populate directories:
   ```bash
   npm install
   ```
   _Note: Under standard development configurations, this sets up the React 19 compiler, Express 4, Vite 6, and Google GenAI SDK._

---

## 🚀 3. Run Steps

The server runs a full-stack configuration. Express proxies API requests and serves static client pages in production. In development mode, Vite's hot-reload middleware runs natively on port `3000`.

### 🛡️ Development Mode (with Live Reloading)

1. Ensure your `.env` contains your Gemini credentials (see Section 4).
2. Execute the development startup runner:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to: **`http://localhost:3000`**

### 🏗️ Production Build & Execution

To verify the application compiles and bundles cleanly for high-availability production runtimes:

1. Compile the React bundle and build the custom CommonJS backend via `esbuild`:
   ```bash
   npm run build
   ```
2. Launch the bundled server directly using Node:
   ```bash
   npm run start
   ```
3. The platform is now live and container-ready on **`http://localhost:3000`**.

---

## 🔒 4. Environment Variables Setup

Create a file named `.env` in the root folder of the project. You can copy the template directly:

```bash
cp .env.example .env
```

Open `.env` and configure your keys:

```env
# Google Gemini API credential for server-side AI evaluation metrics.
# Retrieve your real key from: https://aistudio.google.com/
GEMINI_API_KEY="AIzaSyYourGeminiAPIKeyHere"

# Self-referencing node URL (Localhost default)
APP_URL="http://localhost:3000"
```

---

## 🛠️ 5. Troubleshooting & Diagnostics

### Q1: Ports Collision (Port 3000 is already in use)

**Symptom:** Server crashes immediately on boot with `EADDRINUSE`.
**Resolution:** Locate the PID currently holding port 3000 and terminate it:

```bash
# On Linux/macOS
kill -9 $(lsof -t -i:3000)

# On Windows (cmd)
for /f "tokens=5" %a in ('netstat -aon ^| find "3000"') do taskkill /f /pid %a
```

### Q2: Missing ESM module resolution or runtime imports

**Symptom:** Launch issues regarding type annotations or import extensions.
**Resolution:** Use `npm run build` first to compile the backend into a single bundled file (`dist/server.cjs`). This bypasses ES Module relative file checks entirely. Then, launch via `npm run start`.

### Q3: Offline SOS SMS tool shows gibberish

**Symptom:** Compression panel displays a character string like `RG_SOS#C|...`.
**Resolution:** This is the _intended behaviour_. Our high-compression offline protocol packs GPS coordinates and severity signals into a micro-payload to fit within 160-char SMS packets during transit deadzones.
