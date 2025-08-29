from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Admin configuration for custom User model."""
    
    list_display = [
        'username', 'email', 'first_name', 'last_name', 
        'default_priority', 'default_category', 'is_active', 'date_joined'
    ]
    list_filter = [
        'is_active', 'is_staff', 'is_superuser', 'default_priority', 
        'default_category', 'date_joined'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = UserAdmin.fieldsets + (
        ('TaskMaster Settings', {
            'fields': (
                'phone_number', 'timezone', 'notification_preferences',
                'default_priority', 'default_category', 'avatar', 'bio'
            )
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('TaskMaster Settings', {
            'fields': (
                'phone_number', 'timezone', 'default_priority', 'default_category'
            )
        }),
    ) 