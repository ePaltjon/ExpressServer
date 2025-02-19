function resetGame() {
    return {
        guesses: [],
        targetNumber: Math.floor(Math.random() * 100) + 1,
        num_guesses: 0,
        correct_or_not: false
    };
}

module.exports = resetGame;