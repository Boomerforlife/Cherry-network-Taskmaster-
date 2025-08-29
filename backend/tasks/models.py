from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()


class Category(models.Model):
    """Task category model."""
    
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#007AFF')  # Hex color
    icon = models.CharField(max_length=50, default='📋')
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Task(models.Model):
    """Task model with intelligent features."""
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('overdue', 'Overdue'),
    ]
    
    # Basic fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    
    # Task details
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Dates and times
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    reminder_time = models.DateTimeField(null=True, blank=True)
    
    # Task properties
    estimated_duration = models.PositiveIntegerField(
        help_text='Estimated duration in minutes',
        null=True, blank=True
    )
    actual_duration = models.PositiveIntegerField(
        help_text='Actual duration in minutes',
        null=True, blank=True
    )
    
    # Smart features
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.JSONField(default=dict, blank=True)  # For recurring tasks
    tags = models.JSONField(default=list, blank=True)
    
    # Notification settings
    notification_enabled = models.BooleanField(default=True)
    notification_sent = models.BooleanField(default=False)
    snooze_count = models.PositiveIntegerField(default=0)
    last_snoozed = models.DateTimeField(null=True, blank=True)
    
    # Progress tracking
    progress = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0,
        help_text='Progress percentage (0-100)'
    )
    
    # Subtasks
    parent_task = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='subtasks'
    )
    
    # Cloud sync
    is_synced = models.BooleanField(default=False)
    last_synced = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-priority', 'due_date', 'created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'due_date']),
            models.Index(fields=['user', 'priority']),
            models.Index(fields=['due_date']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        """Override save to handle status updates and smart features."""
        # Update status based on due date
        if self.due_date and self.status == 'pending':
            if timezone.now() > self.due_date:
                self.status = 'overdue'
        
        # Update completed_at when status changes to completed
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    @property
    def is_overdue(self):
        """Check if task is overdue."""
        if self.due_date and self.status in ['pending', 'in_progress']:
            return timezone.now() > self.due_date
        return False
    
    @property
    def urgency_score(self):
        """Calculate urgency score for smart prioritization."""
        score = 0
        
        # Priority score
        priority_scores = {'low': 1, 'medium': 2, 'high': 3, 'urgent': 4}
        score += priority_scores.get(self.priority, 0) * 10
        
        # Due date urgency
        if self.due_date:
            time_until_due = (self.due_date - timezone.now()).total_seconds()
            if time_until_due < 0:  # Overdue
                score += 50
            elif time_until_due < 3600:  # Less than 1 hour
                score += 40
            elif time_until_due < 86400:  # Less than 1 day
                score += 30
            elif time_until_due < 604800:  # Less than 1 week
                score += 20
        
        # Status score
        if self.status == 'in_progress':
            score += 5
        
        return score
    
    def get_remaining_time(self):
        """Get remaining time until due date."""
        if self.due_date:
            remaining = self.due_date - timezone.now()
            if remaining.total_seconds() > 0:
                return remaining
        return None
    
    def snooze_task(self, hours=1):
        """Snooze task reminder."""
        self.reminder_time = timezone.now() + timezone.timedelta(hours=hours)
        self.snooze_count += 1
        self.last_snoozed = timezone.now()
        self.save()
    
    def mark_completed(self):
        """Mark task as completed."""
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.progress = 100
        self.save()
    
    def get_subtasks_progress(self):
        """Get progress based on subtasks."""
        if self.subtasks.exists():
            completed = self.subtasks.filter(status='completed').count()
            total = self.subtasks.count()
            return int((completed / total) * 100) if total > 0 else 0
        return self.progress


class TaskNotification(models.Model):
    """Model for tracking task notifications."""
    
    NOTIFICATION_TYPES = [
        ('reminder', 'Reminder'),
        ('overdue', 'Overdue'),
        ('due_soon', 'Due Soon'),
        ('completed', 'Completed'),
    ]
    
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    action_taken = models.CharField(max_length=50, blank=True)  # snooze, complete, reschedule
    
    class Meta:
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"{self.task.title} - {self.notification_type}"


class TaskAnalytics(models.Model):
    """Model for tracking task analytics and insights."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_analytics')
    date = models.DateField()
    
    # Daily statistics
    tasks_created = models.PositiveIntegerField(default=0)
    tasks_completed = models.PositiveIntegerField(default=0)
    tasks_overdue = models.PositiveIntegerField(default=0)
    total_duration = models.PositiveIntegerField(default=0)  # in minutes
    
    # Productivity metrics
    completion_rate = models.FloatField(default=0.0)
    average_task_duration = models.FloatField(default=0.0)
    priority_distribution = models.JSONField(default=dict)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date}" 