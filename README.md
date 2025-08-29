# 🤖 TaskMaster – An Intelligent Task Manager

A comprehensive mobile task management application built with a **React Native frontend** and a **Django backend**. TaskMaster helps you manage your daily tasks, featuring smart task prioritization, local notifications, and seamless cloud synchronization.

-----

## ✨ Features

### Core Functionality

  * **Task Management**: Create, edit, and delete tasks with a title, due date, priority, and category.
  * **Task Organization**: Effortlessly sort and filter tasks by due date, priority, or category.
  * **Local Notifications**: Receive timely reminders for upcoming or overdue tasks.

### Advanced Capabilities

  * **Cloud Sync**: Optional cloud synchronization for data backup and multi-device access.
  * **Smart Suggestions**: Get highlighted, urgent task notifications for tasks with approaching deadlines.
  * **Offline Support**: Full functionality is available even without an internet connection.
  * **Data Persistence**: Your data is securely saved locally with an optional cloud backup.

-----

## 💻 Tech Stack

### Frontend

  - **React Native** - Cross-platform mobile development framework
  - **Redux Toolkit** - Modern state management solution
  - **React Navigation** - Handles navigation between app screens
  - **AsyncStorage** - Provides local data persistence
  - **React Native Local Notifications** - Manages push notifications

### Backend

  - **Django** - High-level Python web framework
  - **Django REST Framework** - Powerful toolkit for building web APIs
  - **PostgreSQL** - Primary database solution
  - **JWT Authentication** - Secure, token-based user authentication
  - **Celery** - Enables asynchronous task processing

-----

## 📂 Project Structure

```
taskmaster/
├── frontend/             # 📱 React Native app
├── backend/              # 🖥️ Django API server
├── docs/                 # 📄 Documentation
└── README.md             # This file
```

-----

## 🚀 Quick Start

### Prerequisites

  * Node.js (v16+)
  * Python (v3.8+)
  * React Native CLI
  * Android Studio / Xcode

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Set up the virtual environment and install dependencies:
    ```bash
    python -m venv venv
    source venv/bin/activate    # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```
3.  Run database migrations and start the server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies and run the app:
    ```bash
    npm install
    npx react-native run-android # or run-ios
    ```

-----

## 🔗 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register/` | `POST` | User registration |
| `/api/auth/login/` | `POST` | User authentication |
| `/api/tasks/` | `GET` | List user tasks |
| `/api/tasks/` | `POST` | Create a new task |
| `/api/tasks/{id}/` | `PUT` | Update a specific task |
| `/api/tasks/{id}/` | `DELETE` | Delete a specific task |
| `/api/tasks/{id}/complete/` | `POST` | Mark a task as complete |

-----

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Create a Pull Request.

-----

## 📝 Creator's Note

This application was developed under a tight deadline, so several planned features—like AI-powered suggestions and a full calendar view—are not yet implemented. However, the core functionality works, and the app has a clean, seamless UI. I'm excited to continue learning more about app development with your club. Thank you for your interest\!

Vighnesh Singh Dhanai 
RA2411026010352



