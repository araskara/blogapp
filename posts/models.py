from django.db import models
from django.conf import settings
from django.utils.text import slugify
import math

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Post(models.Model):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    )

    title = models.CharField(max_length=250)
    # Add slug field, unique=True is best for URLs.
    # We use null=True temporarily to allow migration of existing rows without unique conflicts immediately,
    # though strict unique is better for new apps.
    slug = models.SlugField(max_length=250, unique_for_date='created_at', blank=True)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    image = models.ImageField(upload_to="posts/", null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default="published"
    )
    read_time = models.IntegerField(default=0) # In minutes
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title, allow_unicode=True)
            slug = base_slug
            counter = 1
            # Check for collision, excluding self (if update)
            # Efficient check: filter by slug, exclude ID if exists
            while Post.objects.filter(slug=slug).exclude(id=self.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Calculate read time (approx 200 words per min)
        if self.body:
            word_count = len(self.body.split())
            read_time_mins = math.ceil(word_count / 200)
            self.read_time = read_time_mins
        else:
            self.read_time = 0

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title