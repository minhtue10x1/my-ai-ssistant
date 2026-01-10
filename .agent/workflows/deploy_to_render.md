---
description: Deploy Backend to Render
---

# Deploying Backend to Render.com

Render is a great choice for hosting Node.js applications. Since your backend is in a subdirectory (`backend/`), we will configure Render to build and run from there.

## Prerequisites
1.  **Push to GitHub**: Ensure your latest code (especially the MongoDB migration) is pushed to your GitHub repository.
    ```bash
    git add .
    git commit -m "Migrate to MongoDB and prepare for deployment"
    git push origin main
    ```

## Step 1: Create Web Service
1.  Log in to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub account and select your repository (`my-ai-ssistant` or similar).

## Step 2: Configure Service
Fill in the details:
*   **Name**: `my-ai-assistant-backend` (or unique name)
*   **Region**: Closest to you (e.g., Singapore, Oregon).
*   **Branch**: `main`
*   **Root Directory**: `backend` (This is CRITICAL because your server code is inside this folder).
*   **Runtime**: **Node**
*   **Build Command**: `npm install`
*   **Start Command**: `node server.js`

## Step 3: Environment Variables
Scroll down to the **"Environment Variables"** section and add the following keys from your `.env` file:

| Key | Value |
| --- | --- |
| `MONGO_URI` | `mongodb+srv://...` (Your actual Atlas connection string) |
| `JWT_SECRET` | `your_secret_key` |
| `GITHUB_ACCESS_TOKEN` | `ghp_...` (Your GitHub Token) |
| `OPENAI_API_KEY` | `sk-...` |
| `GOOGLE_CLIENT_ID` | `...` |
| `GOOGLE_CLIENT_SECRET` | `...` |

## Step 4: Deploy
1.  Click **"Create Web Service"**.
2.  Render will start building your app. Watch the logs.
3.  Once finished, it will provide a URL like `https://my-ai-assistant-backend.onrender.com`.

## Step 5: Update Frontend
1.  Copy your new Render Backend URL.
2.  In your local code, go to `frontend/src/context/AuthContext.jsx` and `Workflows.jsx` and replace `http://localhost:5000` and `/api` references with your new Render URL.
3.  Re-deploy frontend to Firebase:
    ```bash
    cd frontend
    npm run build
    firebase deploy --only hosting
    ```
