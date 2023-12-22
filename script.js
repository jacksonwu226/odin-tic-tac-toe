function Player(n, t){
    const name = n;
    const token = t;
    const getName = () => name;
    const getToken = () => token;
    return {getName, getToken};
}
function Cell(){
    let value = null;
    const addToken = (player) => {
        value = player;
    }
    const clearCell = () =>{
        value = null;
    }
    const isEmpty = () => !value;
    const getValue = () => value;
    return {addToken, isEmpty, getValue, clearCell};
}
function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }
    const clearBoard = () => {
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                board[i][j].clearCell();
            }
        }
    }
    const getBoard = () => board;
    const addToken = (row,col, player) => {
        if(!isValidCell(row,col)){
            return;
        }
        else{
            board[row][col].addToken(player);
        }
    };
    const printBoard = () =>{
        const boardWithCellValues = board.map((row) => row.map((cell) =>{
            return cell.isEmpty() ?  ' ' : cell.getValue().getToken();
        }))
        console.log(boardWithCellValues)
    }
    const isValidCell = (row,col) =>{
        return 0<=row && row < rows && 0 <= col && col < columns && board[row][col].isEmpty();
    }
    return {getBoard, addToken, printBoard, isValidCell, clearBoard};
}

const GUIController = (gameController) => {
    const init = () => {
        cacheDom();
        bindEvents();
        this.gameState = gameController.isGameOver();
        setRoundDescription();
    };
    const cacheDom = () => {
        this.round_description = document.getElementById("round-description");
        this.tic_tac_toe_field = document.querySelectorAll(".tic-tac-toe-field");
        this.restart_btn = document.querySelector("#restart-btn");
    };
    const bindEvents = () => {
        this.restart_btn.addEventListener('click', restartGame);
        this.tic_tac_toe_field.forEach((field,index) => {
            field.addEventListener('click', () => handleFieldClick(field,index))
        });
    };
    const restartGame = () => {
        gameController.restartGame();
        gameState = null;
        clearBoard();
        setRoundDescription();
    }
    const clearBoard = () => {
        this.tic_tac_toe_field.forEach((field) => {
            field.textContent = "";
        })
    };
    const handleFieldClick = (field, index) => {
        if(!gameState){
            const row = Math.floor(index/3);
            const col = index % 3;
            field.textContent= gameController.getActivePlayer().getToken();
            gameController.playRound(row,col);
            setRoundDescription();
            gameState = gameController.isGameOver();
            if(gameState){
                setGameEndDescription();
            }
        }
    };
    const setRoundDescription = () => {
        this.round_description.textContent = `${gameController.getActivePlayer().getName()}'s turn`;
    }
    const setGameEndDescription = () => {
        this.round_description.textContent = gameState.Result;
    } 
    init();
    return {init, restartGame}
};

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2"){
    const players = [
        Player(playerOneName, 'X'), 
        Player(playerTwoName, 'O')
    ];
    const board = Gameboard();
    let activePlayer = players[0];
    const switchPlayerTurn = () =>{
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
    };
    const getActivePlayer = () => activePlayer;
    const printRound = () => {
        board.printBoard()
        console.log(`${getActivePlayer().getName()}'s turn.`);
    };
    const playRound = (row,col) =>{
        if(!board.isValidCell(row,col)){
            console.log(`(${row}, ${col}) is not a valid selection!`);
        }
        else{
            board.addToken(row,col, activePlayer);
            const gameState = isGameOver();
            if(gameState){
                console.log(gameState)
            }
            else{
                switchPlayerTurn();
            }
        }
        printRound();
    }
    const restartGame = () => {
        activePlayer = players[0];
        board.clearBoard();
    }
    const isWinner = (player, boardState) => {
        for(let i = 0; i < 3; i++){
            if(boardState[i].every(cell => cell.getValue() === player) || 
            boardState.every(row => row[i].getValue() === player))
            {
                return true;
            }
        }
        if(
            boardState.every((row, i) => row[i].getValue() === player) ||
            boardState.every((row,i) => row[2-i].getValue() === player)
        ){
            return true;
        }
        return false;
    }
    const isBoardFull = (boardState) => {
        return boardState.every(row => row.every(cell => !cell.isEmpty()));
    }
    const isGameOver = () => {
        const player = getActivePlayer();
        const boardState = board.getBoard();
        if(isWinner(player,boardState)){
            return {Winner: player, Result: `${player.getName()} WON!`}
        }
        else if(isBoardFull(boardState)){
            return {Winner: null, Result: `It's a draw`}
        }
        else{
            return null;
        }
    }
    return {getActivePlayer, printRound, playRound, isGameOver, restartGame};
}

const gameController = GameController();
const guiController = GUIController(gameController);
