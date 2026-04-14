# ============================================================
# Project Title : Simple Blog Platform (Experiment-5)
# Author        : [Your Name]
# Date          : April 2, 2026
# Description   : A simple Flask-based blog with full CRUD
#                 operations using in-memory storage (no DB).
# ============================================================

from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime

# --- App Initialization ---
app = Flask(__name__)

# --- In-Memory Storage ---
# Each post is a dict: { id, title, content, date }
posts = [
    {
        "id": 1,
        "title": "Welcome to Simple Blog",
        "content": "This is your first blog post! Use the navigation above to create, edit, or delete posts. This platform was built with Flask as part of Experiment-5.",
        "date": "April 2, 2026"
    },
    {
        "id": 2,
        "title": "Getting Started with Flask",
        "content": "Flask is a lightweight Python web framework. It's perfect for building small to medium web applications quickly and cleanly. Combined with Jinja2 templates, it makes web development a breeze.",
        "date": "April 2, 2026"
    }
]

# Counter to generate unique post IDs
next_id = 3


# -------------------------------------------------------
# HOME ROUTE — Read: Display all posts
# -------------------------------------------------------
@app.route("/")
def index():
    """Render the home page with all blog posts."""
    return render_template("index.html", posts=posts)


# -------------------------------------------------------
# CREATE ROUTE — Add a new blog post
# -------------------------------------------------------
@app.route("/create", methods=["GET", "POST"])
def create():
    """
    GET  -> Show the create post form.
    POST -> Validate input, append new post, redirect home.
    """
    global next_id
    error = None

    if request.method == "POST":
        title   = request.form.get("title", "").strip()
        content = request.form.get("content", "").strip()

        # Basic validation
        if not title or not content:
            error = "Both title and content are required."
        else:
            new_post = {
                "id":      next_id,
                "title":   title,
                "content": content,
                "date":    datetime.now().strftime("%B %d, %Y")
            }
            posts.append(new_post)
            next_id += 1
            return redirect(url_for("index"))

    return render_template("create.html", error=error)


# -------------------------------------------------------
# EDIT ROUTE — Update an existing blog post
# -------------------------------------------------------
@app.route("/edit/<int:post_id>", methods=["GET", "POST"])
def edit(post_id):
    """
    GET  -> Show the edit form pre-filled with existing data.
    POST -> Save updated title/content, redirect home.
    """
    # Find the post by ID
    post = next((p for p in posts if p["id"] == post_id), None)

    if post is None:
        return "Post not found.", 404

    error = None

    if request.method == "POST":
        title   = request.form.get("title", "").strip()
        content = request.form.get("content", "").strip()

        if not title or not content:
            error = "Both title and content are required."
        else:
            # Update in place
            post["title"]   = title
            post["content"] = content
            post["date"]    = datetime.now().strftime("%B %d, %Y") + " (edited)"
            return redirect(url_for("index"))

    return render_template("edit.html", post=post, error=error)


# -------------------------------------------------------
# DELETE ROUTE — Remove a blog post
# -------------------------------------------------------
@app.route("/delete/<int:post_id>", methods=["POST"])
def delete(post_id):
    """Remove the post with the given ID and redirect to home."""
    global posts
    posts = [p for p in posts if p["id"] != post_id]
    return redirect(url_for("index"))


# -------------------------------------------------------
# Run the development server
# -------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
