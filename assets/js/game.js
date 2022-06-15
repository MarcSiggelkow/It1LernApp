"use strict";

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


//Sets the range of ID's for the Questions we will fetch later from  the  API
// based on which category the user picked
switch (koopId) {
    case "mathe":
        categorySwitch = [469,478];
        break;
    case "allgemein":
        categorySwitch = [506,517];
        break;
    case "internet":
        categorySwitch = [524,533];
        break;
    case "hauptstadt":
        categorySwitch = [1563,1572];
        break;
    default:
        break;
  }

const username = "marc.siggelkow@htw-dresden.de";
const password = "ultraSafesPasswort";




// async function for Calling the API
async function fetchAsync (id) {
    var url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/"+id;
    // await response of fetch call
    let response = await fetch(url, {
        method: 'get',
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
          "Authorization": "Basic " + window.btoa(username + ":" + password)
        })
      });
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
  }


  



// Getting first and Last ID from Question Array
const firstElement = categorySwitch.shift();
const lastElement= categorySwitch.pop();

let result  = [];
let data = [];

// trigger async function for range of Questions based on ID
// log response or catch error of fetch promise
//Calls the function that fetches the data from API
for(let i = firstElement; i<= lastElement;i++) {
    fetchAsync(i)
        .then(data => formatQuestion(data))
        .catch(reason => console.log(reason.message))
}


function formatQuestion(object) {
    //pushing all fetched Objects into result
    result.push(object);
    //when we have all 10 Questions -> we set them up to use them
    if(result.length === 10) {
        // iterating over all objects in "result"
        questions = result.map((loadedQuestion) => {
            const formattedQuestion = {
                id: loadedQuestion.id,
                question: loadedQuestion.text,
            };
       
            const answerChoices = [...loadedQuestion.options];
            //setting ID which we will use later for calling API to solve quiz
            // +1 because array is [0,1,2,3] but API id needs to be [1,2,3,4]
            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });
        
            return formattedQuestion;
    })
    startGame();
    }

}

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 8;

let startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

let getNewQuestion = () => {
    //when end is reached -> store Score in local storage and return user to end  page
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('mostRecentQuiz', koopId);
        //go to the end page
        const firstPath = location.pathname.split('/')[1];
        let endScreen = window.location.origin+"/"+firstPath+"/end.html?id="+koopId;
        return window.location.assign(endScreen);
    }
    //Update Question text
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    //picking random Question out of index
    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];

    //Update HTML with current question
    question.innerHTML =  currentQuestion.question;
    //Updating HTML with answer options
    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

//Eventlistener User Click
choices.forEach((choice) => {  
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'] - 1;
 
        //Calling API to solve Quiz
        let postData = "["+selectedAnswer+"]";
        fetch('https://irene.informatik.htw-dresden.de:8888/api/quizzes/'+currentQuestion.id+'/solve', {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Basic " + window.btoa(username + ":" + password)
          }),
        body: postData
        })
        .then(res => res.json())
        .then((res) => {
            let check = true;
            const classToApply =
                check == res.success ? 'correct' : 'incorrect';
            if (classToApply === 'correct') {
                incrementScore(CORRECT_BONUS);
            }

            selectedChoice.parentElement.classList.add(classToApply);
            
            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
            }, 1000);
        })
    });
});

let incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

