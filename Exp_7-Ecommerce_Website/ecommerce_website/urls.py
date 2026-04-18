"""
urls.py - Main URL Configuration
Project: ShopEasy E-Commerce Website
Author: Vansh Sharma
Date: April 2026

All app URLs are included from store/urls.py
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),           # Django admin panel
    path('', include('store.urls')),           # All store URLs
]
