const quizData = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks Text Mark Language",
            "None of these"
        ],
        correct: 0
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "CSS", "Java", "Python"],
        correct: 1
    },
    {
        question: "Which is used for web page interactivity?",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    loadQuestion();
}

function loadQuestion() {
    const q = quizData[currentQuestion];
    document.getElementById("question").innerText = q.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerText = option;
        div.onclick = () => selectAnswer(index);
        optionsDiv.appendChild(div);
    });
}

function selectAnswer(selected) {
    if (selected === quizData[currentQuestion].correct) {
        score++;
    }
    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("scoreText").innerText =
        `Your Score: ${score} / ${quizData.length}`;

    let feedback = "Try Again";
    if (score === quizData.length) feedback = "Excellent";
    else if (score >= 2) feedback = "Good";

    document.getElementById("feedback").innerText = feedback;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById("result").classList.add("hidden");
    document.getElementById("intro").classList.remove("hidden");
}
