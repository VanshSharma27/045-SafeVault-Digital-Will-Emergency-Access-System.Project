"""
admin.py - Django Admin Configuration
Project: ShopEasy E-Commerce Website
Author: Vansh Sharma
Date: April 2026

Register Product model with Django admin so products can be
managed at http://127.0.0.1:8000/admin/
"""

from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Custom admin view for products.
    Shows name, price, category, availability in list view.
    Allows filtering and searching.
    """
    list_display = ['name', 'price', 'category', 'is_available', 'created_at']
    list_filter = ['category', 'is_available']
    search_fields = ['name', 'description']
    list_editable = ['price', 'is_available']
    ordering = ['category', 'name']
