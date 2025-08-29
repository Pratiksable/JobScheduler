# Scheduler Service API

This is the backend for the Scheduler Service, a FastAPI application designed to manage users and schedule jobs. It uses SQLAlchemy for ORM, Alembic for database migrations, and APScheduler for handling scheduled tasks.

## Features

- **User Management:** CRUD operations for users (Create, Read, Update, Delete).
- **User Authentication:** Simple email and password-based sign-in.
- **Job Scheduling:** CRUD operations for scheduled jobs.
- **Background Task Execution:** Scheduled jobs are executed in the background using APScheduler.
- **Database Migrations:** Manages database schema changes using Alembic.

## Technologies Used

- **Backend Framework:** FastAPI
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **Database Migrations:** Alembic
- **Job Scheduling:** APScheduler
- **API Schema Validation:** Pydantic

## Project Structure

```
backend/
├── alembic/                  # Alembic migration scripts
├── app/
│   ├── routes/               # API route definitions (currently in main.py)
│   ├── services/             # Business logic, like the scheduler
│   │   └── scheduler.py      # APScheduler setup and job functions
│   ├── __init__.py
│   ├── crud.py               # Database CRUD functions (currently in main.py)
│   ├── database.py           # Database engine and session setup
│   ├── main.py               # FastAPI app entry point and API endpoints
│   ├── models.py             # SQLAlchemy database models
│   └── schemas.py            # Pydantic schemas for data validation
├── alembic.ini               # Alembic configuration
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## Database Models

### `User`
Represents a user in the system.

| Column      | Type      | Constraints              | Description                   |
|-------------|-----------|--------------------------|-------------------------------|
| `id`        | Integer   | Primary Key, Indexed     | Unique identifier for the user|
| `first_name`| String    | Not Nullable             | User's first name             |
| `last_name` | String    | Not Nullable             | User's last name              |
| `email`     | String    | Unique, Not Nullable     | User's email address         |
| `password`  | String    | Not Nullable             | User's password (plaintext)   |
| `phone`     | String    | Unique, Not Nullable     | User's phone number           |
| `photo`     | String    | Nullable                 | URL to the user's photo       |
| `created_at`| DateTime  | Server Default (now)     | Timestamp of user creation    |
| `updated_at`| DateTime  | Server Default (now)     | Timestamp of last user update |

### `Schedule`
Represents a scheduled job.

| Column            | Type      | Constraints              | Description                        |
|-------------------|-----------|--------------------------|------------------------------------|
| `id`                | Integer   | Primary Key, Indexed     | Unique identifier for the schedule |
| `title`             | String    | Not Nullable             | Title of the job                   |
| `description`       | String    | Nullable                 | Detailed description of the job    |
| `is_completed`    | Boolean   | Default: `False`         | Status of the job                  |
| `schedule_interval` | String    | Not Nullable             | Cron expression for the schedule   |
| `last_run`          | DateTime  | Nullable                 | Timestamp of the last execution    |
| `next_run`          | DateTime  | Nullable                 | Timestamp of the next scheduled run|
| `created_at`        | DateTime  | Server Default (now)     | Timestamp of schedule creation     |
| `updated_at`        | DateTime  | Server Default (now)     | Timestamp of last schedule update  |

## API Endpoints

The base URL for the API is `/`.

### Root

- **GET /**
  - **Description:** Welcome endpoint.
  - **Response (200 OK):** `{"message": "Welcome to the Scheduler API"}`

### Schedules

- **POST /schedules/**
  - **Description:** Create a new scheduled job.
  - **Request Body:** `ScheduleCreateSchema`
    ```json
    {
      "title": "My New Job",
      "description": "This job does something important.",
      "schedule_interval": "* * * * *"
    }
    ```
  - **Response (200 OK):** `ScheduleSchema`

- **GET /schedules/**
  - **Description:** Retrieve all scheduled jobs.
  - **Response (200 OK):** `List[ScheduleSchema]`

- **GET /schedules/{id}**
  - **Description:** Retrieve a specific job by its ID.
  - **Response (200 OK):** `ScheduleSchema`

- **PATCH /schedules/{id}**
  - **Description:** Update a scheduled job.
  - **Request Body:** `ScheduleUpdateSchema`
    ```json
    {
      "title": "Updated Job Title"
    }
    ```
  - **Response (200 OK):** `ScheduleSchema`

- **DELETE /schedules/{id}**
  - **Description:** Delete a scheduled job.
  - **Response (200 OK):** `ScheduleSchema`

### Users

- **POST /user**
  - **Description:** Create a new user.
  - **Request Body:** `UserCreateSchema`
  - **Response (200 OK):** `UserSchema`

- **GET /user**
  - **Description:** Retrieve all users.
  - **Response (200 OK):** `List[UserSchema]`

- **GET /user/{id}**
  - **Description:** Retrieve a specific user by ID.
  - **Response (200 OK):** `UserSchema`

- **PATCH /user/{id}**
  - **Description:** Update a user's details.
  - **Request Body:** `UserUpdateSchema`
  - **Response (200 OK):** `UserSchema`

- **DELETE /user/{id}**
  - **Description:** Delete a user.
  - **Response (200 OK):** `UserSchema`

### Authentication

- **POST /auth/signin**
  - **Description:** Authenticate a user.
  - **Request Body:** `LoginSchema`
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response (200 OK):**
    ```json
    {
      "token": "fake-jwt-token",
      "user": { ... }
    }
    ```

## Getting Started

### Prerequisites

- Python 3.8+
- Pip

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd scheduler-service/backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Database Setup

The application uses a SQLite database (`scheduler.db`) which will be created automatically. To manage schema changes, use Alembic.

1.  **Generate a new migration (if you change `models.py`):**
    ```bash
    alembic revision --autogenerate -m "Your migration message"
    ```

2.  **Apply migrations:**
    ```bash
    alembic upgrade head
    ```

### Running the Application

To start the FastAPI server, run the following command:

```bash
uvicorn app.main:app --reload
```

The application will be available at `http://127.0.0.1:8000`.

## How It Works

The scheduling is handled by the `APScheduler` library.

1.  **Initialization:** When the FastAPI application starts (`@app.on_event("startup")`), a background thread is created to run the scheduler.
2.  **Loading Jobs:** The scheduler calls `load_jobs_from_db()`, which queries the `schedules` table and adds each job to the scheduler instance.
3.  **Adding New Jobs:** When a new job is created via the `POST /schedules/` endpoint, the `add_job_to_scheduler()` function is called to add it to the running scheduler.
4.  **Job Execution:** The `run_job()` function is the target for all scheduled tasks. It receives a `job_id`, queries the database for the job details, and executes its logic (currently, it just prints to the console).
