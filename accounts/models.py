from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    name = models.CharField(null=True, blank=True, max_length=100)
    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    twitter_handle = models.CharField(max_length=15, null=True, blank=True)
    github_handle = models.CharField(max_length=39, null=True, blank=True)
