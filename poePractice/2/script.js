const questions = [
    {
        question: "What is the capital of France?",
        options: ["A. Berlin", "B. Madrid", "C. Paris", "D. Rome"],
        answer: "C"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["A. Earth", "B. Mars", "C. Venus", "D. Jupiter"],
        answer: "B"
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["A. Charles Dickens", "B. William Shakespeare", "C. Mark Twain", "D. Jane Austen"],
        answer: "B"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["A. Atlantic Ocean", "B. Indian Ocean", "C. Arctic Ocean", "D. Pacific Ocean"],
        answer: "D"
    },
    {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["A. Oxygen", "B. Hydrogen", "C. Carbon Dioxide", "D. Nitrogen"],
        answer: "C"
    }
];

let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const submitBtn = document.getElementById('submitBtn');
const feedbackElement = document.getElementById('feedback');
const resultContainer = document.getElementById('resultContainer');
const questionContainer = document.getElementById('questionContainer');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

function loadQuestion() {
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsContainer.innerHTML = '';

    q.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.classList.add('option');
        label.innerHTML = `
            <input type="radio" name="option" value="${String.fromCharCode(65 + index)}">
            ${option}
        `;
        optionsContainer.appendChild(label);
    });

    feedbackElement.textContent = '';
}

submitBtn.addEventListener('click', function() {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (!selectedOption) {
        feedbackElement.textContent = "Please select an option!";
        feedbackElement.style.color = "red";
        return;
    }

    const answer = selectedOption.value;
    const correctAnswer = questions[currentQuestion].answer;

    if (answer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
        score++;
    } else {
        feedbackElement.textContent = `Wrong! Correct Answer: ${correctAnswer}`;
        feedbackElement.style.color = "red";
    }

    submitBtn.disabled = true;

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
            submitBtn.disabled = false;
        } else {
            showResult();
        }
    }, 1500);
});

function showResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.textContent = `${score} out of ${questions.length}`;
}

restartBtn.addEventListener('click', function() {
    currentQuestion = 0;
    score = 0;
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    loadQuestion();
    submitBtn.disabled = false;
});

// Start the quiz
loadQuestion();
