const start = document.getElementById("startBtn")
const settings = document.getElementById("settings")
const quiz = document.getElementById("quiz")
const number = document.getElementById("number")
const category = document.getElementById("category")
const difficulty = document.getElementById("difficulty")
const question1 = document.getElementById("question")
const answerbtn = document.querySelectorAll(".answer-buttons .btn")

let questions = [];
let questionindex = 0;
let score = 0;
let answered = false;
let userAnswers = [];



const apiurl = `https://opentdb.com/api.php?amount=`;

async function getquestions(num, cate, diff) {
  try {
    const response = await fetch(
      `${apiurl}${num}&category=${cate}&difficulty=${diff}&type=multiple`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      console.error("API Error. Code:", data.response_code);
      return;
    }

    return data.results;

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function showQuestion() {
  const currentquestion = questions[questionindex];
  answered = false;

  question1.innerHTML = currentquestion.question;

  let answers = [
    ...currentquestion.incorrect_answers,
    currentquestion.correct_answer
  ];

  answers.sort(() => Math.random() - 0.5);

  answerbtn.forEach((btn, index) => {
    btn.innerHTML = answers[index];
    btn.dataset.correct = answers[index] === currentquestion.correct_answer;
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");

    // restore previous selection
    if (userAnswers[questionindex] === answers[index]) {
      answered = true;
      btn.disabled = true;

      if (btn.dataset.correct === "true") {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
      }

      answerbtn.forEach(b => b.disabled = true);
    }

    btn.onclick = function () {
      if (answered) return;
      answered = true;

      userAnswers[questionindex] = btn.innerHTML;

      answerbtn.forEach(b => b.disabled = true);

      if (btn.dataset.correct === "true") {
        btn.classList.add("correct");
        score++;
      } else {
        btn.classList.add("wrong");
        answerbtn.forEach(b => {
          if (b.dataset.correct === "true") {
            b.classList.add("correct");
          }
        });
      }
    };
  });
}

function nextQuestion() {
  if (!answered) return;

  questionindex++;

  if (questionindex < questions.length) {
    showQuestion();
  } else {
    showFinalScore();
  }
}

function prevQuestion() {
  if (questionindex === 0) return;

  questionindex--;
  showQuestion();
}

function showFinalScore() {
  question1.innerHTML = `
    Quiz Completed 🎉<br><br>
    Final Score: ${score} / ${questions.length}
  `;

  document.querySelector(".answer-buttons").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("prevBtn").style.display = "none";
}






start.addEventListener("click",async function(){
    settings.style.display="none";
    quiz.style.display="block";
    start.style.display="none";

    score = 0;
    questionindex = 0;
    userAnswers = [];

    document.querySelector(".answer-buttons").style.display = "block";
document.getElementById("nextBtn").style.display = "inline-block";
document.getElementById("prevBtn").style.display = "inline-block";
document.getElementById("submitBtn").style.display = "inline-block";
    

    const num = number.value ; 
    const cate = category.value ;
    const diff= document.querySelector('input[name="difficulty"]:checked')?.value ;

    questions = await getquestions(num,cate,diff);
    console.log(questions);
    
    showQuestion();

    
});

document.getElementById("nextBtn").addEventListener("click", nextQuestion);
document.getElementById("prevBtn").addEventListener("click", prevQuestion);
document.getElementById("submitBtn").addEventListener("click", showFinalScore);







//10&category=21&difficulty=easy&type=multiple`



