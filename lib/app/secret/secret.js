const express = require('express');
const router = express.Router();

let guesses = [];
let targetNumber = Math.floor(Math.random()*100) + 1;
console.log(targetNumber);
let num_guesses = 0;
let correct_or_not = false;
let invalidInput = false;

router.get('/play', ( req, res ) => {
    let mode = false;

    if (req.query.mode === 'debug' ) {
        mode = true;
    }

    res.render('secret.hbs', {
        mode: mode,
        targetNumber: targetNumber
    });
})

router.post('/play', ( req, res ) => {

    console.log(targetNumber);
    let userGuess;
    if (!correct_or_not) {
        userGuess = parseInt(req.body.guess, 10);
        num_guesses++;
    }

    if (req.body.restart) {
    
        guesses = [];
        targetNumber = Math.floor(Math.random()*100) + 1;
        num_guesses = 0;
        correct_or_not = false;
        const userGuess = parseInt(req.body.guess, 10);
        num_guesses = 0;
    }

    if (isNaN(userGuess)) {
        return res.render('secret.hbs', {guesses: guesses.slice().reverse() });
    }

    if (!Number.isInteger(Number(userGuess))) {
        return res.render( {invalidInput: true} );
    }

    let status = "";
    let comparison = "";
    if (userGuess > targetNumber) {
        status = "too high";
        comparison = "tooHigh";
        guesses.push( { guess: userGuess, status, comparison });
    }
    else if (userGuess < targetNumber) {
        status = "too low";
        comparison = "tooLow";
        guesses.push( { guess: userGuess, status, comparison });
    }
    else {
        status = "correct";
        comparison = "correct";
        correct_or_not = true;
        guesses.push( { guess: userGuess, status, comparison});
        console.log(userGuess);
        console.log(guesses.slice().reverse());
    }

    res.render('secret.hbs', {
        guesses: guesses.slice().reverse(), 
        num_guesses, 
        correct: correct_or_not });
}); 

module.exports = { router };
