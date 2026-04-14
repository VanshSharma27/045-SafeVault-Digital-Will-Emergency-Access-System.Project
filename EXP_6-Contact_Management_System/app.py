# ============================================================
# Project Title : Contact Management System
# Author        : [Your Name]
# Date          : April 2026
# Description   : A Flask-based CRUD web application to manage
#                 contacts — add, view, edit, delete, and search.
# ============================================================

from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "contact_mgmt_secret_key"

# ── In-memory contact store ──────────────────────────────────
# Each contact is a dict with keys: id, name, phone, email, address
contacts = [
    {"id": 1, "name": "Alice Johnson",  "phone": "9876543210", "email": "alice@example.com",  "address": "12 Elm Street, Delhi"},
    {"id": 2, "name": "Bob Sharma",     "phone": "9123456789", "email": "bob@example.com",    "address": "45 Oak Avenue, Mumbai"},
    {"id": 3, "name": "Carol Mehta",    "phone": "9012345678", "email": "carol@example.com",  "address": "78 Pine Road, Bangalore"},
]
next_id = 4   # Simple auto-increment counter for new contacts


# ── Helper ───────────────────────────────────────────────────
def find_contact(contact_id):
    """Return the contact dict matching contact_id, or None."""
    return next((c for c in contacts if c["id"] == contact_id), None)


# ── Routes ───────────────────────────────────────────────────

@app.route("/")
def index():
    """Home: list all contacts, with optional search."""
    query = request.args.get("q", "").strip().lower()
    if query:
        results = [
            c for c in contacts
            if query in c["name"].lower() or query in c["phone"]
        ]
    else:
        results = contacts
    return render_template("index.html", contacts=results, query=query)


@app.route("/add", methods=["GET", "POST"])
def add_contact():
    """Create a new contact."""
    global next_id
    if request.method == "POST":
        name    = request.form.get("name", "").strip()
        phone   = request.form.get("phone", "").strip()
        email   = request.form.get("email", "").strip()
        address = request.form.get("address", "").strip()

        # ── Validation ────────────────────────────────────────
        errors = []
        if not name:
            errors.append("Name is required.")
        if not phone:
            errors.append("Phone number is required.")
        elif not phone.isdigit() or len(phone) < 7:
            errors.append("Phone must be numeric and at least 7 digits.")
        if not email or "@" not in email:
            errors.append("A valid email address is required.")

        if errors:
            for err in errors:
                flash(err, "error")
            return render_template("add_contact.html",
                                   form_data=request.form)

        contacts.append({
            "id":      next_id,
            "name":    name,
            "phone":   phone,
            "email":   email,
            "address": address,
        })
        next_id += 1
        flash(f"Contact '{name}' added successfully!", "success")
        return redirect(url_for("index"))

    return render_template("add_contact.html", form_data={})


@app.route("/edit/<int:contact_id>", methods=["GET", "POST"])
def edit_contact(contact_id):
    """Update an existing contact."""
    contact = find_contact(contact_id)
    if not contact:
        flash("Contact not found.", "error")
        return redirect(url_for("index"))

    if request.method == "POST":
        name    = request.form.get("name", "").strip()
        phone   = request.form.get("phone", "").strip()
        email   = request.form.get("email", "").strip()
        address = request.form.get("address", "").strip()

        errors = []
        if not name:
            errors.append("Name is required.")
        if not phone:
            errors.append("Phone number is required.")
        elif not phone.isdigit() or len(phone) < 7:
            errors.append("Phone must be numeric and at least 7 digits.")
        if not email or "@" not in email:
            errors.append("A valid email address is required.")

        if errors:
            for err in errors:
                flash(err, "error")
            return render_template("edit_contact.html",
                                   contact=contact,
                                   form_data=request.form)

        # Apply updates in-place
        contact["name"]    = name
        contact["phone"]   = phone
        contact["email"]   = email
        contact["address"] = address
        flash(f"Contact '{name}' updated successfully!", "success")
        return redirect(url_for("index"))

    return render_template("edit_contact.html",
                           contact=contact,
                           form_data=contact)


@app.route("/delete/<int:contact_id>", methods=["POST"])
def delete_contact(contact_id):
    """Remove a contact from the list."""
    global contacts
    contact = find_contact(contact_id)
    if contact:
        contacts = [c for c in contacts if c["id"] != contact_id]
        flash(f"Contact '{contact['name']}' deleted.", "success")
    else:
        flash("Contact not found.", "error")
    return redirect(url_for("index"))


# ── Entry Point ──────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)
