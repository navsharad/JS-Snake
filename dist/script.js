const gameGrid = document.querySelector('.grid');
const squares = document.querySelectorAll('.grid div');
const scoreDisplay = document.querySelector('span');
const startBtn = document.querySelector('.start');
const endGameModal = document.querySelector('.endgame-modal');
const endGameScore = document.querySelector('.endgame-modal h3 span');
const endGameHighScore = document.querySelector('.endgame-modal h2 span');

const width = 10;
let currentIndex = 0; 
let appleIndex = 0;
let currentSnake = [2,1,0];
let direction = 1;
let score = 0;
let intervalTime = 200;
let interval = 0;


  //start and restart the game
  function startGame() {
    //clean up/set up
    endGameModal.classList.add('hidden');
    gameGrid.classList.remove('hidden');
    currentSnake.forEach(index => squares[index].classList.remove('snake'));
    squares[appleIndex].classList.remove('apple');
    clearInterval(interval);
    score = 0;

    randomApple();
    direction = 1;
    scoreDisplay.innerText = score;
    currentSnake = [2,1,0];
    currentIndex = 0;
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    interval = setInterval(moveOutcomes, intervalTime);
  }

 
  function moveOutcomes() {
    // endgame moves
    if (
      (currentSnake[0] + width >= (width * width) && direction === width ) || // snake hits bottom
      (currentSnake[0] % width === width -1 && direction === 1) || // snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || //snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) ||  // snake hits the top
      squares[currentSnake[0] + direction].classList.contains('snake') // snake crashes into itself
    ) {
      gameGrid.classList.add('hidden');
      endGameModal.classList.remove('hidden');
      endGameScore.textContent = score;
      if (localStorage.getItem("highscore") == null || score > localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", score);
      }
      endGameHighScore.textContent = localStorage.getItem("highscore");
      return clearInterval(interval);
    }

    // changing snake position
    const tail = currentSnake.pop();
    squares[tail].classList.remove('snake');
    currentSnake.unshift(currentSnake[0] + direction);

    // when snake eats apple
    if(squares[currentSnake[0]].classList.contains('apple')) {
      squares[currentSnake[0]].classList.remove('apple');
      squares[tail].classList.add('snake');
      currentSnake.push(tail);
      randomApple();
      score++;
      scoreDisplay.textContent = score;
    }
    squares[currentSnake[0]].classList.add('snake');
  }



  //generate new apple
  function randomApple() {
    do{
      appleIndex = Math.floor(Math.random() * squares.length);
    } while(squares[appleIndex].classList.contains('snake'));
    squares[appleIndex].classList.add('apple')
  }


  // moves snake based on keyboard entries
  function moveSnake(e) {
    squares[currentIndex].classList.remove('snake');

    if(e.keyCode === 39) {
      direction = 1;
    } else if (e.keyCode === 38) {
      direction = -width; // if we press the up arrow, the snake will go back ten divs, appearing to go up
    } else if (e.keyCode === 37) {
      direction = -1; // if we press left, the snake will go left one div
    } else if (e.keyCode === 40) {
      direction = +width; //if we press down, the snake head will instantly appear in the div ten divs from where you are now
    }
  }

  startBtn.addEventListener('click', startGame);
  document.addEventListener('keyup', moveSnake);
