const gameboard = ( function () {
    const board = []
    for (let j=0 ; j<9 ; j++){
        board.push("")
    }

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    
    const resetBoard = () => {
        for (let j=0 ; j<9 ; j++){
            board[j] = ""
        }
    }

    const isFull = () => {
        return board.indexOf("") === -1;
    }

    const setMark = (position, mark) => {
        board[position] = mark
    }

    const getPosition = (position) => {
        return board[position];
    }
    
    const getWinningConditions = () =>{
        return winningConditions
    }

    const getAllPositions = () => {
        return board.slice()
    }

    resetBoard()

    return {resetBoard, isFull, setMark, getPosition, getWinningConditions, getAllPositions}
})();

const playerFactory = (function() {

    const createPlayer = (newName,newMark) => {

        let name = newName;
        let mark = newMark;
        let score = 0;

        const setName = (newname) => {
            name = newname;
        }

        const getName = () => {
            return name
        }

        const setMark = (newmark) => {
            mark = newmark;
        }

        const getMark = () => {
            return mark
        }

        const getScore = () => {
            return score
        }

        const win = () => {
            score++
        }

        return {getName, setName, getMark, setMark, getScore, win}
    }

    return {createPlayer}

})();

const gameDirector = (function() {
    let players = [];
    let board;
    let turns = 0;
    let gameState = {
        "validGame": false,
        "validTurn": true,
        "currentPlayer": null,
        "gameEnded": false,
        "gameVictory": false
    }

    const isValidGame = () => {
        return gameState.validGame
    }
    const getCurrentPlayer = () => {
        if (gameState.currentPlayer){
            const getName = gameState.currentPlayer.getName
            const getMark = gameState.currentPlayer.getMark
            return {getName,getMark}
        }else{
            return null;
        }
    }
    const isValidTurn = () => {
        return gameState.validTurn
    }
    const isGameEnded = () => {
        return gameState.gameEnded
    }
    const isGameVictory = () => {
        return gameState.gameVictory
    }

    const addPlayer = (player) => {
        player.indexes = [];
        players.push(player);
    }

    const setBoard = (gameBoard) => {
        board = gameBoard;
    }

    const startGame = () => {
        gameState = {
            "validGame": false,
            "validTurn": true,
            "currentPlayer": players[0],
            "gameEnded": false,
            "gameVictory": false
        }
        if (players.length !== 2) {
            console.log("there should be 2 players");
            return gameState
        }
        gameState.validGame = true
        board.resetBoard();
        turns = 0;
        return {isValidGame, getCurrentPlayer, isValidTurn, isGameEnded, isGameVictory};
    }

    const nextTurn = () => {
        console.log(board.getAllPositions());
        turns++;
        gameState.currentPlayer = players[turns%2]
        if (turns%2 === 0){
            console.log("player 1 turn")
        }else{
            console.log("player 2 turn")
        }
    }

    const validPosition = (position) => {
        return ((board.getPosition(position) === "") && (position >= 0 && position <9))
    }

    const checker = (arr, target) => target.every(v => arr.includes(v));

    const checkWinState = () => {
        let win = false
        board.getWinningConditions().forEach(winCon => {
            if (checker(gameState.currentPlayer.indexes,winCon)){
                win = true;
            }
        });
        return win;
    }

    const processTurn = (position) => {
        if (!validPosition(position)) {
            gameState.validTurn = false;
            return;
        }else{
            gameState.validTurn = true;
        }
        gameState.currentPlayer.indexes.push(position);
        board.setMark(position,gameState.currentPlayer.getMark());
        if (checkWinState()){
            gameState.gameEnded = true
            gameState.gameVictory = true
            return
        }else if (board.isFull()){
            gameState.gameEnded = true
            gameState.gameVictory = false
            return
        }
        nextTurn();
    }

    const getTurns = () => {
        return turns
    }

    return {addPlayer, setBoard, startGame, processTurn, getTurns}
})();


//let pl1 = playerFactory.createPlayer(prompt("insert name player 1"), "X");
//let pl2 = playerFactory.createPlayer(prompt("insert name player 2"), "O");

let pl1 = playerFactory.createPlayer("player 1", "X");
let pl2 = playerFactory.createPlayer("player 2", "X");

gameDirector.setBoard(gameboard)
gameDirector.addPlayer(pl1)
gameDirector.addPlayer(pl2)
function game(){
    gameState=gameDirector.startGame()
    console.log("game start")
    let position;
    do {
        do{
            position = parseInt(prompt("enter position (0-8)"))
            gameDirector.processTurn(position)
            if (!gameState.isValidTurn()){
                console.log("invalid position")
            }
        }while(!gameState.isValidTurn())
    }while(!gameState.isGameEnded())

    if (gameState.isGameVictory()){
        console.log(`congrats, player ${gameState.getCurrentPlayer().getName()}`);
    }else {
        console.log("it's a draw")
    }
}