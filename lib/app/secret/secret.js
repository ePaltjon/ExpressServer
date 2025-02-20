const express = require('express');
const router = express.Router();
const resetGame = require('../common/common.js');
const path = require('path');

let guesses = [];
let targetNumber = Math.floor(Math.random()*100) + 1;
console.log(targetNumber);
let correct_or_not = false;
let invalidInput = false;

router.get('/play', ( req, res ) => {
    let mode = false;

    if (req.query.mode === 'debug' ) {
        mode = true;
    }

    return res.render('secret.hbs', {
        recieved: req.session.guesses, 
        num_guesses: req.session.guesses ? req.session.guesses.length + 1 : 1, 
        correct: correct_or_not,
        mode: mode,
        targetNumber: targetNumber });
})

router.get('/play.css', (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname, '../../../static/play.css'));
})

router.post('/guess', (req, res) => {
    let userGuess;
    //console.log(typeof req.body.guess);
    //if (!req.body.guess || typeof req.body.guess === '') {
        if (!correct_or_not) {
            userGuess = parseInt(req.body.guess, 10);
            if (!isNaN(userGuess)) {
                console.log(userGuess);

                let status = "";
                let comparison = "";
                if (userGuess > targetNumber) {
                    status = "too high";
                    comparison = "tooHigh";
                } else if (userGuess < targetNumber) {
                    status = "too low";
                    comparison = "tooLow";
                } else {
                    status = "correct";
                    comparison = "correct";
                    correct_or_not = true;
                }
                guesses.push({ guess: userGuess, status, comparison, invalidInput });
            
                req.session.guesses = guesses.slice().reverse();
            }
            else {
                invalidInput = true;
            }
        }
    //}

    if (req.body.restart) {
        req.session.guesses = [];
        guesses = [];
        targetNumber = Math.floor(Math.random() * 100) + 1;
        req.session.targetNumber = targetNumber;
        correct_or_not = false;
        req.session.correct_or_not = false;
    }

    res.status(303).redirect('/secret/play');
});

module.exports = { router };
