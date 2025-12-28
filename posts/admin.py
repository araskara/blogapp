from django.contrib import admin
from .models import Post, Category, Tag

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "status", "created_at")
    filter_horizontal = ("categories", "tags")
    list_filter = ("status", "created_at", "categories")
    search_fields = ("title", "body")

admin.site.register(Post, PostAdmin)
admin.site.register(Category)
admin.site.register(Tag)