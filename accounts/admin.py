from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.forms import CustomUserChangeForm, CustomUserCreationForm
from accounts.models import CustomUser


# Register your models here.


class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    model = CustomUser
    list_display = ['email', 'username', 'name', 'is_staff']
    list_display_links = ['email', 'username']

    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("name", "bio", "avatar", "twitter_handle", "github_handle")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("name", "bio", "avatar", "twitter_handle", "github_handle")}),
    )


admin.site.register(CustomUser, CustomUserAdmin)


