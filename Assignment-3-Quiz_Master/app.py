from flask import Flask, render_template, request, session, redirect, url_for
import random
import time

app = Flask(__name__)
app.secret_key = 'quiz_master_secret_key_2024'

QUIZ_DATA = [
    {
        "id": 1,
        "question": "What does HTML stand for?",
        "options": [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        "answer": "Hyper Text Markup Language"
    },
    {
        "id": 2,
        "question": "Which HTTP method is used to submit form data to a server?",
        "options": ["GET", "POST", "PUT", "DELETE"],
        "answer": "POST"
    },
    {
        "id": 3,
        "question": "Which Python framework is used for building web applications in this course?",
        "options": ["Django", "FastAPI", "Flask", "Tornado"],
        "answer": "Flask"
    },
    {
        "id": 4,
        "question": "What does CSS stand for?",
        "options": [
            "Cascading Style Sheets",
            "Computer Style Syntax",
            "Creative Styling System",
            "Custom Style Script"
        ],
        "answer": "Cascading Style Sheets"
    },
    {
        "id": 5,
        "question": "Which Flask function renders an HTML template?",
        "options": ["send_file()", "render_template()", "make_response()", "redirect()"],
        "answer": "render_template()"
    },
    {
        "id": 6,
        "question": "In Flask, what decorator is used to define a route?",
        "options": ["@app.url()", "@app.route()", "@app.path()", "@app.endpoint()"],
        "answer": "@app.route()"
    },
    {
        "id": 7,
        "question": "Which tag is used to create a hyperlink in HTML?",
        "options": ["<link>", "<href>", "<a>", "<url>"],
        "answer": "<a>"
    },
    {
        "id": 8,
        "question": "What is the correct CSS property to change text color?",
        "options": ["text-color", "font-color", "color", "foreground"],
        "answer": "color"
    },
    {
        "id": 9,
        "question": "Which Python data structure is used to store key-value pairs?",
        "options": ["List", "Tuple", "Set", "Dictionary"],
        "answer": "Dictionary"
    },
    {
        "id": 10,
        "question": "What does API stand for?",
        "options": [
            "Application Programming Interface",
            "Automated Processing Integration",
            "Advanced Program Index",
            "Application Process Input"
        ],
        "answer": "Application Programming Interface"
    }
]

TIMER_SECONDS = 300  # 5 minutes

@app.route('/')
def home():
    session.clear()
    return render_template('index.html')

@app.route('/start')
def start():
    questions = QUIZ_DATA.copy()
    random.shuffle(questions)
    for q in questions:
        opts = q['options'].copy()
        random.shuffle(opts)
        q['options'] = opts
    session['questions'] = questions
    session['start_time'] = time.time()
    session['submitted'] = False
    return redirect(url_for('quiz'))

@app.route('/quiz')
def quiz():
    if 'questions' not in session:
        return redirect(url_for('home'))
    elapsed = int(time.time() - session.get('start_time', time.time()))
    remaining = max(0, TIMER_SECONDS - elapsed)
    if remaining == 0 and not session.get('submitted'):
        return redirect(url_for('submit_timeout'))
    return render_template('quiz.html',
                           questions=session['questions'],
                           remaining=remaining,
                           timer_total=TIMER_SECONDS)

@app.route('/submit', methods=['POST'])
def submit():
    if 'questions' not in session:
        return redirect(url_for('home'))
    session['submitted'] = True
    questions = session['questions']
    answers = {}
    score = 0
    negative = 0
    results = []

    for q in questions:
        qid = str(q['id'])
        selected = request.form.get(f'q{qid}', None)
        answers[qid] = selected
        is_correct = (selected == q['answer'])
        is_skipped = (selected is None)

        if is_correct:
            score += 1
        elif not is_skipped:
            negative += 0.25  # negative marking: -0.25 per wrong

        results.append({
            'question': q['question'],
            'options': q['options'],
            'selected': selected,
            'answer': q['answer'],
            'correct': is_correct,
            'skipped': is_skipped
        })

    final_score = max(0, score - negative)
    total = len(questions)
    elapsed = int(time.time() - session.get('start_time', time.time()))
    time_taken = min(elapsed, TIMER_SECONDS)

    if final_score == total:
        feedback = "🏆 Perfect Score! Outstanding performance!"
        grade = "A+"
    elif final_score >= total * 0.8:
        feedback = "🎉 Excellent! You have a strong grasp of the concepts."
        grade = "A"
    elif final_score >= total * 0.6:
        feedback = "👍 Good job! A bit more practice and you'll ace it."
        grade = "B"
    elif final_score >= total * 0.4:
        feedback = "📚 Keep studying! Review the topics you got wrong."
        grade = "C"
    else:
        feedback = "💪 Don't give up! Practice makes perfect."
        grade = "F"

    mins, secs = divmod(time_taken, 60)

    return render_template('result.html',
                           results=results,
                           score=score,
                           negative=negative,
                           final_score=final_score,
                           total=total,
                           feedback=feedback,
                           grade=grade,
                           time_taken=f"{mins}m {secs}s")

@app.route('/submit_timeout')
def submit_timeout():
    session['submitted'] = True
    questions = session.get('questions', [])
    results = [{
        'question': q['question'],
        'options': q['options'],
        'selected': None,
        'answer': q['answer'],
        'correct': False,
        'skipped': True
    } for q in questions]
    return render_template('result.html',
                           results=results,
                           score=0,
                           negative=0,
                           final_score=0,
                           total=len(questions),
                           feedback="⏰ Time's up! You ran out of time.",
                           grade="--",
                           time_taken="5m 0s")

if __name__ == '__main__':
    app.run(debug=True)
