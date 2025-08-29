from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'tasks'

# Create router for ViewSets
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'tasks', views.TaskViewSet, basename='task')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Additional task endpoints
    path('analytics/', views.task_analytics, name='task-analytics'),
    path('suggestions/', views.smart_suggestions, name='smart-suggestions'),
    path('calendar/', views.calendar_view, name='calendar-view'),
] 