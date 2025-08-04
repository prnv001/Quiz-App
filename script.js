// DOM Elements 
const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const totalTime = document.getElementById("total-time");
const usernameInput = document.getElementById("username");
const saveScoreBtn = document.getElementById("save-score-btn");
const highScoresContainer = document.getElementById("high-scores");
const leaderboardScreen = document.getElementById("leaderboard-screen");
const viewScoresBtn = document.getElementById("view-scores-btn");
const backToStartBtn = document.getElementById("back-to-start-btn");
const timerProgress = document.getElementById("timer-progress");
const startBtn = document.getElementById("start-btn");

// Quiz Data    
const questions = [
  {
    question: "What is the capital of France?",
    answers: ["Berlin", "Madrid", "Paris", "Rome"],
    correct: "Paris",
  },
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Text Markup Language",
      "Hyper Transfer Markup Language",
    ],
    correct: "Hyper Text Markup Language",
  },
  {
    question: "Which company developed JavaScript?",
    answers: ["Microsoft", "Google", "Netscape", "Apple"],
    correct: "Netscape",
  },
  {
    question: "Which CSS property controls the text size?",
    answers: ["font-style", "text-size", "font-size", "text-style"],
    correct: "font-size",
  },{
  question: "Which HTML element is used for the largest heading?",
  answers: ["<head>", "<h1>", "<h6>", "<title>"],
  correct: "<h1>"
},
{
  question: "Which of the following is NOT a valid CSS value for `position`?",
  answers: ["static", "relative", "center", "absolute"],
  correct: "center"
},
{
  question: "What does `NaN` stand for in JavaScript?",
  answers: ["No assigned Number", "Not a Number", "New and Null", "Next available Number"],
  correct: "Not a Number"
},
{
  question: "Which array method returns a new array with elements that pass a condition?",
  answers: ["map()", "reduce()", "filter()", "forEach()"],
  correct: "filter()"
},
{
  question: "What does `===` mean in JavaScript?",
  answers: [
    "Assignment operator",
    "Equal value and type",
    "Equal value only",
    "Not equal"
  ],
  correct: "Equal value and type"
},
{
  question: "Which HTML attribute is used to link a CSS file?",
  answers: ["rel", "href", "style", "src"],
  correct: "href"
},
{
  question: "Which CSS unit is relative to the root element's font size?",
  answers: ["em", "rem", "%", "px"],
  correct: "rem"
},
{
  question: "What does `event.preventDefault()` do in JavaScript?",
  answers: [
    "Stops event from bubbling",
    "Prevents the default browser behavior",
    "Removes event listener",
    "Cancels all JS code"
  ],
  correct: "Prevents the default browser behavior"
},
{
  question: "Which method is used to select a single element by its ID in JavaScript?",
  answers: [
    "document.querySelector()",
    "document.getElementByClassName()",
    "document.getElementById()",
    "document.getElementsByTagName()"
  ],
  correct: "document.getElementById()"
},
{
  question: "Which protocol is more secure: HTTP or HTTPS?",
  answers: ["HTTP", "HTTPS", "Both are the same", "FTP"],
  correct: "HTTPS"
}

];

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let totalUsedTime = 0;
let timer;

//  Event Listeners 
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});
saveScoreBtn.addEventListener("click", saveHighScore);
viewScoresBtn.addEventListener("click", showLeaderboard);
backToStartBtn.addEventListener("click", () => {
  leaderboardScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

//  Functions 
function startQuiz() {
  startScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 60;
  totalUsedTime = 0;
  startTimer();
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;
  const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.addEventListener("click", () => selectAnswer(li, answer, currentQuestion.correct));
    answerButtons.appendChild(li);
  });
}

function resetState() {
  nextBtn.classList.add("hidden");
  answerButtons.innerHTML = "";
}

function selectAnswer(selectedBtn, selectedAnswer, correctAnswer) {
  const allButtons = answerButtons.querySelectorAll("li");
  allButtons.forEach((btn) => {
    btn.style.pointerEvents = "none";
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    } else if (btn.textContent === selectedAnswer) {
      btn.classList.add("wrong");
    }
  });
  if (selectedAnswer === correctAnswer) score++;
  nextBtn.classList.remove("hidden");
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimerBar();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
  updateTimerBar();
}

function updateTimerBar() {
  const percent = (timeLeft / 60) * 100;
  timerProgress.style.width = `${percent}%`;
}

function endQuiz() {
  clearInterval(timer);
  totalUsedTime = 60 - timeLeft;
  quizContainer.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScore.textContent = `${score} / ${shuffledQuestions.length}`;
  totalTime.textContent = `${totalUsedTime}s`;
}

function saveHighScore() {
  const username = usernameInput.value.trim();
  if (!username) return;
  const newScore = {
    name: username,
    score,
    time: `${totalUsedTime}s`,
  };
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  usernameInput.value = "";
  showLeaderboard();
}

function showLeaderboard() {
  resultScreen.classList.add("hidden");
  leaderboardScreen.classList.remove("hidden");
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScoresContainer.innerHTML = highScores
    .map((entry) => `<p><strong>${entry.name}</strong>: ${entry.score} (${entry.time})</p>`) 
    .join("");
}