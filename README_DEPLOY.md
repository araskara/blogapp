# Deployment Guide

This project supports multiple deployment methods.

## Option 1: Docker (Easiest / Recommended for Containers)

You can deploy using the Dockerfiles provided.

### Railway (Docker Method)
1.  **Repo**: Connect this repository to Railway.
2.  **Backend**:
    *   It will automatically detect the `Dockerfile` in the root.
    *   Set variables: `SECRET_KEY`, `DATABASE_URL` (add a Postgres plugin), `CORS_ALLOWED_ORIGINS`.
3.  **Frontend**:
    *   Add a new service, select the same repo.
    *   **Root Directory**: Set to `/frontend`.
    *   Railway will detect `frontend/Dockerfile`.
    *   **IMPORTANT**: You must set `VITE_API_BASE_URL` as a **Check variable** (Build Argument) or just hardcode it, because Vite builds at compile time.
    *   *Correction*: Docker build args in Railway are set in the settings. Or, ensuring the `VITE_API_BASE_URL` is available during the build phase.
    
### Docker Compose (Local / VPS)
Run `podman-compose up --build -d` (or `docker-compose`) to start.
**Access:**
*   Frontend: [http://localhost:8080](http://localhost:8080)
*   Backend API: `http://localhost:8000`

---

## Option 2: Standard (Git Push)

This project has been configured for deployment on Railway (and other PaaS providers).

## 1. Backend Deployment (Django)

1.  **Create a New Service** in Railway from this repository.
2.  Select the **Root Directory** as the project root (where `manage.py` is).
3.  Railway should auto-detect Python from `requirements.txt` and `runtime.txt`.
4.  **Add a Database**:
    *   Add a PostgreSQL service in Railway.
    *   Link it to your Django service. Railway will automatically provide a `DATABASE_URL` environment variable.
5.  **Configure Environment Variables**:
    *   `SECRET_KEY`: A long random string.
    *   `DEBUG`: `False` (for production).
    *   `ALLOWED_HOSTS`: `*` (or your specific railway domain).
    *   `CORS_ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://frontend-production.up.railway.app`). You can update this after deploying the frontend.
6.  **Build & key**:
    *   The `Procfile` command `gunicorn blogapi.wsgi` will be used to start the server.
    *   **Migrations**: You may need to run migrations. In Railway, you can add a "Build Command" or "Deploy Command" or simply run it via CLI: `python manage.py migrate`. A common pattern is to set the `Start Command` or use an `init` container. For simplicity, you can run `python manage.py migrate` in the Railway Shell after deployment, or add it to the start command: `python manage.py migrate && gunicorn blogapi.wsgi --log-file -`.

## 2. Frontend Deployment (React + Vite)

1.  **Create a New Service** in Railway from the same repository.
2.  Select the **Root Directory** as `frontend`.
3.  Railway should detect Node.js.
4.  **Configure Environment Variables**:
    *   `VITE_API_BASE_URL`: The URL of your deployed Backend service (e.g., `https://backend-production.up.railway.app`). **Important**: No trailing slash is safest, though the code handles it.
5.  **Build & Start**:
    *   Build Command: `npm run build`
    *   Start Command: `npm start` (This runs `npx serve -s dist`).

## 3. Final steps

1.  After both are deployed, copy the Frontend URL.
2.  Update the Backend `CORS_ALLOWED_ORIGINS` variable with the Frontend URL.
3.  Redeploy Backend.
4.  Create a Superuser:
    *   Use Railway CLI or Shell in the Dashboard: `python manage.py createsuperuser`.

**Notes**:
*   `whitenoise` is configured to serve static files for the Django admin.
*   The frontend uses `serve` to serve the static `dist` folder.
