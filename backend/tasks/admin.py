from django.contrib import admin
from .models import Task, Category, TaskNotification, TaskAnalytics


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""
    
    list_display = ['name', 'color', 'icon', 'description']
    list_filter = ['name']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin configuration for Task model."""
    
    list_display = [
        'title', 'user', 'category', 'priority', 'status', 
        'due_date', 'progress', 'is_overdue'
    ]
    list_filter = [
        'status', 'priority', 'category', 'is_recurring', 
        'notification_enabled', 'created_at'
    ]
    search_fields = ['title', 'description', 'user__username']
    ordering = ['-created_at']  # urgency_score is a property, can't be used in ordering
    readonly_fields = ['id', 'created_at', 'updated_at', 'urgency_score', 'is_overdue']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'user', 'category')
        }),
        ('Task Details', {
            'fields': ('priority', 'status', 'progress', 'tags')
        }),
        ('Dates & Times', {
            'fields': ('due_date', 'reminder_time', 'estimated_duration', 'actual_duration')
        }),
        ('Advanced Features', {
            'fields': ('is_recurring', 'recurrence_pattern', 'parent_task')
        }),
        ('Notifications', {
            'fields': ('notification_enabled', 'notification_sent', 'snooze_count')
        }),
        ('System Fields', {
            'fields': ('id', 'created_at', 'updated_at', 'completed_at', 'last_snoozed'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        return super().get_queryset(request).select_related('user', 'category')


@admin.register(TaskNotification)
class TaskNotificationAdmin(admin.ModelAdmin):
    """Admin configuration for TaskNotification model."""
    
    list_display = [
        'task', 'notification_type', 'sent_at', 'is_read', 'action_taken'
    ]
    list_filter = ['notification_type', 'is_read', 'sent_at']
    search_fields = ['task__title', 'message']
    ordering = ['-sent_at']
    readonly_fields = ['sent_at']


@admin.register(TaskAnalytics)
class TaskAnalyticsAdmin(admin.ModelAdmin):
    """Admin configuration for TaskAnalytics model."""
    
    list_display = [
        'user', 'date', 'tasks_created', 'tasks_completed', 
        'completion_rate', 'total_duration'
    ]
    list_filter = ['date', 'user']
    search_fields = ['user__username']
    ordering = ['-date']
    readonly_fields = ['date'] 