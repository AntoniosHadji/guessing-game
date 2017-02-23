function generateWinningNumber() {
  return Math.floor(100*Math.random() + 1);
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function newGame() {
  return new Game();
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
  if (num < 1 || num > 100 || isNaN(num)) {
    throw 'That is an invalid guess.';
  }
  this.playersGuess = num;
  this.pastGuesses.push(num);
  return this.checkGuess();
}

Game.prototype.checkGuess = function() {
  if (this.winningNumber === this.playersGuess) {
    return 'You Win!';
  }
  if (this.pastGuesses.length === 5) {
    return 'You Lose.';
  }
  let index = this.pastGuesses.indexOf(this.playersGuess);
  if (index !== -1 && index !== this.pastGuesses.length -1) {
    return 'You have already guessed that number.';
  }
  if (this.difference() < 10) {
    return "You're burning up!";
  }
  if (this.difference() < 25) {
    return "You're lukewarm.";
  }
  if (this.difference() < 50) {
    return "You're a bit chilly.";
  }
  if (this.difference() < 100) {
    return "You're ice cold!";
  }
}

Game.prototype.provideHint = function() {
  let hint = [];
  hint.push(this.winningNumber);
  hint.push(generateWinningNumber());
  hint.push(generateWinningNumber());
  return shuffle(hint);
}

