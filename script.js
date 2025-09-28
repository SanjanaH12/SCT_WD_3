// Game state
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const turnPlayerEl = document.getElementById('turnPlayer');
const modeSelect = document.getElementById('modeSelect');
const difficultySelect = document.getElementById('difficultySelect');
const resetBtn = document.getElementById('resetBtn');

let board = Array(9).fill(null); // cells: null | 'X' | 'O'
let currentPlayer = 'X';
let isGameOver = false;

// Winning combinations
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Create cells
function createBoard(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.setAttribute('role','button');
    cell.setAttribute('aria-label', `Cell ${i+1}`);
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  }
}

// Handle user clicks
function onCellClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(isGameOver || board[idx]) return; // occupied or finished

  makeMove(idx, currentPlayer);

  // If playing against computer and not over, let AI move
  if(!isGameOver && modeSelect.value === 'computer'){
    setTimeout(()=>{
      const aiMark = (currentPlayer === 'X') ? 'O' : 'X';
      const difficulty = difficultySelect.value;
      if(difficulty === 'easy'){
        const empties = board.map((v,i)=>v?null:i).filter(v=>v!==null);
        const randomIdx = empties[Math.floor(Math.random()*empties.length)];
        makeMove(randomIdx, aiMark);
      } else {
        const best = findBestMove(board, aiMark);
        makeMove(best.index, aiMark);
      }
    }, 250);
  }
}

// Place mark and update state
function makeMove(index, mark){
  if(board[index] || isGameOver) return;
  board[index] = mark;
  render();

  const winner = checkWinner(board);
  if(winner){
    isGameOver = true;
    showResult(winner);
    return;
  }
  if(isBoardFull(board)){
    isGameOver = true;
    showResult(null); // draw
    return;
  }

  // swap player
  currentPlayer = (mark === 'X') ? 'O' : 'X';
  turnPlayerEl.textContent = currentPlayer;
}

// Check winner: returns 'X' or 'O' or null
function checkWinner(b){
  for(const line of WIN_LINES){
    const [a,bIdx,c] = line;
    if(b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
  }
  return null;
}

function isBoardFull(b){ return b.every(cell=>cell!==null); }

function showResult(winner){
  const cells = document.querySelectorAll('.cell');
  if(winner){
    statusEl.innerHTML = `Winner: <span class="highlight">${winner}</span>`;
    for(const line of WIN_LINES){
      const [a,bIdx,c] = line;
      if(board[a] && board[a] === board[bIdx] && board[a] === board[c]){
        [a,bIdx,c].forEach(i=>cells[i].classList.add('win'));
        break;
      }
    }
  } else {
    statusEl.textContent = `It's a draw!`;
  }
  cells.forEach(c=>c.classList.add('disabled'));
}

// Render board
function render(){
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, idx)=>{
    cell.textContent = board[idx] || '';
  });
}

// Reset game
function resetGame(){
  board.fill(null);
  currentPlayer = 'X';
  isGameOver = false;
  turnPlayerEl.textContent = currentPlayer;
  statusEl.textContent = `Current turn: `;
  statusEl.appendChild(turnPlayerEl);
  createBoard();
}

// --- Minimax AI for 'hard' difficulty ---
function findBestMove(bState, aiMark){
  const human = (aiMark === 'X') ? 'O' : 'X';

  function score(board){
    const winner = checkWinner(board);
    if(winner === aiMark) return 10;
    if(winner === human) return -10;
    return 0;
  }

  function minimax(boardArr, depth, isMaximizing){
    const winner = checkWinner(boardArr);
    if(winner || isBoardFull(boardArr)) return score(boardArr);

    if(isMaximizing){
      let best = -Infinity;
      for(let i=0;i<9;i++){
        if(!boardArr[i]){
          boardArr[i] = aiMark;
          const val = minimax(boardArr, depth+1, false);
          boardArr[i] = null;
          best = Math.max(best, val);
        }
      }
      return best;
    } else {
      let best = Infinity;
      for(let i=0;i<9;i++){
        if(!boardArr[i]){
          boardArr[i] = human;
          const val = minimax(boardArr, depth+1, true);
          boardArr[i] = null;
          best = Math.min(best, val);
        }
      }
      return best;
    }
  }

  let bestVal = -Infinity;
  let bestIndex = -1;
  for(let i=0;i<9;i++){
    if(!bState[i]){
      bState[i] = aiMark;
      const moveVal = minimax(bState, 0, false);
      bState[i] = null;
      if(moveVal > bestVal){
        bestVal = moveVal;
        bestIndex = i;
      }
    }
  }
  return { index: bestIndex, score: bestVal };
}

// Initialize
createBoard();
resetGame();

// Controls
resetBtn.addEventListener('click', resetGame);
modeSelect.addEventListener('change', resetGame);
difficultySelect.addEventListener('change', ()=>{});
