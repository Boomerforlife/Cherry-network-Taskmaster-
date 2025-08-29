from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
# from django_filters.rest_framework import DjangoFilterBackend  # Temporarily commented out
from django.utils import timezone
from django.db.models import Q, Count, Avg
from django.shortcuts import get_object_or_404
from datetime import timedelta
import json

from .models import Task, Category, TaskNotification, TaskAnalytics
from .serializers import (
    TaskSerializer, TaskCreateSerializer, TaskUpdateSerializer,
    TaskDetailSerializer, TaskListSerializer, CategorySerializer,
    TaskNotificationSerializer, TaskAnalyticsSerializer,
    TaskBulkUpdateSerializer, TaskSearchSerializer,
    TaskSnoozeSerializer, TaskCompleteSerializer
)


class CategoryViewSet(ModelViewSet):
    """ViewSet for Category model."""
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]  # DjangoFilterBackend temporarily removed
    filterset_fields = ['name']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        """Return categories with task counts."""
        return Category.objects.annotate(
            task_count=Count('task')
        ).order_by('name')


class TaskViewSet(ModelViewSet):
    """ViewSet for Task model with comprehensive functionality."""
    
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]  # DjangoFilterBackend temporarily removed
    filterset_fields = ['status', 'priority', 'category', 'is_recurring']
    search_fields = ['title', 'description', 'tags']
    # Only include real model fields in ordering to avoid 500 errors
    ordering_fields = ['due_date', 'priority', 'created_at', 'title', 'progress', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Return tasks for the current user."""
        return Task.objects.filter(user=self.request.user).select_related('category')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        elif self.action == 'retrieve':
            return TaskDetailSerializer
        return TaskListSerializer
    
    def perform_create(self, serializer):
        """Create task with current user."""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Update task and handle status changes."""
        old_status = self.get_object().status
        task = serializer.save()
        
        # Handle status change to completed
        if task.status == 'completed' and old_status != 'completed':
            task.mark_completed()
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark task as completed."""
        task = self.get_object()
        serializer = TaskCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Update task
        if serializer.validated_data.get('actual_duration'):
            task.actual_duration = serializer.validated_data['actual_duration']
        
        task.mark_completed()
        
        return Response({
            'message': 'Task completed successfully',
            'task': TaskDetailSerializer(task).data
        })
    
    @action(detail=True, methods=['post'])
    def snooze(self, request, pk=None):
        """Snooze task reminder."""
        task = self.get_object()
        serializer = TaskSnoozeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        hours = serializer.validated_data.get('hours', 1)
        task.snooze_task(hours)
        
        return Response({
            'message': f'Task reminder snoozed for {hours} hours',
            'task': TaskDetailSerializer(task).data
        })
    
    @action(detail=True, methods=['post'])
    def start_progress(self, request, pk=None):
        """Start working on a task."""
        task = self.get_object()
        task.status = 'in_progress'
        task.save()
        
        return Response({
            'message': 'Task marked as in progress',
            'task': TaskDetailSerializer(task).data
        })
    
    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update task progress."""
        task = self.get_object()
        progress = request.data.get('progress', 0)
        
        if 0 <= progress <= 100:
            task.progress = progress
            if progress == 100:
                task.status = 'completed'
                task.mark_completed()
            task.save()
            
            return Response({
                'message': 'Progress updated successfully',
                'task': TaskDetailSerializer(task).data
            })
        else:
            return Response(
                {'error': 'Progress must be between 0 and 100'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update multiple tasks."""
        serializer = TaskBulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        task_ids = serializer.validated_data['task_ids']
        tasks = Task.objects.filter(id__in=task_ids, user=request.user)
        
        # Update fields
        update_fields = {}
        if 'status' in serializer.validated_data:
            update_fields['status'] = serializer.validated_data['status']
        if 'priority' in serializer.validated_data:
            update_fields['priority'] = serializer.validated_data['priority']
        if 'category_id' in serializer.validated_data:
            update_fields['category_id'] = serializer.validated_data['category_id']
        
        if update_fields:
            tasks.update(**update_fields)
        
        return Response({
            'message': f'{len(tasks)} tasks updated successfully'
        })
    
    @action(detail=False, methods=['get'])
    def urgent(self, request):
        """Get urgent tasks (high priority or due soon)."""
        urgent_tasks = self.get_queryset().filter(
            Q(priority__in=['high', 'urgent']) |
            Q(due_date__lte=timezone.now() + timedelta(days=1))
        ).order_by('urgency_score')
        
        page = self.paginate_queryset(urgent_tasks)
        if page is not None:
            serializer = TaskListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = TaskListSerializer(urgent_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue tasks."""
        overdue_tasks = self.get_queryset().filter(
            status__in=['pending', 'in_progress'],
            due_date__lt=timezone.now()
        ).order_by('due_date')
        
        page = self.paginate_queryset(overdue_tasks)
        if page is not None:
            serializer = TaskListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = TaskListSerializer(overdue_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get tasks due today."""
        today = timezone.now().date()
        today_tasks = self.get_queryset().filter(
            due_date__date=today
        ).order_by('priority', 'due_date')
        
        page = self.paginate_queryset(today_tasks)
        if page is not None:
            serializer = TaskListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = TaskListSerializer(today_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def week(self, request):
        """Get tasks due this week."""
        today = timezone.now().date()
        week_end = today + timedelta(days=7)
        week_tasks = self.get_queryset().filter(
            due_date__date__range=[today, week_end]
        ).order_by('due_date', 'priority')
        
        page = self.paginate_queryset(week_tasks)
        if page is not None:
            serializer = TaskListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = TaskListSerializer(week_tasks, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def task_analytics(request):
    """Get task analytics for the current user."""
    user = request.user
    
    # Get date range from query params
    days = int(request.query_params.get('days', 30))
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Get analytics data
    analytics = TaskAnalytics.objects.filter(
        user=user,
        date__range=[start_date, end_date]
    ).order_by('date')
    
    # Calculate summary statistics
    total_tasks = Task.objects.filter(
        user=user,
        created_at__date__range=[start_date, end_date]
    ).count()
    
    completed_tasks = Task.objects.filter(
        user=user,
        status='completed',
        completed_at__date__range=[start_date, end_date]
    ).count()
    
    overdue_tasks = Task.objects.filter(
        user=user,
        status__in=['pending', 'in_progress'],
        due_date__lt=timezone.now()
    ).count()
    
    # Priority distribution
    priority_distribution = Task.objects.filter(
        user=user,
        created_at__date__range=[start_date, end_date]
    ).values('priority').annotate(count=Count('priority'))
    
    # Category distribution
    category_distribution = Task.objects.filter(
        user=user,
        created_at__date__range=[start_date, end_date]
    ).values('category__name').annotate(count=Count('category'))
    
    return Response({
        'summary': {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'overdue_tasks': overdue_tasks,
            'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        },
        'priority_distribution': priority_distribution,
        'category_distribution': category_distribution,
        'daily_analytics': TaskAnalyticsSerializer(analytics, many=True).data
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def smart_suggestions(request):
    """Get smart task suggestions based on user behavior and deadlines."""
    user = request.user
    
    # Get tasks that need attention
    suggestions = []
    
    # Overdue tasks (highest priority)
    overdue_tasks = Task.objects.filter(
        user=user,
        status__in=['pending', 'in_progress'],
        due_date__lt=timezone.now()
    ).order_by('priority', 'due_date')[:5]
    
    for task in overdue_tasks:
        suggestions.append({
            'type': 'overdue',
            'priority': 'high',
            'message': f'Task "{task.title}" is overdue',
            'task': TaskListSerializer(task).data,
            'action': 'complete_now'
        })
    
    # Tasks due soon (within 24 hours)
    soon_tasks = Task.objects.filter(
        user=user,
        status='pending',
        due_date__range=[
            timezone.now(),
            timezone.now() + timedelta(days=1)
        ]
    ).order_by('priority', 'due_date')[:5]
    
    for task in soon_tasks:
        suggestions.append({
            'type': 'due_soon',
            'priority': 'medium',
            'message': f'Task "{task.title}" is due soon',
            'task': TaskListSerializer(task).data,
            'action': 'start_working'
        })
    
    # High priority pending tasks
    high_priority_tasks = Task.objects.filter(
        user=user,
        status='pending',
        priority__in=['high', 'urgent']
    ).order_by('urgency_score')[:3]
    
    for task in high_priority_tasks:
        suggestions.append({
            'type': 'high_priority',
            'priority': 'medium',
            'message': f'High priority task "{task.title}" needs attention',
            'task': TaskListSerializer(task).data,
            'action': 'prioritize'
        })
    
    # Productivity suggestions
    if suggestions:
        suggestions.append({
            'type': 'productivity_tip',
            'priority': 'low',
            'message': 'Focus on completing overdue tasks first, then work on high-priority items',
            'action': 'general_advice'
        })
    
    return Response({
        'suggestions': suggestions,
        'total_count': len(suggestions)
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def calendar_view(request):
    """Get calendar view data for tasks."""
    user = request.user
    
    # Get month and year from query params
    month = int(request.query_params.get('month', timezone.now().month))
    year = int(request.query_params.get('year', timezone.now().year))
    
    # Get tasks for the specified month
    start_date = timezone.datetime(year, month, 1, tzinfo=timezone.utc)
    if month == 12:
        end_date = timezone.datetime(year + 1, 1, 1, tzinfo=timezone.utc)
    else:
        end_date = timezone.datetime(year, month + 1, 1, tzinfo=timezone.utc)
    
    tasks = Task.objects.filter(
        user=user,
        due_date__range=[start_date, end_date]
    ).select_related('category')
    
    # Group tasks by date
    calendar_data = {}
    for task in tasks:
        date_key = task.due_date.date().isoformat()
        if date_key not in calendar_data:
            calendar_data[date_key] = []
        
        calendar_data[date_key].append({
            'id': str(task.id),
            'title': task.title,
            'priority': task.priority,
            'status': task.status,
            'category': CategorySerializer(task.category).data if task.category else None
        })
    
    return Response({
        'month': month,
        'year': year,
        'calendar_data': calendar_data
    }) 