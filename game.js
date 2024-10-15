function GameBoard() {
    const squares = 9;
    const board = [];

    const winningConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    // Create 1D array that will represent the state of the game
    for (let i = 0; i < squares; i++) {
        board.push(Cell());
    }

    const getBoard = () => board;

    const clear = () => {
        board.length = 0;
        for (let i = 0; i < squares; i++) {
            board.push(Cell());
        }
    }

    const playSquare = (square, player) => {
        // Check if square is empty
        if(board[square].getValue() !== '') {
            console.log('Square occupied');
            return false;
        }
        board[square].addToken(player);
        return true;
    };

    const checkWinner = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]].getValue();
            let b = board[winCondition[1]].getValue();
            let c = board[winCondition[2]].getValue();

            // console.log(a);
            // console.log(b);
            // console.log(c);
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                return true;
            }
        }
        return false; 
    };

    const isTie = () => {
        // If tie game returns true, else returns false
        if (checkWinner()) {
            return false;
        }
        for (let i = 0; i < squares; i++) {
            if (board[i].getValue() === '') {
                return false;
            }
        }
        return true;
    };

    const printBoard = () => {
        console.log(`${board[0].getValue()} | ${board[1].getValue()} | ${board[2].getValue()}`);
        console.log(`${board[3].getValue()} | ${board[4].getValue()} | ${board[5].getValue()}`);
        console.log(`${board[6].getValue()} | ${board[7].getValue()} | ${board[8].getValue()}`);
    };

    return { getBoard, clear, playSquare, checkWinner, isTie, printBoard };
}

function Cell() {
    let value = '';

    const addToken = (player) => {
        value = player;
    };

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
    const board = GameBoard();

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

    const setPlayerName = (playerOneName, playerTwoName) => {
        players[0].name = playerOneName;
        players[1].name = playerTwoName;
    }

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (square) => {
        if (!board.playSquare(square, getActivePlayer().token)) {
            alert('Please choose an empty square');
            printNewRound();
            return;
        }

        console.log(`Adding ${getActivePlayer().name}'s token into square ${square}`);

        // check for winner
        if (board.checkWinner()) {
            console.log(`${getActivePlayer().name} has won!`)
            board.printBoard();
            return;
        }

        // check for tie game
        if (board.isTie()) {
            console.log("It's a tie!");
            board.printBoard();
            return;
        }

        // Switch player turn
        switchPlayerTurn();
        printNewRound();
    };

    const endGame = () => {
        // Modal with winner msg or tie
        // remove buttons on square
        
        // restart game?
        board.clear();
    }

    // Initial play game msg
    printNewRound();

    return {
        setPlayerName,
        playRound,
        getActivePlayer,
        endGame,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const startGameBtn = document.getElementById('start-game-btn');
    const startGameModal = document.getElementById('start-game-modal');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = '';

        // get newest version of the board and player's turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        // Render button for each square
        for (let i = 0; i < board.length; i++) {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            // data attribute to identify cell
            cellButton.dataset.square = i;
            cellButton.textContent = board[i].getValue();
            boardDiv.appendChild(cellButton);
        }
    };

    const bindEvents = () => {
        boardDiv.addEventListener('click', clickHandlerBoard);
        startGameBtn.addEventListener('click', clickHandlerNewGame);
    }

    function clickHandlerBoard(e) {
        const selectedSquare = e.target.dataset.square;

        if (!selectedSquare) return;

        game.playRound(selectedSquare);
        updateScreen();
    }

    function clickHandlerNewGame(e) {
        e.preventDefault();
        const playerOneName = document.getElementById('player-1-name');
        const playerTwoName = document.getElementById('player-2-name');

        game.setPlayerName(playerOneName, playerTwoName);
        startGameModal.classList.add('hidden');
        updateScreen();
    }

    // Initial render
    updateScreen();
    bindEvents();

}

ScreenController();
// const game = GameController();