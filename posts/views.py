from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post, Category, Tag
from .serializers import PostSerializer, CategorySerializer, TagSerializer
from .permissions import IsAdminUserOrReadOnly

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["author", "categories", "tags", "status"]
    search_fields = ["title", "body", "categories__name", "tags__name", "status"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        # Save first to create the Post instance
        post = serializer.save(author=self.request.user)
        
        # If no categories provided, add 'General'
        if not post.categories.exists():
            category, _ = Category.objects.get_or_create(name="General")
            post.categories.add(category)


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUserOrReadOnly]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TagViewSet(viewsets.ModelViewSet):
    # Default is IsAuthenticatedOrReadOnly from settings, which allows auth users to create/edit
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
