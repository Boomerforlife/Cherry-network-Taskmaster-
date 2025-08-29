#!/usr/bin/env python
"""
Setup script for TaskMaster Django backend.
This script initializes the database and creates sample data.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model
from tasks.models import Category, Task
from django.utils import timezone
from datetime import timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskmaster.settings')
django.setup()

User = get_user_model()

def create_sample_categories():
    """Create sample task categories."""
    categories_data = [
        {
            'name': 'Work',
            'color': '#3F51B5',
            'icon': '💼',
            'description': 'Professional and work-related tasks'
        },
        {
            'name': 'Personal',
            'color': '#E91E63',
            'icon': '❤️',
            'description': 'Personal and family-related tasks'
        },
        {
            'name': 'Study',
            'color': '#009688',
            'icon': '📚',
            'description': 'Learning and educational tasks'
        },
        {
            'name': 'Health',
            'color': '#4CAF50',
            'icon': '🏃‍♂️',
            'description': 'Health and fitness related tasks'
        },
        {
            'name': 'Finance',
            'color': '#FF9800',
            'icon': '💰',
            'description': 'Financial planning and budgeting tasks'
        },
        {
            'name': 'Other',
            'color': '#9E9E9E',
            'icon': '📋',
            'description': 'Miscellaneous tasks'
        }
    ]
    
    created_categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"Created category: {category.name}")
        created_categories.append(category)
    
    return created_categories

def create_sample_user():
    """Create a sample user for testing."""
    try:
        user = User.objects.create_user(
            username='demo',
            email='demo@taskmaster.com',
            password='demo123456',
            first_name='Demo',
            last_name='User',
            phone_number='+1234567890',
            timezone='UTC',
            default_priority='medium',
            default_category='personal'
        )
        print(f"Created demo user: {user.username}")
        return user
    except Exception as e:
        print(f"Demo user already exists or error: {e}")
        return User.objects.get(username='demo')

def create_sample_tasks(user, categories):
    """Create sample tasks for the demo user."""
    work_category = next(cat for cat in categories if cat.name == 'Work')
    personal_category = next(cat for cat in categories if cat.name == 'Personal')
    study_category = next(cat for cat in categories if cat.name == 'Study')
    health_category = next(cat for cat in categories if cat.name == 'Health')
    
    tasks_data = [
        {
            'title': 'Complete Project Proposal',
            'description': 'Finish the quarterly project proposal document for the client meeting',
            'category': work_category,
            'priority': 'urgent',
            'due_date': timezone.now() + timedelta(hours=2),
            'estimated_duration': 120,
            'tags': ['proposal', 'client', 'quarterly']
        },
        {
            'title': 'Review Code Changes',
            'description': 'Review pull request #45 for the new authentication feature',
            'category': work_category,
            'priority': 'high',
            'due_date': timezone.now() + timedelta(hours=6),
            'estimated_duration': 60,
            'tags': ['code-review', 'authentication', 'pull-request']
        },
        {
            'title': 'Team Meeting',
            'description': 'Weekly team standup meeting to discuss progress and blockers',
            'category': work_category,
            'priority': 'medium',
            'due_date': timezone.now().replace(hour=10, minute=0, second=0, microsecond=0),
            'estimated_duration': 30,
            'tags': ['meeting', 'standup', 'team']
        },
        {
            'title': 'Gym Session',
            'description': 'Cardio and strength training workout',
            'category': health_category,
            'priority': 'low',
            'due_date': timezone.now().replace(hour=18, minute=0, second=0, microsecond=0),
            'estimated_duration': 90,
            'tags': ['workout', 'cardio', 'strength']
        },
        {
            'title': 'Read React Native Documentation',
            'description': 'Study the latest React Native features and best practices',
            'category': study_category,
            'priority': 'medium',
            'due_date': timezone.now() + timedelta(days=2),
            'estimated_duration': 180,
            'tags': ['react-native', 'documentation', 'learning']
        },
        {
            'title': 'Plan Weekend Trip',
            'description': 'Research and plan activities for the upcoming weekend getaway',
            'category': personal_category,
            'priority': 'low',
            'due_date': timezone.now() + timedelta(days=3),
            'estimated_duration': 60,
            'tags': ['planning', 'weekend', 'travel']
        },
        {
            'title': 'Budget Review',
            'description': 'Review monthly expenses and update budget spreadsheet',
            'category': 'finance',
            'priority': 'medium',
            'due_date': timezone.now() + timedelta(days=1),
            'estimated_duration': 45,
            'tags': ['budget', 'expenses', 'monthly']
        }
    ]
    
    created_tasks = []
    for task_data in tasks_data:
        # Handle category assignment
        if isinstance(task_data['category'], str):
            category = next(cat for cat in categories if cat.name.lower() == task_data['category'].lower())
        else:
            category = task_data['category']
        
        task = Task.objects.create(
            user=user,
            title=task_data['title'],
            description=task_data['description'],
            category=category,
            priority=task_data['priority'],
            due_date=task_data['due_date'],
            estimated_duration=task_data['estimated_duration'],
            tags=task_data['tags']
        )
        created_tasks.append(task)
        print(f"Created task: {task.title}")
    
    return created_tasks

def main():
    """Main setup function."""
    print("🚀 Setting up TaskMaster Django Backend...")
    
    # Run migrations
    print("\n📦 Running database migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create superuser
    print("\n👑 Creating superuser...")
    try:
        User.objects.create_superuser(
            username='admin',
            email='admin@taskmaster.com',
            password='admin123456'
        )
        print("Superuser created: admin/admin123456")
    except Exception as e:
        print(f"Superuser already exists or error: {e}")
    
    # Create sample categories
    print("\n🏷️ Creating sample categories...")
    categories = create_sample_categories()
    
    # Create sample user
    print("\n👤 Creating sample user...")
    user = create_sample_user()
    
    # Create sample tasks
    print("\n📝 Creating sample tasks...")
    tasks = create_sample_tasks(user, categories)
    
    print("\n✅ Setup completed successfully!")
    print("\n📱 You can now:")
    print("   - Run the Django server: python manage.py runserver")
    print("   - Access admin panel: http://localhost:8000/admin")
    print("   - Use demo credentials: demo/demo123456")
    print("   - Use admin credentials: admin/admin123456")
    print("\n🔗 API endpoints available at:")
    print("   - Authentication: http://localhost:8000/api/auth/")
    print("   - Tasks: http://localhost:8000/api/tasks/")
    print("   - Categories: http://localhost:8000/api/categories/")
    print("   - Analytics: http://localhost:8000/api/analytics/")

if __name__ == '__main__':
    main() 