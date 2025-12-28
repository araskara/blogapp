from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Post, Category, Tag

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")

class TinyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("id", "username", "name", "avatar", "bio")

class PostSerializer(serializers.ModelSerializer):
    # Use nested serializer for reading author details
    author = TinyUserSerializer(read_only=True)
    # Read-only nested serializers for display
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    # Writable fields for creating/updating
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), write_only=True, source='categories', required=False
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), write_only=True, source='tags', required=False
    )
    
    # Explicitly make slug optional to resolve required error
    slug = serializers.SlugField(required=False, allow_blank=True, validators=[])
    
    # Use ReadOnlyField which is strictly non-writable
    created_at = serializers.ReadOnlyField()
    updated_at = serializers.ReadOnlyField()

    def update(self, instance, validated_data):
        # If slug is provided as empty string, set it to None (or empty string) so model regenerates it
        if 'slug' in validated_data and validated_data['slug'] == "":
            instance.slug = ""
        
        return super().update(instance, validated_data)

    def validate_slug(self, value):
        """
        Enforce unique-for-date without requiring created_at in client payload.
        """
        slug = value or ""
        if not slug:
            return slug

        if self.instance and self.instance.created_at:
            created_date = self.instance.created_at.date()
            qs = Post.objects.filter(
                slug=slug, created_at__date=created_date
            ).exclude(pk=self.instance.pk)
        else:
            created_date = timezone.now().date()
            qs = Post.objects.filter(slug=slug, created_at__date=created_date)

        if qs.exists():
            raise serializers.ValidationError("Slug must be unique for the post date.")

        return slug

    class Meta:
        model = Post
        fields = (
            "id",
            "title",
            "body",
            "author",
            "categories",
            "category_ids",
            "tags",
            "tag_ids",
            "image",
            "status",
            "slug",
            "read_time",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("author", "read_time")
        extra_kwargs = {
            "slug": {"required": False, "validators": []},
        }
        # Disable DRF's auto-added unique validators (e.g., unique_for_date) since we handle slug uniqueness ourselves
        validators = []
