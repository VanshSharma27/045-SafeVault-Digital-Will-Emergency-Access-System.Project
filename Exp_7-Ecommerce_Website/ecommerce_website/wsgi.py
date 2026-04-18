"""
wsgi.py - WSGI config for ShopEasy project.
Author: Vansh Sharma
Date: April 2026
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_website.settings')
application = get_wsgi_application()
