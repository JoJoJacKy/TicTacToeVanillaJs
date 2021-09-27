
const playerFactory = (name, icon) => {
    const getIcon = function() { return icon };
    return { getIcon }
}

const player1 = playerFactory("Jimmy", "X");
const player2 = playerFactory("Susy", "O");

// Revealing Module Pattern
const GameBoard = (() => {

    const players = [];
    var currentPlayer;
    var currentPlayerIndex;
    var currentPlaysLeft = 9;

    // CacheDOM
    let board = Array(9).fill(null);
    const boardPieces = document.querySelectorAll(".board-piece");
    const currentTurnText = document.querySelector("#current-turn");
    const title = document.querySelector(".header");
    const warning = document.querySelector("#warning");

    const wholeBoard = document.querySelector(".grid");
    

    renderBoard();

    // Binding Events (Onclick)
    boardPieces.forEach(boardPiece => {
        boardPiece.addEventListener('click', () => {
            // Getting the number of the grid piece that was clicked on
            let boardPieceIndex = parseInt(boardPiece.dataset.num);
            if (checkIfCanPlace(boardPieceIndex, currentPlayer)) {
                currentPlaysLeft--;
                updateBoard(boardPieceIndex, currentPlayer.getIcon());
                renderBoard();
                restartGame();
                if (checkIfCurrentPlayerWon()) {
                    warning.innerHTML = `Player ${currentPlayer.getIcon()} has won! Click restart!`;
                } else if (currentPlaysLeft === 0) { // Check if game is a draw
                    warning.innerHTML = "Draw! Restart the Game!";
                } else {
                    changeCurrentPlayerTurn();
                    updateCurrentPlayerText(currentTurnText);
                } 
            } else {
                // This toggles the animation when wrong
                toggleAnimationViaClass(boardPiece, errorDurationInt, 'wrong');
            }
        });
    });

    // Board Functions
    function updateBoard(index, playerIcon) {
        board[index] = playerIcon;
        warning.innerHTML = ''; // Clearing out the warning
    }

    function renderBoard() {
        for (let i = 0; i < boardPieces.length; i++) {
            boardPieces[i].innerHTML = board[i];
        }
    }

    // Player Functions

    function randomStartingPlayer() {
        currentPlayer = players[Math.floor(Math.random() * 2)];
        currentPlayerIndex = players.indexOf(currentPlayer);
    }

    function changeCurrentPlayerTurn() {
        if (currentPlayerIndex === 0) {
            currentPlayer = players[1];
            currentPlayerIndex = 1;
        } else {
            currentPlayer = players[0];
            currentPlayerIndex = 0;
        }
    }

    function checkIfCanPlace(index, player) {
        if (players.length === 0) {
            return false;
        } else if (board[index] === player.getIcon()) {
            warning.innerHTML = 'Spot already taken!';
            return false;
        } else if (board[index] !== null){
            warning.innerHTML = 'Spot already taken!';
            return false;
        } else {
            return true;
        }
    }

    // Where we add our players to our game
    function addPlayers(player1, player2) {
        players.push(player1);
        players.push(player2);
        randomStartingPlayer();
        updateCurrentPlayerText(currentTurnText);
    }

    function updateCurrentPlayerText(text) {
        text.innerHTML = `It is currently ${currentPlayer.getIcon()}'s turn!`
    }

    // Checking to see who's won or if game is over;
    function checkIfCurrentPlayerWon() {
        // Rows 
        if (board[0] === currentPlayer.getIcon() && board[1] === currentPlayer.getIcon() && board[2] === currentPlayer.getIcon()) {
            return true;
        } else if (board[3] === currentPlayer.getIcon() && board[4] === currentPlayer.getIcon() && board[5] === currentPlayer.getIcon()) {
            return true;
        } else if (board[6] === currentPlayer.getIcon() && board[7] === currentPlayer.getIcon() && board[8] === currentPlayer.getIcon()) {
            return true;
            // Columns
        } else if (board[0] === currentPlayer.getIcon() && board[3] === currentPlayer.getIcon() && board[6] === currentPlayer.getIcon()) {
            return true;
        } else if (board[1] === currentPlayer.getIcon() && board[4] === currentPlayer.getIcon() && board[7] === currentPlayer.getIcon()) {
            return true;
        } else if (board[2] === currentPlayer.getIcon() && board[5] === currentPlayer.getIcon() && board[8] === currentPlayer.getIcon()) {
            return true;
            // Diagonals
        } else if (board[0] === currentPlayer.getIcon() && board[4] === currentPlayer.getIcon() && board[8] === currentPlayer.getIcon()) {
            return true;
        } else if (board[2] === currentPlayer.getIcon() && board[4] === currentPlayer.getIcon() && board[6] === currentPlayer.getIcon()) {
            return true;
        } else {
            return false;
        }
    }

    function restartGame() {
        document.querySelector('#restart').addEventListener('click', () => {
            board = Array(9).fill(null);
            changeCurrentPlayerTurn();
            updateCurrentPlayerText(currentTurnText);
            renderBoard();
            toggleAnimationViaClass(wholeBoard, restartDurationInt, 'restarting');
            warning.innerHTML = '';
            currentPlaysLeft = 9;
        });
    }

    // Error Duration for our .wrong animation
    const errorDuration = getComputedStyle(document.documentElement).getPropertyValue('--errorDuration').slice(0,2);
    const errorDurationInt = parseInt(errorDuration);
    // This toggles the animation when wrong
    function toggleAnimationViaClass(element, duration, className) {
        if (!element.classList.contains(className)) { // Checking if the class exists === Animation is running
            element.classList.toggle(className);
            setTimeout(() => element.classList.toggle(className), duration * 1000);
        } else { // If the class exists, just return and does nothing.
            return;
        }
    }
    const restartDuration = getComputedStyle(document.documentElement).getPropertyValue('--restartDuration').slice(0,4);
    const restartDurationInt = parseFloat(restartDuration);
    console.log(restartDurationInt);

    // title.addEventListener('click', (e) => {
    //     title.classList.toggle('test');
    //     console.log(e);

    //     // These bottom two are effectively the same
    //     // These are objects that have properties and methods we can access
    //     // Like .innerText or .innerHTML
    //     console.log(e.target);
    //     console.log(title);
    // });

    return { addPlayers }
})();

// Adding Players to our Game
GameBoard.addPlayers(player1, player2);

const inputs = document.querySelectorAll('.controls input')
// Changing the color of the tiles
function handleUpdateValues() {
    console.log(this.name);
    // If need a suffix, we grab; This suffix is set as a data-NAME attribute within our element
    const suffix = this.dataset.suffix || '';
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
}

// Here we iterate over all the inputs and set up event listeners that run the function handleUpdateValues
inputs.forEach(input => input.addEventListener('mousemove', handleUpdateValues));
inputs.forEach(input => input.addEventListener('change', handleUpdateValues));