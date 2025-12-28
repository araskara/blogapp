from rest_framework.routers import SimpleRouter
from .views import UserViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="users")

from django.urls import path
from .views import ChangePasswordView

urlpatterns = [
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
] + router.urls
