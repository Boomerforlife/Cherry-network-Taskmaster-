# TaskMaster Setup Guide

This guide will help you set up and run the TaskMaster Intelligent Task Manager application with both Django backend and React Native frontend.

## 🏗️ Project Structure

```
taskmaster/
├── backend/                 # Django API server
│   ├── taskmaster/         # Django project settings
│   ├── users/              # User management app
│   ├── tasks/              # Task management app
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── setup.py           # Backend setup script
├── frontend/               # React Native mobile app
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # App screens
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── theme/          # UI theme
│   ├── App.js              # Main app component
│   └── package.json        # Node.js dependencies
└── README.md               # Project overview
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **React Native CLI** (for mobile development)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd taskmaster
```

## 🔧 Backend Setup (Django)

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Setup Script

```bash
python setup.py
```

This script will:
- Run database migrations
- Create a superuser (admin/admin123456)
- Create sample categories
- Create a demo user (demo/demo123456)
- Create sample tasks

### 5. Start Django Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### 6. Access Admin Panel

Visit `http://localhost:8000/admin/` and login with:
- Username: `admin`
- Password: `admin123456`

## 📱 Frontend Setup (React Native)

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Start Metro Bundler

```bash
npx react-native start
```

### 5. Run on Device/Emulator

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
npx react-native run-ios
```

## 🔐 Authentication

### Demo User
- Username: `demo`
- Password: `demo123456`

### Admin User
- Username: `admin`
- Password: `admin123456`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### User Management
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/update/` - Update profile
- `PUT /api/profile/change-password/` - Change password
- `GET /api/stats/` - User statistics

### Tasks
- `GET /api/tasks/` - List tasks
- `POST /api/tasks/` - Create task
- `GET /api/tasks/{id}/` - Get task details
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
- `POST /api/tasks/{id}/complete/` - Mark as complete
- `POST /api/tasks/{id}/snooze/` - Snooze reminder

### Categories
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

### Analytics
- `GET /api/analytics/` - Task analytics
- `GET /api/suggestions/` - Smart suggestions
- `GET /api/calendar/` - Calendar view

## 🎨 Features

### Core Functionality
- ✅ User authentication and profile management
- ✅ Task creation, editing, and deletion
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Task categories (Work, Personal, Study, Health, Finance, Other)
- ✅ Due dates and reminders
- ✅ Progress tracking
- ✅ Status management (Pending, In Progress, Completed, Cancelled, Overdue)

### Smart Features
- ✅ Intelligent task prioritization
- ✅ Urgency scoring based on deadline and priority
- ✅ Smart suggestions for productivity
- ✅ Overdue task detection
- ✅ Progress visualization

### Advanced Features
- ✅ Local notifications (ready for implementation)
- ✅ Task analytics and insights
- ✅ Calendar view
- ✅ Bulk operations
- ✅ Search and filtering
- ✅ Cloud synchronization ready

## 🔧 Configuration

### Backend Configuration

Edit `backend/taskmaster/settings.py` to customize:

- Database settings
- CORS origins
- JWT token expiration
- Static/media file paths

### Frontend Configuration

Edit `frontend/src/services/api.js` to set:

- API base URL
- Request timeouts
- Authentication headers

## 🚨 Troubleshooting

### Common Issues

#### Backend Issues

1. **Database Migration Errors**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Port Already in Use**
   ```bash
   python manage.py runserver 8001
   ```

3. **Dependencies Issues**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

#### Frontend Issues

1. **Metro Bundler Issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android Build Issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **iOS Build Issues**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   npx react-native run-ios
   ```

### Performance Optimization

1. **Backend**
   - Use PostgreSQL for production
   - Enable database indexing
   - Implement caching with Redis

2. **Frontend**
   - Enable Hermes engine
   - Use production builds
   - Implement lazy loading

## 🚀 Deployment

### Backend Deployment

1. **Production Settings**
   - Set `DEBUG = False`
   - Configure production database
   - Set secure `SECRET_KEY`
   - Configure static file serving

2. **Docker Deployment**
   ```bash
   docker build -t taskmaster-backend .
   docker run -p 8000:8000 taskmaster-backend
   ```

### Frontend Deployment

1. **Android APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **iOS Archive**
   - Use Xcode to archive and distribute

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information
4. Include error logs and system information

---

**Happy Task Managing! 🎯✨** 