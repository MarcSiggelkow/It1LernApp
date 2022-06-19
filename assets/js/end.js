"use strict";

const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const mostRecentQuiz = localStorage.getItem('mostRecentQuiz');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

let saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        quiz: mostRecentQuiz,
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    const firstPath = location.pathname.split('/')[1];
    let endScreen = window.location.origin+"/"+firstPath+"/highscores.html";
    window.location.assign(endScreen);
};
