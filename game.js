const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let categorySwitch = 0;
let questions = [];
let counter = 0;

//Gets the ID from the URL based on which category the User picked
var baseUrl = (window.location).href;
var koopId = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);

switch (koopId) {
    case "mathe":
        categorySwitch = 1;
        console.log(categorySwitch);
        break;
    case "allgemein":
        categorySwitch = 2;
        console.log(categorySwitch);
        break;
    case "internet":
        categorySwitch = 3;
        console.log(categorySwitch);
        break;
    case "flagge":
        categorySwitch = 4;
        console.log(categorySwitch);
        break;
    default:
      break;
  }

const username = "marc.siggelkow@htw-dresden.de";
const password = "ultraSafesPasswort";
var url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes"; //+ categorySwitch;

// Example request options
fetch(url, {
    method: 'get', // Default is 'get'
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + window.btoa(username + ":" + password)
    })
  })
  .then(response => response.json())
  

    //.then(response => response.json())
    .then((loadedQuestions) => {
        console.log(loadedQuestions.content);
        console.log(loadedQuestions.options);
        console.log(loadedQuestions.text);
        questions = loadedQuestions.content.map(( loadedQuestion) => {
            console.log(loadedQuestion.text);
            console.log(counter);
            const formattedQuestion = {
                question: loadedQuestion.text
            };

            const answerChoices = [... loadedQuestion.options];
            counter +=1;

            answerChoices.forEach((choice, index)  => {
                formattedQuestion["choice" + (index+1)] = choice;
            })

            return formattedQuestion;
        })
        console.log(questions);
        //questions = loadedQuestions.options;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });


//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 8;


startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};




function getIdFromUrl(obj)
    {
      localUrl = 'http://127.0.0.1:5500/game.html'
      location.href ="";
      location.href = localUrl +"?id=" + obj;
      //window.alert(url += "?id=" + obj);
    }
