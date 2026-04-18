"""
views.py - All Page Views
Project: ShopEasy E-Commerce Website
Author: Vansh Sharma
Date: April 2026

Handles:
  - Homepage (product listing)
  - Cart page (view, update, remove)
  - Add/remove/update cart (AJAX endpoints)
  - Checkout page
  - Place order (form submit → confirmation)
"""

import json
import random
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Product


# ─────────────────────────────────────────────
# HELPER: Get cart from session
# Cart format: { "product_id": { name, price, quantity, emoji } }
# ─────────────────────────────────────────────
def get_cart(request):
    """Returns the cart stored in the user's session."""
    return request.session.get('cart', {})


def save_cart(request, cart):
    """Save the cart back into the session."""
    request.session['cart'] = cart
    request.session.modified = True


def get_cart_count(request):
    """Returns total number of items (sum of all quantities) in cart."""
    cart = get_cart(request)
    return sum(item['quantity'] for item in cart.values())


def get_cart_total(request):
    """Returns the total price of all cart items."""
    cart = get_cart(request)
    return round(sum(float(item['price']) * item['quantity'] for item in cart.values()), 2)


# ─────────────────────────────────────────────
# VIEW 1: Homepage — Product Listing
# ─────────────────────────────────────────────
def index(request):
    """
    Homepage: shows all available products in a grid.
    """
    products = Product.objects.filter(is_available=True)
    cart_count = get_cart_count(request)

    context = {
        'products': products,
        'cart_count': cart_count,
    }
    return render(request, 'store/index.html', context)


# ─────────────────────────────────────────────
# VIEW 2: Cart Page
# ─────────────────────────────────────────────
def cart(request):
    """
    Cart page: shows all items the user has added.
    """
    cart_data = get_cart(request)
    cart_items = []

    for product_id, item in cart_data.items():
        item_total = float(item['price']) * item['quantity']
        cart_items.append({
            'id': product_id,
            'name': item['name'],
            'price': item['price'],
            'quantity': item['quantity'],
            'emoji': item.get('emoji', '📦'),
            'total': round(item_total, 2),
        })

    cart_total = round(sum(item['total'] for item in cart_items), 2)
    cart_count = get_cart_count(request)

    context = {
        'cart_items': cart_items,
        'cart_total': cart_total,
        'cart_count': cart_count,
    }
    return render(request, 'store/cart.html', context)


# ─────────────────────────────────────────────
# VIEW 3: Add to Cart (AJAX POST)
# ─────────────────────────────────────────────
@require_POST
def add_to_cart(request):
    """
    Adds a product to the cart.
    Called via AJAX from the product listing page (no page reload).
    """
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))
        product = Product.objects.get(id=product_id)

        cart = get_cart(request)

        if product_id in cart:
            # Product already in cart → increase quantity
            cart[product_id]['quantity'] += 1
        else:
            # New product → add to cart
            cart[product_id] = {
                'name': product.name,
                'price': str(product.price),
                'quantity': 1,
                'emoji': product.emoji,
            }

        save_cart(request, cart)

        return JsonResponse({
            'success': True,
            'message': f'{product.name} added to cart!',
            'cart_count': get_cart_count(request),
            'cart_total': get_cart_total(request),
        })

    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found!'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


# ─────────────────────────────────────────────
# VIEW 4: Remove from Cart (AJAX POST)
# ─────────────────────────────────────────────
@require_POST
def remove_from_cart(request):
    """
    Removes a product completely from the cart.
    Called via AJAX from the cart page.
    """
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))

        cart = get_cart(request)

        if product_id in cart:
            removed_name = cart[product_id]['name']
            del cart[product_id]
            save_cart(request, cart)

            return JsonResponse({
                'success': True,
                'message': f'{removed_name} removed from cart!',
                'cart_count': get_cart_count(request),
                'cart_total': get_cart_total(request),
            })
        else:
            return JsonResponse({'success': False, 'message': 'Item not in cart!'}, status=400)

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


# ─────────────────────────────────────────────
# VIEW 5: Update Cart Quantity (AJAX POST)
# ─────────────────────────────────────────────
@require_POST
def update_cart(request):
    """
    Increases or decreases the quantity of a cart item.
    If quantity drops to 0, the item is removed automatically.
    """
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))
        action = data.get('action')  # 'increase' or 'decrease'

        cart = get_cart(request)

        if product_id in cart:
            if action == 'increase':
                cart[product_id]['quantity'] += 1
            elif action == 'decrease':
                cart[product_id]['quantity'] -= 1
                if cart[product_id]['quantity'] <= 0:
                    # Remove item if quantity hits 0
                    del cart[product_id]
                    save_cart(request, cart)
                    return JsonResponse({
                        'success': True,
                        'removed': True,
                        'cart_count': get_cart_count(request),
                        'cart_total': get_cart_total(request),
                    })

            save_cart(request, cart)

            item = cart.get(product_id, {})
            item_total = float(item.get('price', 0)) * item.get('quantity', 0)

            return JsonResponse({
                'success': True,
                'removed': False,
                'quantity': item.get('quantity', 0),
                'item_total': round(item_total, 2),
                'cart_count': get_cart_count(request),
                'cart_total': get_cart_total(request),
            })

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


# ─────────────────────────────────────────────
# VIEW 6: Checkout Page
# ─────────────────────────────────────────────
def checkout(request):
    """
    Checkout page: collects user name, email, address.
    Redirects to homepage if cart is empty.
    """
    cart_data = get_cart(request)

    if not cart_data:
        return redirect('index')

    cart_items = []
    for product_id, item in cart_data.items():
        item_total = float(item['price']) * item['quantity']
        cart_items.append({
            'id': product_id,
            'name': item['name'],
            'price': item['price'],
            'quantity': item['quantity'],
            'emoji': item.get('emoji', '📦'),
            'total': round(item_total, 2),
        })

    cart_total = round(sum(item['total'] for item in cart_items), 2)
    cart_count = get_cart_count(request)

    context = {
        'cart_items': cart_items,
        'cart_total': cart_total,
        'cart_count': cart_count,
    }
    return render(request, 'store/checkout.html', context)


# ─────────────────────────────────────────────
# VIEW 7: Place Order (Form Submission → Confirmation)
# ─────────────────────────────────────────────
def place_order(request):
    """
    Handles checkout form submission.
    Generates an order number, clears the cart, and shows confirmation.
    """
    if request.method == 'POST':
        # Read form fields
        name = request.POST.get('name', 'Customer').strip()
        email = request.POST.get('email', '').strip()
        address = request.POST.get('address', '').strip()
        city = request.POST.get('city', '').strip()

        # Snapshot cart before clearing
        cart_data = get_cart(request)
        order_items = []
        for product_id, item in cart_data.items():
            item_total = float(item['price']) * item['quantity']
            order_items.append({
                'name': item['name'],
                'quantity': item['quantity'],
                'price': item['price'],
                'emoji': item.get('emoji', '📦'),
                'total': round(item_total, 2),
            })

        order_total = round(sum(item['total'] for item in order_items), 2)

        # Generate a random order ID like ORD83742
        order_number = f"ORD{random.randint(10000, 99999)}"

        # Clear the cart after placing order
        request.session['cart'] = {}
        request.session.modified = True

        context = {
            'name': name,
            'email': email,
            'address': address,
            'city': city,
            'order_items': order_items,
            'order_total': order_total,
            'order_number': order_number,
            'cart_count': 0,
        }
        return render(request, 'store/confirmation.html', context)

    # If GET request (not POST), redirect to checkout
    return redirect('checkout')
