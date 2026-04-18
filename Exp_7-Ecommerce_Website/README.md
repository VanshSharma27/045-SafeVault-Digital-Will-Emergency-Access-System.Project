#  Shopsy — E-Commerce Website
**Experiment-7 | Web Development with Django**
**Author: Vansh Sharma | April 2026**

---

## 📌 Project Overview

ShopEasy is a fully functional e-commerce website built using **Django** (Python web framework).
It covers product listing, cart management with AJAX, and a checkout simulation — all tasks from Experiment-7.

---

## 🗂️ Project Structure

```
ShopEasy/
│
├── manage.py                          ← Run this to start the server
│
├── ecommerce_website/                 ← Django project config
│   ├── settings.py                    ← Database, apps, session config
│   ├── urls.py                        ← Main URL router
│   └── wsgi.py
│
└── store/                             ← Main app
    ├── models.py                      ← Product database model
    ├── views.py                       ← All page + AJAX logic
    ├── urls.py                        ← App URL patterns
    ├── admin.py                       ← Django admin config
    │
    ├── migrations/
    │   ├── 0001_initial.py            ← Creates Product table
    │   └── 0002_add_initial_products.py  ← Seeds 8 sample products
    │
    ├── templates/store/
    │   ├── base.html                  ← Navbar + footer layout
    │   ├── index.html                 ← Homepage / product listing
    │   ├── cart.html                  ← Shopping cart
    │   ├── checkout.html              ← Checkout form
    │   └── confirmation.html          ← Order confirmation
    │
    └── static/store/
        ├── css/style.css              ← All styles
        └── js/script.js               ← AJAX cart logic
```

---

## ✅ Tasks Completed

| Task | Description | Status |
|------|-------------|--------|
| Task 1 | Project Setup & Structure | ✅ Done |
| Task 2 | Product Listing (8 products, grid layout) | ✅ Done |
| Task 3 | CSS Styling & Layout | ✅ Done |
| Task 4 | Shopping Cart (AJAX add/remove) | ✅ Done |
| Task 5 | Cart Summary & Price Calculation | ✅ Done |
| Task 6 | Checkout Simulation + Confirmation | ✅ Done |
| Task 7 | Bonus: Qty +/−, Sessions, Hover Effects | ✅ Done |

---

## 🚀 How to Run (Step-by-Step)

### Step 1 — Install Django
```bash
pip install django
```

### Step 2 — Navigate to the project folder
```bash
cd ShopEasy
```

### Step 3 — Apply database migrations
```bash
python manage.py migrate
```
> This creates the database AND seeds 8 sample products automatically!

### Step 4 — Start the development server
```bash
python manage.py runserver
```

### Step 5 — Open in your browser
```
http://127.0.0.1:8000/
```

---

## 🔑 Key Features

- **8 Products** — Displayed in a responsive animated grid with emoji icons and category badges
- **Add to Cart** — AJAX-powered (no page reload), navbar badge updates instantly
- **Cart Management** — Increase/decrease quantity with +/− buttons, remove items
- **Dynamic Totals** — All prices recalculate in real time
- **Django Sessions** — Cart stored server-side, persists across page refreshes
- **Checkout Form** — Collects Name, Email, Address, City
- **Order Confirmation** — Random order ID generated, full summary shown, cart cleared
- **Toast Notifications** — Popup messages for every cart action
- **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🌐 URL Routes

| URL | Page |
|-----|------|
| `/` | Homepage — product listing |
| `/cart/` | Shopping cart |
| `/checkout/` | Checkout form |
| `/place-order/` | Order confirmation (POST only) |
| `/add-to-cart/` | AJAX: add item |
| `/remove-from-cart/` | AJAX: remove item |
| `/update-cart/` | AJAX: update quantity |
| `/admin/` | Django admin panel |

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| Python 3 | Backend language |
| Django 4/5 | Web framework |
| SQLite | Built-in database |
| HTML5 | Page structure |
| CSS3 | Styling & animations |
| JavaScript (Vanilla) | AJAX, DOM updates |
| Django Sessions | Cart persistence |

---

## 📦 Django Admin Panel

To manage products via the admin panel:
```bash
python manage.py createsuperuser
# Then visit: http://127.0.0.1:8000/admin/
```

---

## 📝 External References

- Django Documentation: https://docs.djangoproject.com/
- Google Fonts (Baloo 2, Nunito): https://fonts.google.com/
- Django Sessions: https://docs.djangoproject.com/en/5.0/topics/http/sessions/
- Fetch API (MDN): https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**Vansh Sharma | Experiment-7 | April 2026**
