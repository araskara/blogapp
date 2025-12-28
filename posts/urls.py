from rest_framework.routers import SimpleRouter
from .views import PostViewSet, CategoryViewSet, TagViewSet

router = SimpleRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("tags", TagViewSet, basename="tags")
router.register("", PostViewSet, basename="posts")

urlpatterns = router.urls
