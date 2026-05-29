from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display   = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'created_at')
    search_fields  = ('username', 'email')
    ordering       = ('-created_at',)
    fieldsets      = BaseUserAdmin.fieldsets
    add_fieldsets  = BaseUserAdmin.add_fieldsets
