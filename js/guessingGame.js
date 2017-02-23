/* eslint-disable id-length, no-unused-vars */

function generateWinningNumber() {
  return Math.floor(100 * Math.random() + 1);
}

function shuffle(array) {
  var m = array.length;
  var tmp, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    tmp = array[m];
    array[m] = array[i];
    array[i] = tmp;
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
    throw new Error('That is an invalid guess.');
  }
  this.playersGuess = num;
  return this.checkGuess();
}

Game.prototype.checkGuess = function() {
  if (this.winningNumber === this.playersGuess) {
    timeToReset();
    return 'You Win!';
  }
  let index = this.pastGuesses.indexOf(this.playersGuess);
  if (index !== -1) {
    return 'You have already guessed that number.';
  }
  // did not win and did not repeat guess, add to list
  this.pastGuesses.push(this.playersGuess);
  // populate guess list
  index = this.pastGuesses.length;
  let selector = `ul li:nth-child(${index})`;
  $(selector).text(this.playersGuess);

  if (this.pastGuesses.length === 5) {
    timeToReset();
    return 'You Lose.';
  }
  if (this.difference() < 10) {
    hintHiOrLo(this);
    return "You're burning up!";
  }
  if (this.difference() < 25) {
    hintHiOrLo(this);
    return "You're lukewarm.";
  }
  if (this.difference() < 50) {
    hintHiOrLo(this);
    return "You're a bit chilly.";
  }
  if (this.difference() < 100) {
    hintHiOrLo(this);
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

// untested code (not in specs)

function timeToReset() {
  $('#submit,#hint').prop('disabled');
  $('#subtitle').text('Click Reset to play again!');
}

function hintHiOrLo(game) {
  if (game.isLower()) {
    $('#subtitle').text('Guess higher next time');
  } else {
    $('#subtitle').text('Guess lower next time');
  }
  $('#player-input').focus();
}

function handleSubmit(game) {
  // + makes the guess a number instead of text
  // another option parseInt(guess, 10)
  var guess = +$('#player-input').val();
  console.log(guess);

  $('#player-input').val('');
  $('#player-input').focus();
  var response = game.playersGuessSubmission(guess);
  $('#title').text(response);

  console.log(response);
}

function handleReset() {
  $('#title').text('Can you guess the secret number?');
  $('#subtitle').text('Enter a number between 1 and 100!');
  $('.guess').text('-');

  $('#submit,#hint').removeProp('disabled');

  $('#player-input').focus();
  return newGame();
}

function handleHint(game) {
  $('#title').text(`The winning number is one of: ${game.provideHint()}`);
}

$(document).ready(function() {
  console.log('ready');

  var game = newGame();

  $('#submit').click(function() {
    handleSubmit(game)
  });

  $('#player-input').keyup(function(ev) {
    // ev.which preferred over ev.keyCode
    // To determine which key was pressed, examine the event object that is
    // passed to the handler function. While browsers use differing properties
    // to store this information, jQuery normalizes the .which property so you
    // can reliably use it to retrieve the key code.
    // http://api.jquery.com/keyup/
    if (ev.which === 13) {
      handleSubmit(game)
    }
  });

  $('#reset').click(function() {
    game = handleReset();
  });

  $('#hint').click(function() {
    handleHint(game);
  });
});
