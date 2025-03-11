document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("sudoku-grid");
  const timerElement = document.getElementById("timer");
  let timerInterval;

  // Timer setup
  function startTimer() {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    timerInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }

      const formattedTime = 
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
      timerElement.textContent = formattedTime;
    }, 1000); // Update every second
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = "00:00:00"; // Reset timer display
  }

  // Dropdown button functionality
  document.querySelector('.dropdown-button').addEventListener('click', function() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });

  // Generate a Sudoku puzzle with difficulty
  function generateSudoku(difficulty) {
    let solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    let cellsToRemove;
    if (difficulty === "easy") {
      cellsToRemove = 20;
    } else if (difficulty === "medium") {
      cellsToRemove = 40;
    } else if (difficulty === "hard") {
      cellsToRemove = 60;
    }

    let puzzle = JSON.parse(JSON.stringify(solution));
    while (cellsToRemove > 0) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        cellsToRemove--;
      }
    }

    return puzzle;
  }

  let selectedDifficulty = "medium";
  let initialPuzzle = generateSudoku(selectedDifficulty);
  let currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));

  function renderPuzzle(puzzle) {
    grid.innerHTML = "";
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (puzzle[row][col] !== 0) {
          cell.textContent = puzzle[row][col];
          cell.classList.add("fixed");
        } else {
          const input = document.createElement("input");
          input.type = "text";
          input.maxLength = 1;
          input.addEventListener("input", function () {
            if (/^[1-9]$/.test(this.value)) {
              currentPuzzle[row][col] = parseInt(this.value);
            } else {
              this.value = "";
            }
          });
          cell.appendChild(input);
        }
        grid.appendChild(cell);
      }
    }
  }

  document.getElementById("new-game").addEventListener("click", () => {
    resetTimer(); // Reset timer on new game
    startTimer(); // Start timer
    initialPuzzle = generateSudoku(selectedDifficulty);
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
  });

  document.getElementById("reset").addEventListener("click", () => {
    resetTimer(); // Reset timer
    startTimer(); // Restart timer
    currentPuzzle = JSON.parse(JSON.stringify(initialPuzzle));
    renderPuzzle(currentPuzzle);
  });

  document.getElementById("check-solution").addEventListener("click", () => {
    clearInterval(timerInterval); // Stop timer when checking solution
    if (isValidSudoku(currentPuzzle)) {
      alert("Congratulations! The solution is correct!");
    } else {
      alert("The solution is incorrect. Keep trying!");
      startTimer(); // Resume timer if incorrect
    }
  });

  function isValidSudoku(board) {
    function isUnique(array) {
      let nums = array.filter(num => num !== 0);
      return nums.length === new Set(nums).size;
    }

    for (let row = 0; row < 9; row++) {
      if (!isUnique(board[row])) return false;
    }

    for (let col = 0; col < 9; col++) {
      let column = board.map(row => row[col]);
      if (!isUnique(column)) return false;
    }

    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        let grid = [];
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            grid.push(board[i + x][j + y]);
          }
        }
        if (!isUnique(grid)) return false;
      }
    }

    return true;
  }

  // Start the initial timer
  startTimer();

  // Initial render of the puzzle
  renderPuzzle(currentPuzzle);
});
