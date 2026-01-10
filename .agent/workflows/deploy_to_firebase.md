---
description: Deploy Backend and Frontend to Firebase
---

# Deploying to Firebase

This guide covers deploying the Node.js backend to **Cloud Functions** and the React frontend to **Firebase Hosting**.

## Prerequisites
1.  **Firebase CLI**: Install globally: `npm install -g firebase-tools`
2.  **Firebase Project**: Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
3.  **Hobby Plan**: You must be on the **Blaze (Pay as you go)** plan to use Cloud Functions (Node.js backend). The Spark (free) plan does NOT support external API calls (like OpenAI/GitHub) or Node.js backends.

---

## Part 1: Backend (Cloud Functions)

Since Firebase Functions are serverless, we need to wrap your Express app.

1.  **Login**:
    ```bash
    firebase login
    ```

2.  **Initialize Functions**:
    *   Navigate to root folder (parent of `backend`).
    *   Run: `firebase init functions`
    *   Select **JavaScript**.
    *   Do **not** overwrite `package.json` if possible, but you might need to move your backend code into the generated `functions` folder.
    *   **Better Strategy**: We'll restructure `backend` to be deployable.

3.  **Refactor for Functions**:
    *   Rename `backend/server.js` to `backend/app.js` (export the app instead of listening).
    *   Create `backend/index.js` for Firebase:
        ```javascript
        const functions = require('firebase-functions');
        const app = require('./app'); // Your Express App
        exports.api = functions.https.onRequest(app);
        ```
    *   *Note: Firebase Functions uses CommonJS (require) by default. If your app is ESM (import), you need to configure `engines` in package.json or use a transpiler.*

4.  **Environment Variables**:
    *   Firebase doesn't use `.env` file in production.
    *   Set config vars:
        ```bash
        firebase functions:config:set env.mongo_uri="YOUR_MONGO_URI" env.jwt_secret="SECRET" ...
        ```
    *   Update code to read `functions.config().env.mongo_uri`.

5.  **Deploy**:
    ```bash
    firebase deploy --only functions
    ```
    *   Your API URL will be: `https://us-central1-YOUR-PROJECT.cloudfunctions.net/api`

---

## Part 2: Frontend (Hosting)

1.  **Initialize Hosting**:
    *   Run: `firebase init hosting`
    *   "What do you want to use as your public directory?": **dist** (since we use Vite).
    *   "Configure as a single-page app?": **Yes**.

2.  **Update API URL**:
    *   In your frontend code (`App.jsx`, `Workflows.jsx`), replace `http://localhost:5000` with your new Firebase Function URL.

3.  **Build & Deploy**:
    ```bash
    cd frontend
    npm run build
    firebase deploy --only hosting
    ```

---

## Important Considerations for THIS Project

Since your specific project uses **ES Modules** (`import` syntax) throughout the backend, defaulting to standard Firebase Functions (CommonJS) will require refactoring or using the Node 18+ runtime which supports ESM.

**Recommended easier path:**
Deploy the **Frontend to Firebase Hosting** (free, fast, easy) and the **Backend to Render/Railway** (simpler for standard Node.js apps). This avoids the "Serverless Cold Start" and rewriting your entry point.
