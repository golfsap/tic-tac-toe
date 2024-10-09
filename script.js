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
        if (!board[row][column] === 0) return; 

        board[row][column].addToken(player);
    };

    const checkWinner = (row, col, token) => {
        // const allEqual = (arr) => {arr.every(val => val === arr[0])};

        // Check row
        console.log('Checking rows...')
        for (let i = 0; i < columns; i++) {
            if (board[row][i] != token) 
                return false;
            if (i == columns-1) {
                console.log('Win row!');
                return true;
            }
        }

        // Check each column
        console.log('Checking columns...')
        for (let i = 0; i < rows; i++) {
            if (board[i][col] != token)
                break;
            if (i == rows-1) {
                console.log('Win column!');
                return true;
            }
        }

        // Check diagonal
        console.log('Checking diagonal...')
        if (row == col) {
            for (let i = 0; i < rows; i++) {
                if (board[i][i] != token) break;
                if (i == rows-1) return true;
            }
        }
        if ((row + col) == row - 1) {
            for (let i = 0; i < rows; i++) {
                if (board[i][(rows-1)-i] != token) break;
                if (i == rows-1) return true;
            }
        }
        return false;
    }

    // This method will be used to print board to the console.
    // Won't need it after we build the UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    // Provide an interface for the rest of our application to 
    // interact with the board
    return { getBoard, playSquare, checkWinner, printBoard };
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
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
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
        console.log(`Adding ${getActivePlayer().name}'s token into [${row}][${column}]`);
        board.playSquare(row, column, getActivePlayer().token);

        // Check for winner and handle logic
        if(board.checkWinner(row, column, getActivePlayer().token)) {
            console.log(`${getActivePlayer().name} has won!`);
            return;
        }

        // Switch player turn
        switchPlayerTurn();
        printNewRound();
    };

    // Initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();

