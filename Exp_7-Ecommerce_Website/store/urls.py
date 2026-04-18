"""
urls.py - URL Patterns for Store App
Project: ShopEasy E-Commerce Website
Author: Vansh Sharma
Date: April 2026
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),                            # Homepage
    path('cart/', views.cart, name='cart'),                         # Cart page
    path('checkout/', views.checkout, name='checkout'),             # Checkout page
    path('place-order/', views.place_order, name='place_order'),    # Order confirm
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),    # AJAX: add
    path('remove-from-cart/', views.remove_from_cart, name='remove_from_cart'),  # AJAX: remove
    path('update-cart/', views.update_cart, name='update_cart'),    # AJAX: qty update
]
