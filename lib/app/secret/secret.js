const express = require('express');
const router = express.Router();
const resetGame = require('../common/common.js');

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

router.post('/guess', ( req, res ) => {
    
    let userGuess;
    if (!correct_or_not) {
        userGuess = parseInt(req.body.guess, 10);
        num_guesses++;
    }
    /*
    else {
        res.status(303).render('secret.hbs', {guesses: guesses.slice().reverse() });
        res.status(303).redirect(`/secret/play`);
    }
    */

    if (req.body.restart) {
        ({ guesses, targetNumber, num_guesses, correct_or_not } = resetGame());
    }

    if (isNaN(userGuess)) {
        return res.status(303).render('secret.hbs', {guesses: guesses.slice().reverse() });
    }

    if (!Number.isInteger(Number(userGuess))) {
        return res.status(400).render( {invalidInput: true} );
    }

    let status = "";
    let comparison = "";
    if (userGuess > targetNumber) {
        status = "too high";
        comparison = "tooHigh";
    }
    else if (userGuess < targetNumber) {
        status = "too low";
        comparison = "tooLow";
    }
    else {
        status = "correct";
        comparison = "correct";
        correct_or_not = true;
    }
    guesses.push( { guess: userGuess, status, comparison });

    //store variables in session
    req.session.guesses = guesses.slice().reverse();

    return res.render('secret.hbs', {
        guesses: req.session.guesses, 
        num_guesses, 
        correct: correct_or_not });
}); 

router.post('/reset', ( req, res) => {
    ({ guesses, targetNumber, num_guesses, correct_or_not } = resetGame());
    const modeQuery = req.query.mode ? `?mode=${req.query.mode}` : '';
    res.status(303).redirect(`/guess${{modeQuery}}`);
});

module.exports = { router };
