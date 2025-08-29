from rest_framework import serializers
from django.utils import timezone
from .models import Task, Category, TaskNotification, TaskAnalytics


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'icon', 'description']


class TaskSerializer(serializers.ModelSerializer):
    """Base serializer for Task model."""
    
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    urgency_score = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    remaining_time = serializers.SerializerMethodField()
    subtasks_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'priority', 'status', 'created_at', 'updated_at', 'due_date',
            'completed_at', 'reminder_time', 'estimated_duration',
            'actual_duration', 'is_recurring', 'recurrence_pattern',
            'tags', 'notification_enabled', 'progress', 'parent_task',
            'urgency_score', 'is_overdue', 'remaining_time', 'subtasks_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'urgency_score', 'is_overdue']
    
    def get_remaining_time(self, obj):
        """Get remaining time as human-readable string."""
        remaining = obj.get_remaining_time()
        if remaining:
            total_seconds = int(remaining.total_seconds())
            if total_seconds < 60:
                return f"{total_seconds} seconds"
            elif total_seconds < 3600:
                minutes = total_seconds // 60
                return f"{minutes} minutes"
            elif total_seconds < 86400:
                hours = total_seconds // 3600
                return f"{hours} hours"
            else:
                days = total_seconds // 86400
                return f"{days} days"
        return None
    
    def get_subtasks_count(self, obj):
        """Get count of subtasks."""
        return obj.subtasks.count()
    
    def validate_due_date(self, value):
        """Validate due date is not in the past."""
        if value and value < timezone.now():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value
    
    def validate_estimated_duration(self, value):
        """Validate estimated duration is reasonable."""
        if value and value > 1440:  # 24 hours in minutes
            raise serializers.ValidationError("Estimated duration cannot exceed 24 hours.")
        return value


class TaskCreateSerializer(TaskSerializer):
    """Serializer for creating tasks."""
    
    class Meta(TaskSerializer.Meta):
        fields = [
            'title', 'description', 'category_id', 'priority', 'due_date',
            'reminder_time', 'estimated_duration', 'is_recurring',
            'recurrence_pattern', 'tags', 'notification_enabled'
        ]
    
    def create(self, validated_data):
        """Create task with current user."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TaskUpdateSerializer(TaskSerializer):
    """Serializer for updating tasks."""
    
    class Meta(TaskSerializer.Meta):
        fields = [
            'title', 'description', 'category_id', 'priority', 'status',
            'due_date', 'reminder_time', 'estimated_duration',
            'actual_duration', 'is_recurring', 'recurrence_pattern',
            'tags', 'notification_enabled', 'progress'
        ]


class TaskDetailSerializer(TaskSerializer):
    """Detailed serializer for Task model."""
    
    subtasks = serializers.SerializerMethodField()
    notifications = serializers.SerializerMethodField()
    
    class Meta(TaskSerializer.Meta):
        fields = TaskSerializer.Meta.fields + ['subtasks', 'notifications']
    
    def get_subtasks(self, obj):
        """Get subtasks recursively."""
        subtasks = obj.subtasks.all()
        return TaskSerializer(subtasks, many=True).data
    
    def get_notifications(self, obj):
        """Get recent notifications."""
        notifications = obj.notifications.all()[:5]  # Last 5 notifications
        return TaskNotificationSerializer(notifications, many=True).data


class TaskListSerializer(TaskSerializer):
    """Serializer for task lists with filtering."""
    
    class Meta(TaskSerializer.Meta):
        fields = [
            'id', 'title', 'priority', 'status', 'due_date', 'category',
            'urgency_score', 'is_overdue', 'remaining_time', 'progress',
            'created_at'
        ]


class TaskNotificationSerializer(serializers.ModelSerializer):
    """Serializer for TaskNotification model."""
    
    task_title = serializers.CharField(source='task.title', read_only=True)
    
    class Meta:
        model = TaskNotification
        fields = [
            'id', 'task', 'task_title', 'notification_type', 'message',
            'sent_at', 'is_read', 'action_taken'
        ]


class TaskAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for TaskAnalytics model."""
    
    class Meta:
        model = TaskAnalytics
        fields = [
            'date', 'tasks_created', 'tasks_completed', 'tasks_overdue',
            'total_duration', 'completion_rate', 'average_task_duration',
            'priority_distribution'
        ]


class TaskBulkUpdateSerializer(serializers.Serializer):
    """Serializer for bulk updating tasks."""
    
    task_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=1
    )
    status = serializers.ChoiceField(choices=Task.STATUS_CHOICES, required=False)
    priority = serializers.ChoiceField(choices=Task.PRIORITY_CHOICES, required=False)
    category_id = serializers.UUIDField(required=False, allow_null=True)
    
    def validate_task_ids(self, value):
        """Validate that all task IDs exist and belong to the user."""
        user = self.context['request'].user
        existing_tasks = Task.objects.filter(id__in=value, user=user)
        if len(existing_tasks) != len(value):
            raise serializers.ValidationError("Some tasks do not exist or don't belong to you.")
        return value


class TaskSearchSerializer(serializers.Serializer):
    """Serializer for task search parameters."""
    
    query = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False)
    priority = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    due_date_from = serializers.DateTimeField(required=False)
    due_date_to = serializers.DateTimeField(required=False)
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    sort_by = serializers.ChoiceField(
        choices=['urgency_score', 'due_date', 'priority', 'created_at', 'title'],
        default='urgency_score'
    )
    sort_order = serializers.ChoiceField(
        choices=['asc', 'desc'],
        default='desc'
    )


class TaskSnoozeSerializer(serializers.Serializer):
    """Serializer for snoozing task reminders."""
    
    hours = serializers.IntegerField(
        min_value=1,
        max_value=72,
        default=1
    )


class TaskCompleteSerializer(serializers.Serializer):
    """Serializer for completing tasks."""
    
    actual_duration = serializers.IntegerField(
        min_value=0,
        required=False,
        help_text='Actual duration in minutes'
    )
    notes = serializers.CharField(required=False, allow_blank=True) 