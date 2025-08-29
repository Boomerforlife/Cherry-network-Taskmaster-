from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom user model for TaskMaster."""
    
    # Additional fields
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    timezone = models.CharField(max_length=50, default='UTC')
    notification_preferences = models.JSONField(default=dict, blank=True)
    
    # Profile fields
    avatar = models.CharField(max_length=255, blank=True, null=True)  # Temporarily changed to CharField
    bio = models.TextField(max_length=500, blank=True)
    
    # Task preferences
    default_priority = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
            ('urgent', 'Urgent'),
        ],
        default='medium'
    )
    
    default_category = models.CharField(
        max_length=50,
        choices=[
            ('work', 'Work'),
            ('personal', 'Personal'),
            ('study', 'Study'),
            ('health', 'Health'),
            ('finance', 'Finance'),
            ('other', 'Other'),
        ],
        default='personal'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.username
    
    def get_full_name_or_username(self):
        """Return full name if available, otherwise username."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username 