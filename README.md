# Wrize Blog Project

An advanced blog application with a Django REST Framework backend and a React (Vite) frontend.

## 🚀 How to Start the Project

You need to run two separate terminals: one for the backend and one for the frontend.

### 1. Backend (Django)
Open a terminal in the project root (`/Users/aras/Documents/PlayingGround/blogapi`) and run:

```bash
# Activate the virtual environment
source .venv/bin/activate

# Start the server
python manage.py runserver
```
The backend will run at [http://127.0.0.1:8000](http://127.0.0.1:8000).

### 2. Frontend (React/Vite)
Open a **new** terminal, navigate to the frontend directory, and start the development server:

```bash
cd frontend
npm run dev
```
The frontend will run at [http://localhost:5173](http://localhost:5173).

## 🔑 Admin Access
To manage posts, categories, and users, access the Django Admin:
- URL: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
