import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blogapi.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = "araz"
password = "123456"
email = "araz@example.com"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created.")
else:
    u = User.objects.get(username=username)
    u.set_password(password)
    u.save()
    print(f"Superuser '{username}' password updated.")
