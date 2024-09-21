// Constants
const BOARD_SIZE = 10;
const SHIP_TYPES = [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Cruiser', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Destroyer', size: 2 }
];

// Game state
let playerBoard = [];
let computerBoard = [];
let playerShips = [];
let computerShips = [];
let gameOver = false;

// Initialize the game
function initGame() {
    playerBoard = createEmptyBoard();
    computerBoard = createEmptyBoard();
    playerShips = [];
    computerShips = [];
    gameOver = false;

    placeShipsRandomly(playerBoard, playerShips);
    placeShipsRandomly(computerBoard, computerShips);

    renderBoards();
    addEventListeners();
}

// Create an empty board
function createEmptyBoard() {
    return Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
}

// Place ships randomly on the board
function placeShipsRandomly(board, ships) {
    SHIP_TYPES.forEach(shipType => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);
            const isVertical = Math.random() < 0.5;

            if (canPlaceShip(board, row, col, shipType.size, isVertical)) {
                placeShip(board, row, col, shipType.size, isVertical);
                ships.push({ name: shipType.name, hits: 0, size: shipType.size });
                placed = true;
            }
        }
    });
}

// Check if a ship can be placed at the given position
function canPlaceShip(board, row, col, size, isVertical) {
    for (let i = 0; i < size; i++) {
        if (isVertical) {
            if (row + i >= BOARD_SIZE || board[row + i][col] !== 0) return false;
        } else {
            if (col + i >= BOARD_SIZE || board[row][col + i] !== 0) return false;
        }
    }
    return true;
}

// Place a ship on the board
function placeShip(board, row, col, size, isVertical) {
    for (let i = 0; i < size; i++) {
        if (isVertical) {
            board[row + i][col] = 1;
        } else {
            board[row][col + i] = 1;
        }
    }
}

// Render the game boards
function renderBoards() {
    renderBoard('player-board', playerBoard, true);
    renderBoard('computer-board', computerBoard, false);
}

// Render a single board
function renderBoard(boardId, board, isPlayer) {
    const boardElement = document.getElementById(boardId);
    boardElement.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('w-8', 'h-8', 'border', 'border-gray-400');

            if (isPlayer && board[row][col] === 1) {
                cell.classList.add('bg-gray-500');
            } else if (board[row][col] === 2) {
                cell.classList.add('bg-red-500');
            } else if (board[row][col] === 3) {
                cell.classList.add('bg-blue-500');
            }

            if (!isPlayer && !gameOver) {
                cell.addEventListener('click', () => handlePlayerMove(row, col));
            }

            boardElement.appendChild(cell);
        }
    }
}

// Handle player's move
function handlePlayerMove(row, col) {
    if (gameOver || computerBoard[row][col] > 1) return;

    if (computerBoard[row][col] === 1) {
        computerBoard[row][col] = 2;
        const hitShip = computerShips.find(ship => ship.hits < ship.size);
        if (hitShip) {
            hitShip.hits++;
            if (hitShip.hits === hitShip.size) {
                alert(`You sunk the computer's ${hitShip.name}!`);
            }
        }
    } else {
        computerBoard[row][col] = 3;
    }

    renderBoards();
    checkGameOver();

    if (!gameOver) {
        setTimeout(computerMove, 500);
    }
}

// Computer's move
function computerMove() {
    if (gameOver) return;

    let row, col;
    do {
        row = Math.floor(Math.random() * BOARD_SIZE);
        col = Math.floor(Math.random() * BOARD_SIZE);
    } while (playerBoard[row][col] > 1);

    if (playerBoard[row][col] === 1) {
        playerBoard[row][col] = 2;
        const hitShip = playerShips.find(ship => ship.hits < ship.size);
        if (hitShip) {
            hitShip.hits++;
            if (hitShip.hits === hitShip.size) {
                alert(`The computer sunk your ${hitShip.name}!`);
            }
        }
    } else {
        playerBoard[row][col] = 3;
    }

    renderBoards();
    checkGameOver();
}

// Check if the game is over
function checkGameOver() {
    const playerLost = playerShips.every(ship => ship.hits === ship.size);
    const computerLost = computerShips.every(ship => ship.hits === ship.size);

    if (playerLost || computerLost) {
        gameOver = true;
        const winner = playerLost ? 'Computer' : 'Player';
        alert(`Game Over! ${winner} wins!`);
    }
}

// Add event listeners
function addEventListeners() {
    document.getElementById('start-game').addEventListener('click', initGame);
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);
