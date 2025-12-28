import requests
import sys

# Login to get token
base_url = "http://127.0.0.1:8000/api/v1"
auth_url = "http://127.0.0.1:8000/api/token/"

def get_token():
    # Use a known user or creating one might be hard. 
    # Let's assume 'aras' exists from context or 'admin' 
    # Try a standard user. If fails, we can't test.
    # Actually, we can use the user's active session if we could, but we can't.
    # We'll try to login with a widely used default or ask the agent to CREATE a user first?
    # Better: Use the browser tool logic? No, python script is faster.
    # Let's try to assume 'admin' / 'password' or just create a user via Django shell first?
    pass

# Better approach: Use Django shell to test serializer DIRECTLY.
# This bypasses network/server reload issues and tests the CODE.

import os
import django
from django.conf import settings

# Setup Django
sys.path.append("/Users/aras/Documents/PlayingGround/blogapi")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blogapi.settings")
django.setup()

from posts.serializers import PostSerializer
from posts.models import Post, Category
from django.contrib.auth import get_user_model

User = get_user_model()

def test_serializer():
    print("--- Testing PostSerializer ---")
    user = User.objects.first()
    if not user:
        print("No user found.")
        return

    # Create dummy data
    data = {
        "title": "Test Post",
        "body": "Test Body",
        "slug": "test-post-serial",
        "category_ids": [],
        # No created_at here
    }
    
    # Test Create
    print("Testing Validation (Create)...")
    serializer = PostSerializer(data=data)
    if serializer.is_valid():
        print("Create: VALID")
        # Save to test creation
        post = serializer.save(author=user)
        print(f"Created post: {post.slug}")
        
        # Test Update
        print("Testing Validation (Update)...")
        update_data = {
            "title": "Updated Title",
            "body": "Updated Body",
            "slug": "", # Test empty slug logic too
        }
        update_serializer = PostSerializer(post, data=update_data, partial=True)
        if update_serializer.is_valid():
            print("Update: VALID")
            updated_post = update_serializer.save()
            print(f"Updated post slug: {updated_post.slug}")
        else:
            print(f"Update: INVALID: {update_serializer.errors}")
            
    else:
        print(f"Create: INVALID: {serializer.errors}")

if __name__ == "__main__":
    test_serializer()
