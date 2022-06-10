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
        categorySwitch = [300,309];
        break;
    case "allgemein":
        categorySwitch = [310,319];
        break;
    case "internet":
        categorySwitch = [320,329];
        break;
    case "flagge":
        categorySwitch = [330,339];
        break;
    default:
      break;
  }

const username = "marc.siggelkow@htw-dresden.de";
const password = "ultraSafesPasswort";




/*async function fetchApiCall(id){
  var url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/"+id;
  const response = await fetch(url, {
    method: 'get', // Default is 'get'
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      "Authorization": "Basic " + window.btoa(username + ":" + password)
    })
  })
  //the response have to be converted to json type file, so it can be used
  let object = await response.json();
  
  appendObject(object);  
};

function formatQuestions(object) {
    console.log(object);
};

function appendObject(object) {
    data.push(object);
    console.log(data),
};*/


// async function
async function fetchAsync (id) {
    var url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/"+id;
    // await response of fetch call
    let response = await fetch(url, {
        method: 'get', // Default is 'get'
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


  


// trigger async function
// log response or catch error of fetch promise
const firstElement = categorySwitch.shift();
const lastElement= categorySwitch.pop();

let result  = [];
let data = [];

//Calls the function that fetches the data from API
for(i = firstElement; i<= lastElement;i++) {
    fetchAsync(i)
        .then(data => formatQuestion(data))
        .catch(reason => console.log(reason.message))
}


function formatQuestion(object) {
    result.push(object);
    console.log(result);
    if(result.length === 10) {
        questions = result.map((loadedQuestion) => {
            const formattedQuestion = {
                id: loadedQuestion.id,
                question: loadedQuestion.text,
            };


        
            const answerChoices = [...loadedQuestion.options];
        
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

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    console.log(availableQuesions);
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


//curl --user marc.siggelkow@htw-dresden.de:ultraSafesPasswort -X POST -H 'Content-Type: application/json' \
//https://irene.informatik.htw-dresden.de:8888/api/quizzes/1/solve --data '[1]'

choices.forEach((choice) => {  
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        console.log(selectedAnswer);
 
        let postData = "["+selectedAnswer+"]";
        //postData.push(selectedAnswer);
        //console.log(postData);
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
            //console.log(res);
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
