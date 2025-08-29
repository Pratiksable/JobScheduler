
# Job Scheduler Service

A full-stack microservice for scheduling, managing, and visualizing jobs. It features a FastAPI backend for robust API and scheduling logic, and a dynamic React frontend for user interaction.

---

## ✨ Features

### Backend
- **Job Scheduling**: Uses `APScheduler` to run tasks at specified intervals.
- **RESTful API**: Full CRUD (Create, Read, Update, Delete) functionality for managing jobs.
- **Database Integration**: Employs SQLAlchemy ORM with SQLite for data persistence and Alembic for migrations.
- **Automatic Docs**: Instant API documentation via Swagger UI and ReDoc, provided by FastAPI.

### Frontend
- **Interactive Dashboard**: A full calendar view of all scheduled jobs using FullCalendar.
- **Job Management**: Easily create, view, and edit jobs through a clean modal interface.
- **Modern Tech**: Built with React, TypeScript, and Vite for a fast, modern development experience.
- **Responsive Design**: Styled with TailwindCSS, ensuring the interface is clean and usable on all devices.

---

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, APScheduler, SQLAlchemy
- **Frontend**: React, TypeScript, Vite, TailwindCSS, FullCalendar
- **Database**: SQLite

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Git
- Python 3.8+
- Node.js and npm

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# On Windows:
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the application
# The server will be available at http://localhost:8000
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Run the development server
# The frontend will be available at http://localhost:5173
npm run dev
```

---

## ⚙️ API Endpoints

The backend exposes the following endpoints for managing schedules. You can also see the full, interactive documentation by running the backend and navigating to `/docs`.

- `GET /schedules/`: Retrieve a list of all jobs.
- `GET /schedules/{id}`: Retrieve a specific job by its ID.
- `POST /schedules/`: Create a new job.
- `PATCH /schedules/{id}`: Update an existing job.
- `DELETE /schedules/{id}`: Delete a job.

---

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE.md](frontend/LICENSE.md) file for details.
