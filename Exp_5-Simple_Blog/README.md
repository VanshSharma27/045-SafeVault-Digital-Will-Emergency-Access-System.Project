# Simple Blog — Experiment-5

A lightweight blog platform built with **Flask** (Python) supporting full **CRUD** operations using in-memory storage (no database required).

---

## Project Structure

```
simple_blog/
├── app.py                  # Main Flask application
├── templates/
│   ├── base.html           # Shared layout (nav, header, footer, CSS)
│   ├── index.html          # Home page — lists all posts
│   ├── create.html         # Create new post form
│   └── edit.html           # Edit existing post form
├── static/
│   └── style.css           # Responsive overrides
└── README.md
```

---

## Setup & Run

```bash
# 1. Create & activate a virtual environment (optional)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install Flask
pip install flask

# 3. Run the app
python app.py
```

Open your browser at **http://127.0.0.1:5000**

---

## Features

| Feature | Route | Method |
|---------|-------|--------|
| View all posts | `/` | GET |
| Create post | `/create` | GET / POST |
| Edit post | `/edit/<id>` | GET / POST |
| Delete post | `/delete/<id>` | POST |

---

## References

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Jinja2 Template Docs](https://jinja.palletsprojects.com/)
- [Google Fonts — Playfair Display & DM Sans](https://fonts.google.com/)
