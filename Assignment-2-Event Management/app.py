# ============================================================
# Project Title : Event Management Website
# Student Name  : ______________________________
# Roll Number   : ______________________________
# Date          : ______________________________
# Course        : Web Development Laboratory
# Experiment    : 4
# ============================================================

from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'event_management_secret_key_2024'

DATABASE = 'events.db'

# ─────────────────────────────────────────────
# DATABASE HELPER FUNCTIONS
# ─────────────────────────────────────────────

def get_db():
    """Open a database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row   # rows act like dicts
    return conn


def init_db():
    """Create tables and seed sample data if DB doesn't exist yet."""
    db = get_db()
    cursor = db.cursor()

    # Events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            date        TEXT    NOT NULL,
            time        TEXT    NOT NULL,
            venue       TEXT    NOT NULL,
            description TEXT,
            image_url   TEXT,
            category    TEXT    DEFAULT 'General',
            rsvp_count  INTEGER DEFAULT 0
        )
    ''')

    # Registrations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS registrations (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name   TEXT    NOT NULL,
            email       TEXT    NOT NULL,
            phone       TEXT    NOT NULL,
            event_id    INTEGER NOT NULL,
            tickets     INTEGER NOT NULL,
            FOREIGN KEY (event_id) REFERENCES events(id)
        )
    ''')

    # Seed 4 sample events if table is empty
    cursor.execute('SELECT COUNT(*) FROM events')
    if cursor.fetchone()[0] == 0:
        sample_events = [
            ('Tech Summit 2025',      '2025-08-15', '10:00 AM', 'Convention Centre, Delhi',
             'Annual technology conference featuring AI, Cloud & Web topics.',
             'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', 'Technology'),
            ('Music Fiesta',          '2025-09-05', '06:00 PM', 'Open Air Amphitheatre, Mumbai',
             'Live performances by top artists across genres.',
             'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'Music'),
            ('Startup Pitch Night',   '2025-09-20', '05:30 PM', 'Innovation Hub, Bangalore',
             'Entrepreneurs pitch to leading VCs and angel investors.',
             'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600', 'Business'),
            ('Photography Workshop',  '2025-10-10', '09:00 AM', 'Art Gallery, Pune',
             'Hands-on workshop for beginners and intermediate photographers.',
             'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600', 'Workshop'),
        ]
        cursor.executemany(
            'INSERT INTO events (name, date, time, venue, description, image_url, category) VALUES (?,?,?,?,?,?,?)',
            sample_events
        )

    db.commit()
    db.close()


# Initialise DB when app starts
with app.app_context():
    init_db()


# ─────────────────────────────────────────────
# PUBLIC ROUTES
# ─────────────────────────────────────────────

@app.route('/')
def index():
    """Landing / Home page."""
    db = get_db()
    events = db.execute('SELECT * FROM events LIMIT 4').fetchall()
    db.close()
    return render_template('index.html', events=events)


@app.route('/events')
def events():
    """All events listing with optional search & category filter."""
    search   = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()

    db = get_db()
    query  = 'SELECT * FROM events WHERE 1=1'
    params = []

    if search:
        query  += ' AND (name LIKE ? OR venue LIKE ? OR description LIKE ?)'
        params += [f'%{search}%', f'%{search}%', f'%{search}%']
    if category:
        query  += ' AND category = ?'
        params.append(category)

    all_events   = db.execute(query, params).fetchall()
    categories   = db.execute('SELECT DISTINCT category FROM events').fetchall()
    db.close()

    return render_template('events.html',
                           events=all_events,
                           categories=categories,
                           search=search,
                           selected_category=category)


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Event registration form (GET shows form, POST saves it)."""
    db = get_db()
    all_events = db.execute('SELECT id, name FROM events').fetchall()

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email     = request.form.get('email', '').strip()
        phone     = request.form.get('phone', '').strip()
        event_id  = request.form.get('event_id')
        tickets   = request.form.get('tickets', 1)

        # Basic server-side validation
        if not all([full_name, email, phone, event_id]):
            flash('Please fill in all required fields.', 'error')
        else:
            db.execute(
                'INSERT INTO registrations (full_name, email, phone, event_id, tickets) VALUES (?,?,?,?,?)',
                (full_name, email, phone, event_id, tickets)
            )
            # Increment RSVP counter
            db.execute('UPDATE events SET rsvp_count = rsvp_count + ? WHERE id = ?',
                       (tickets, event_id))
            db.commit()
            flash(f'🎉 Registration successful! Welcome, {full_name}!', 'success')
            db.close()
            return redirect(url_for('events'))

    db.close()
    return render_template('register.html', events=all_events)


# ─────────────────────────────────────────────
# ADMIN ROUTES
# ─────────────────────────────────────────────

ADMIN_PASSWORD = 'admin123'   # Change in production!


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        if request.form.get('password') == ADMIN_PASSWORD:
            session['admin'] = True
            flash('Logged in successfully.', 'success')
            return redirect(url_for('admin'))
        flash('Wrong password.', 'error')
    return render_template('admin_login.html')


@app.route('/admin/logout')
def admin_logout():
    session.pop('admin', None)
    flash('Logged out.', 'info')
    return redirect(url_for('index'))


@app.route('/admin')
def admin():
    if not session.get('admin'):
        flash('Please log in to access the admin panel.', 'error')
        return redirect(url_for('admin_login'))
    db = get_db()
    all_events = db.execute('SELECT * FROM events').fetchall()
    db.close()
    return render_template('admin.html', events=all_events)


@app.route('/admin/add', methods=['POST'])
def admin_add():
    if not session.get('admin'):
        return redirect(url_for('admin_login'))
    db = get_db()
    db.execute(
        'INSERT INTO events (name, date, time, venue, description, image_url, category) VALUES (?,?,?,?,?,?,?)',
        (
            request.form['name'],
            request.form['date'],
            request.form['time'],
            request.form['venue'],
            request.form.get('description', ''),
            request.form.get('image_url', ''),
            request.form.get('category', 'General'),
        )
    )
    db.commit()
    db.close()
    flash('Event added successfully!', 'success')
    return redirect(url_for('admin'))


@app.route('/admin/edit/<int:event_id>', methods=['GET', 'POST'])
def admin_edit(event_id):
    if not session.get('admin'):
        return redirect(url_for('admin_login'))
    db = get_db()
    event = db.execute('SELECT * FROM events WHERE id = ?', (event_id,)).fetchone()

    if request.method == 'POST':
        db.execute(
            'UPDATE events SET name=?, date=?, time=?, venue=?, description=?, image_url=?, category=? WHERE id=?',
            (
                request.form['name'],
                request.form['date'],
                request.form['time'],
                request.form['venue'],
                request.form.get('description', ''),
                request.form.get('image_url', ''),
                request.form.get('category', 'General'),
                event_id,
            )
        )
        db.commit()
        db.close()
        flash('Event updated successfully!', 'success')
        return redirect(url_for('admin'))

    db.close()
    return render_template('admin_edit.html', event=event)


@app.route('/admin/delete/<int:event_id>')
def admin_delete(event_id):
    if not session.get('admin'):
        return redirect(url_for('admin_login'))
    db = get_db()
    db.execute('DELETE FROM events WHERE id = ?', (event_id,))
    db.commit()
    db.close()
    flash('Event deleted.', 'info')
    return redirect(url_for('admin'))


# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True)
