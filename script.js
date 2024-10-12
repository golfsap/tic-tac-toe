function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create 2d array that will represent the state of the game,
    // Row 0 will represent top row and column 0 left-most row

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const playSquare = (row, column, player) => {
        // check if square is empty
        if (!board[row][column].getValue() == 0) {
            console.log('Square occupied!');
            return false; 
        }
        board[row][column].addToken(player);
        return true;
    };

    const checkWinner = (row, col, token) => {
        // const allEqual = (arr) => {arr.every(val => val === arr[0])};

        // Check row
        for (let i = 0; i < columns; i++) {
            if (board[row][i].getValue() !== token) 
                break;
            if (i == columns-1) {
                console.log('Win row!');
                return true;
            }
        }

        // Check each column
        for (let i = 0; i < rows; i++) {
            if (board[i][col].getValue() !== token)
                break;
            if (i == rows-1) {
                console.log('Win column!');
                return true;
            }
        }

        // Check diagonal
        if (row == col) {
            for (let i = 0; i < rows; i++) {
                if (board[i][i].getValue() !== token) 
                    break;
                if (i == rows-1) {
                    return true;
                }
            }
        }
        if ((row + col) == rows - 1) {
            for (let i = 0; i < rows; i++) {
                if (board[i][(rows-1)-i].getValue() !== token) 
                    break;
                if (i == rows-1) {
                    return true;
                }
            }
        }
        return false;
    }

    const isTie = () => {
        // Check if all squares are non-zero
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getValue() == 0) return false;
            }
        }
        return true;
    }

    // This method will be used to print board to the console.
    // Won't need it after we build the UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    // Provide an interface for the rest of our application to 
    // interact with the board
    return { getBoard, playSquare, checkWinner, isTie, printBoard };
}

// A Cell represents one square on the board. 
// 0: empty, 1: player one (X), 2: player two (O)

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        // Add token from the current player
        if (!board.playSquare(row, column, getActivePlayer().token)) {
            console.log('Please choose an empty square');
            printNewRound();
            return;
        }

        console.log(`Adding ${getActivePlayer().name}'s token into [${row}][${column}]`);

        // Check for winner 
        if(board.checkWinner(row, column, getActivePlayer().token)) {
           printWinner();
           return;
        }

        // Check for tie game 
        if (board.isTie()) {
            console.log("It's a tie!");
            board.printBoard();
            return;
        }

        // Switch player turn
        switchPlayerTurn();
        printNewRound();
    };

    const printWinner = () => {
        console.log(`${getActivePlayer().name} has won!`);
        board.printBoard();
    }

    // Initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = '';

        // get newest version of the board and player's turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add('cell');
                // data attribute to identify cell
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = index;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    const bindEvents = () => {
        boardDiv.addEventListener("click", clickHandlerBoard);
        // boardDiv.addEventListener('click', clickTakenSquare);
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if(!selectedRow || ! selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    // function clickTakenSquare(e) {
    //     const board = game.getBoard();
    //     const selectedRow = e.target.dataset.row;
    //     const selectedColumn = e.target.dataset.column;
    //     if (board[selectedRow][selectedColumn].getValue() !== 0) {
    //         alert('Please choose an empty square');
    //     }
    // }

    // Initial render 
    updateScreen();
    bindEvents();
}

ScreenController();

// const game = GameController('Golf', 'Gift');

