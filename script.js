const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const resetBtn = document.getElementById("reset");
const pvpBtn = document.getElementById("pvp");
const aiBtn = document.getElementById("ai");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawScoreEl = document.getElementById("drawScore");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;

let scores = { X: 0, O: 0, draw: 0 };

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleClick(cell, index));
});

function handleClick(cell, index) {
  if (board[index] || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWin()) return;
  if (board.every(cell => cell)) return seeDraw();

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === "O") {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  let empty = board.map((v,i) => v === "" ? i : null).filter(v => v !== null);
  let move = empty[Math.floor(Math.random() * empty.length)];
  handleClick(cells[move], move);
}

function checkWin() {
  for (let pattern of winPatterns) {
    let [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      statusText.textContent = `Player ${board[a]} wins!`;
      scores[board[a]]++;
      updateScore();
      pattern.forEach(i => cells[i].classList.add("win"));
      return true;
    }
  }
  return false;
}

function seeDraw() {
  gameActive = false;
  statusText.textContent = "It's a draw!";
  scores.draw++;
  updateScore();
}

function updateScore() {
  xScoreEl.textContent = scores.X;
  oScoreEl.textContent = scores.O;
  drawScoreEl.textContent = scores.draw;
}

restartBtn.onclick = () => {
  board.fill("");
  cells.forEach(c => c.textContent = c.classList.remove("win"));
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's turn";
};

resetBtn.onclick = () => {
  scores = { X: 0, O: 0, draw: 0 };
  updateScore();
  restartBtn.click();
};

pvpBtn.onclick = () => {
  vsAI = false;
  pvpBtn.classList.add("active");
  aiBtn.classList.remove("active");
  restartBtn.click();
};

aiBtn.onclick = () => {
  vsAI = true;
  aiBtn.classList.add("active");
  pvpBtn.classList.remove("active");
  restartBtn.click();
};
