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
        categorySwitch = [500,501,502,503,504,505,506,507,508,509];
        break;
    case "allgemein":
        categorySwitch = [510,511,512,513,514,515,516,517,518,519];
        break;
    case "internet":
        categorySwitch = [520,521,522,523,524,525,526,527,528,529];
        break;
    case "flagge":
        categorySwitch = [530,531,532,533,534,535,536,537,538,539];
        break;
    default:
      break;
  }

const username = "marc.siggelkow@htw-dresden.de";
const password = "ultraSafesPasswort";

let test;


let result  = [];
let data = [];
async function fetchApiCall(id){
  var url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/"+id;
  const response = await fetch(url, {
    method: 'get', // Default is 'get'
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + window.btoa(username + ":" + password)
    })
  })
  let object = await response.json();
  console.log(object);
  questions = await object.map(async loadedQuestion => ({
        question: loadedQuestion.text,
        choice: loadedQuestion.options}));
  //the response have to be converted to json type file, so it can be used
  return await questions;
};

//Calls the function that fetches the data
for(i = 310; i<320;i++) {
    data.push(fetchApiCall(i));
}

console.log(data);


//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 8;

startGame = () => {
    console.log(test);
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



//Function add ID to url from what User picked for category
function getIdFromUrl(obj)
    {
      localUrl = 'http://127.0.0.1:5500/game.html'
      location.href ="";
      location.href = localUrl +"?id=" + obj;
      //window.alert(url += "?id=" + obj);
    }


//Function to get Array from Fetched Array from API
function getByValue(arr, value) {

    for (var i=0, iLen=arr.length; i<iLen; i++) {
      console.log("jhed");
        if (arr[i].b == value) return arr[i];
    }
    }
