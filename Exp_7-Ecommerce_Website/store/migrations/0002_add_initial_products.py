# migrations/0002_add_initial_products.py
# Seeds the database with 8 sample products
# Project: ShopEasy | Author: Vansh Sharma

from django.db import migrations


def add_products(apps, schema_editor):
    """Add 8 sample products to the database."""
    Product = apps.get_model('store', 'Product')

    products = [
        {
            'name': 'AirMax Pro Headphones',
            'price': 2999.00,
            'description': 'Premium noise-cancelling wireless headphones with 30hr battery life and studio-quality sound.',
            'category': 'electronics',
            'emoji': '🎧',
        },
        {
            'name': 'ZenFit Smart Watch',
            'price': 3499.00,
            'description': 'Track your fitness, heart rate, sleep, and notifications from your wrist. Water resistant.',
            'category': 'electronics',
            'emoji': '⌚',
        },
        {
            'name': 'CloudStep Sneakers',
            'price': 1799.00,
            'description': 'Ultra-lightweight running shoes with memory foam insoles for all-day comfort.',
            'category': 'footwear',
            'emoji': '👟',
        },
        {
            'name': 'PixelShot Camera',
            'price': 12999.00,
            'description': '32MP mirrorless camera with 4K video, optical stabilisation, and AI scene detection.',
            'category': 'electronics',
            'emoji': '📷',
        },
        {
            'name': 'BreezeDesk LED Lamp',
            'price': 799.00,
            'description': 'LED desk lamp with 5 brightness levels, USB charging port, and eye-care mode.',
            'category': 'home',
            'emoji': '💡',
        },
        {
            'name': 'VelvetTouch Backpack',
            'price': 1499.00,
            'description': '15L waterproof backpack with laptop compartment, hidden pockets, and ergonomic straps.',
            'category': 'bags',
            'emoji': '🎒',
        },
        {
            'name': 'Cozy Hoodie (Unisex)',
            'price': 999.00,
            'description': 'Super soft fleece hoodie available in 8 colours. Perfect for winter and lounging.',
            'category': 'clothing',
            'emoji': '🧥',
        },
        {
            'name': 'Leather Wallet',
            'price': 599.00,
            'description': 'Slim genuine leather wallet with RFID protection. Fits 8 cards and cash.',
            'category': 'accessories',
            'emoji': '👜',
        },
    ]

    for p in products:
        Product.objects.create(**p)


def remove_products(apps, schema_editor):
    """Reverse: remove all products."""
    Product = apps.get_model('store', 'Product')
    Product.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_products, remove_products),
    ]
