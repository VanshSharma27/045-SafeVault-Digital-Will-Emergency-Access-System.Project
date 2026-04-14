# 🎪 EventHub — Event Management Website

> Web Development Laboratory | Experiment 4 | B.Tech Semester IV

---

## 📁 Project Structure

```
event_management_website/
├── app.py                    ← Flask app + SQLite DB logic
├── requirements.txt
├── README.md
├── events.db                 ← Auto-created on first run
├── templates/
│   ├── base.html             ← Base layout (navbar + footer)
│   ├── index.html            ← Landing page
│   ├── events.html           ← Events listing + search/filter
│   ├── register.html         ← Registration form
│   ├── admin.html            ← Admin panel (add/edit/delete)
│   ├── admin_edit.html       ← Edit event form
│   └── admin_login.html      ← Admin login
└── static/
    ├── css/style.css         ← Full responsive stylesheet
    ├── js/script.js          ← Client-side JS
    └── images/               ← Place local images here
```

---

## ⚙️ Setup & Run

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the Flask app
python app.py

# 3. Open in browser
# http://127.0.0.1:5000
```

---

## 🔐 Admin Access

- URL: `http://127.0.0.1:5000/admin`
- Default password: `admin123`
- Change `ADMIN_PASSWORD` in `app.py` before deployment.

---

## ✅ Tasks Completed

| Task | Description | Status |
|------|-------------|--------|
| 1 | Project Setup, Flask config, landing page | ✅ |
| 2 | Event listing with Jinja2 templates | ✅ |
| 3 | Responsive CSS styling | ✅ |
| 4 | Registration form + JS validation | ✅ |
| 5 | Admin panel — Add / Edit / Delete events | ✅ |
| 6 | Live search, category filter, RSVP counter (Bonus) | ✅ |

---

## 🗄️ Database

SQLite (`events.db`) is auto-created with two tables:

- **events** — id, name, date, time, venue, description, image_url, category, rsvp_count
- **registrations** — id, full_name, email, phone, event_id, tickets

---

## 📚 References

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Jinja2 Templates](https://jinja.palletsprojects.com/)
- [MDN Web Docs — CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)
- [Unsplash](https://unsplash.com) — placeholder images
