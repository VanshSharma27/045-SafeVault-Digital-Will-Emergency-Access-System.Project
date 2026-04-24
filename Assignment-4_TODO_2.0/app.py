# ============================================================
# app.py — Flask-Powered Dynamic To-Do List Application
# Assignment 4 | Web Programming with Python & JavaScript Lab (SEC035)
# B.Tech Computer Science and Engineering | SOET
# Student Name  : Aayush
# Enrollment No.: 2401010042
# Date          : April 2026
# ============================================================

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ── Task Model ───────────────────────────────────────────────
class Todo(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed   = db.Column(db.Boolean, default=False)
    priority    = db.Column(db.String(10), default='medium')  # low / medium / high
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Todo {self.id}: {self.title}>'


# ── Route 1: Index — list all tasks with filter ──────────────
@app.route('/')
def index():
    """Render main To-Do page with optional filter."""
    filter_by = request.args.get('filter', 'all')

    if filter_by == 'active':
        todos = Todo.query.filter_by(completed=False).order_by(Todo.created_at.desc()).all()
    elif filter_by == 'completed':
        todos = Todo.query.filter_by(completed=True).order_by(Todo.created_at.desc()).all()
    else:
        todos = Todo.query.order_by(Todo.created_at.desc()).all()

    total  = Todo.query.count()
    active = Todo.query.filter_by(completed=False).count()
    done   = Todo.query.filter_by(completed=True).count()

    return render_template('index.html',
                           todos=todos,
                           filter_by=filter_by,
                           total=total,
                           active=active,
                           done=done)


# ── Route 2: Add a new task (POST) ───────────────────────────
@app.route('/add', methods=['POST'])
def add():
    """Accept form POST, create new task, redirect to index."""
    title       = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    priority    = request.form.get('priority', 'medium')

    if priority not in ('low', 'medium', 'high'):
        priority = 'medium'

    if title:
        new_todo = Todo(title=title, description=description, priority=priority)
        db.session.add(new_todo)
        db.session.commit()

    return redirect(url_for('index'))


# ── Route 3: Toggle completed status ─────────────────────────
@app.route('/toggle/<int:todo_id>')
def toggle(todo_id):
    """Toggle the completed field of a task."""
    todo = Todo.query.get_or_404(todo_id)
    todo.completed = not todo.completed
    db.session.commit()
    return redirect(request.referrer or url_for('index'))


# ── Route 4: Edit task — GET shows form, POST saves changes ──
@app.route('/edit/<int:todo_id>', methods=['GET', 'POST'])
def edit(todo_id):
    """Show edit form (GET) and save updated task (POST)."""
    todo = Todo.query.get_or_404(todo_id)

    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        if title:
            todo.title       = title
            todo.description = request.form.get('description', '').strip()
            priority         = request.form.get('priority', 'medium')
            todo.priority    = priority if priority in ('low', 'medium', 'high') else 'medium'
            db.session.commit()
        return redirect(url_for('index'))

    return render_template('edit.html', todo=todo)


# ── Route 5: Delete a task ───────────────────────────────────
@app.route('/delete/<int:todo_id>')
def delete(todo_id):
    """Delete a task and redirect back."""
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return redirect(request.referrer or url_for('index'))


# ── Route 6: Clear all completed tasks ──────────────────────
@app.route('/clear_completed')
def clear_completed():
    """Delete all tasks marked as completed."""
    Todo.query.filter_by(completed=True).delete()
    db.session.commit()
    return redirect(url_for('index'))


# ── Entry point ──────────────────────────────────────────────
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
