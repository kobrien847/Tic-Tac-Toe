// get game elements
const pickPlayerX = document.getElementById("pick-x");
const pickPlayerO = document.getElementById("pick-o");
const turnDisplay = document.getElementById("turn-icon-wrapper");
const turnIndicator = document.getElementById("turn-indicator");

// get dialog elements
const dialog = document.getElementById("dialog-box");
const dialogGameOver = document.getElementById("game-over");
const dialogReset = document.getElementById("reset");

// get dialog header span elements
const youLost = document.getElementById("you-lost");
const youWon = document.getElementById("you-won");
const player1Wins = document.getElementById("player1-wins");
const player2Wins = document.getElementById("player2-wins");

// get dialog banner elements
const gameOverWinner = document.getElementById("winner");
const gameOverPath = document.getElementById("game-over-path");
const gameOverPlayerWon = document.getElementById("player-won");
const gameOverTied = document.getElementById("tied");

// get score elements
const scorePlayerXName = document.getElementById("player-x-name");
const scorePlayerXScore = document.getElementById("player-x-score");

const scoreTiesScore = document.getElementById("ties-score");

const scorePlayerOName = document.getElementById("player-o-name");
const scorePlayerOScore = document.getElementById("player-o-score");

const scoreValues = {
	playerXName: "P1",
	playerXScore: 0,
	tiesScore: 0,
	playerOName: "P2",
	playerOScore: 0,
};

// constant values
const xPath =
	"M51.12 1.269c.511 0 1.023.195 1.414.586l9.611 9.611c.391.391.586.903.586 1.415s-.195 1.023-.586 1.414L44.441 32l17.704 17.705c.391.39.586.902.586 1.414 0 .512-.195 1.024-.586 1.415l-9.611 9.611c-.391.391-.903.586-1.415.586a1.994 1.994 0 0 1-1.414-.586L32 44.441 14.295 62.145c-.39.391-.902.586-1.414.586a1.994 1.994 0 0 1-1.415-.586l-9.611-9.611a1.994 1.994 0 0 1-.586-1.415c0-.512.195-1.023.586-1.414L19.559 32 1.855 14.295a1.994 1.994 0 0 1-.586-1.414c0-.512.195-1.024.586-1.415l9.611-9.611c.391-.391.903-.586 1.415-.586s1.023.195 1.414.586L32 19.559 49.705 1.855c.39-.391.902-.586 1.414-.586Z";
const oPath =
	"M33 1c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C15.327 65 1 50.673 1 33 1 15.327 15.327 1 33 1Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z";

// game variables
let board = new Map();
let winningTiles = [];
let scoreLocalStorage = [];
let blankTiles = [];

function pickPlayer(id) {
	if ("pick-x" == id) {
		pickPlayerX.dataset.pick = "true";
		pickPlayerO.dataset.pick = "false";
		document.body.dataset.player1 = "x";
	} else {
		pickPlayerX.dataset.pick = "false";
		pickPlayerO.dataset.pick = "true";
		document.body.dataset.player1 = "o";
	}
}

function pickGame(id) {
	// based on button id the game is either 2p or CPU
	console.log("pickGame: " + id);

	// body.dataset.game = "2player" or "cpu"
	if ("new-game-cpu" === id) {
		document.body.dataset.game = "cpu";
	} else {
		document.body.dataset.game = "2player";
	}
	document.body.dataset.state = "play";
	newGame();
}

function newGame() {
	console.log("NewGame");
	document.body.dataset.turn = "x";
	setTurn();

	// empty list of winning tiles
	winningTiles = [];
	// empty game board
	board.clear();
	// build board
	for (let r = 1; r <= 3; r++) {
		for (let c = 1; c <= 3; c++) {
			board.set(`r${r}c${c}`, "blank");
		}
	}
	// get scores from localStorage
	getScores();
	updateBoard();
}

// Sets the turn at the top of the board based on the current value of body::data-turn
function setTurn() {
	console.log("setTurn: " + document.body.dataset.turn);
	if ("x" == document.body.dataset.turn) {
		// put "x" in turn
		turnIndicator.setAttribute("d", xPath);
	} else {
		// put "o" in turn
		turnIndicator.setAttribute("d", oPath);
	}
}

function getScores() {
	console.log("getScores");
	// read score data from local storage
	scoreLocalStorage = localStorage.getItem("tic-tac-toe")
		? JSON.parse(localStorage.getItem("tic-tac-toe"))
		: {
				player1: 0,
				player2: 0,
				cpu: 0,
				ties: 0,
		  };
}

function setScore() {
	console.log("setScore");
	// write scores to localStorage
	localStorage.setItem("tic-tac-toe", JSON.stringify(scoreLocalStorage));
}

function updateScoreBoard() {
	console.log("updateScoreBoard");
	// update scoreValues
	scoreValues["tiesScore"] = scoreLocalStorage["ties"];
	if ("x" === document.body.dataset.player1) {
		// player 1 is X
		if ("2player" === document.body.dataset.game) {
			scoreValues["playerXName"] = "P1";
			scoreValues["playerXScore"] = scoreLocalStorage["player1"];
			scoreValues["playerOName"] = "P2";
			scoreValues["playerOScore"] = scoreLocalStorage["player2"];
		} else {
			scoreValues["playerXName"] = "YOU";
			scoreValues["playerXScore"] = scoreLocalStorage["player1"];
			scoreValues["playerOName"] = "CPU";
			scoreValues["playerOScore"] = scoreLocalStorage["cpu"];
		}
	} else {
		// player 1 is O
		if ("2player" === document.body.dataset.game) {
			scoreValues["playerXName"] = "P2";
			scoreValues["playerXScore"] = scoreLocalStorage["player2"];
			scoreValues["playerOName"] = "P1";
			scoreValues["playerOScore"] = scoreLocalStorage["player1"];
		} else {
			scoreValues["playerXName"] = "CPU";
			scoreValues["playerXScore"] = scoreLocalStorage["cpu"];
			scoreValues["playerOName"] = "YOU";
			scoreValues["playerOScore"] = scoreLocalStorage["player1"];
		}
	}

	// get score info
	const { playerXName, playerXScore, tiesScore, playerOName, playerOScore } =
		scoreValues;

	// set player x
	scorePlayerXName.innerText = playerXName;
	scorePlayerXScore.innerText = playerXScore;
	// set tie
	scoreTiesScore.innerText = tiesScore;
	// set player o
	scorePlayerOName.innerText = playerOName;
	scorePlayerOScore.innerText = playerOScore;
}

function updateBoard() {
	console.log("updateBoard");
	board.forEach((value, key) => {
		const tile = document.getElementById(key);
		const tilePath = tile.querySelector(".tile-path");
		switch (value) {
			case "blank": {
				tile.className = "gs-blank";
				tilePath.setAttribute("d", "");
				break;
			}
			case "x": {
				tile.className = winningTiles.includes(key) ? "gs-x-win" : "gs-x";
				tilePath.setAttribute("d", xPath);
				break;
			}
			case "o": {
				tile.className = winningTiles.includes(key) ? "gs-o-win" : "gs-o";
				tilePath.setAttribute("d", oPath);
				break;
			}
		}
	});
	updateScoreBoard();
}

function cpuPlay() {
	console.log("CPU Play turn");
	let cpuBoard = new Map();
	let emptyTiles = [];
	let cpuMarker = document.body.dataset.turn;
	let playerMarker = cpuMarker === "x" ? "o" : "x";
	console.log(`cpuMarker ${cpuMarker}  playerMarker ${playerMarker}`);
	// build board model
	for (let r = 1; r <= 3; r++) {
		for (let c = 1; c <= 3; c++) {
			let tileLoc = `r${r}c${c}`;
			let tileValue = board.get(tileLoc);
			if ("blank" === tileValue) emptyTiles.push(tileLoc);
			cpuBoard.set(tileLoc, {
				tile: tileValue,
				total: 0,
				rando: 0,
				defense: 0,
				offense: 0,
			});
		}
	}

	// offense & defense move calc
	console.log("offense / defense");
	for (let r = 1; r <= 3; r++) {
		for (let c = 1; c <= 3; c++) {
			let tileLoc = `r${r}c${c}`;
			let tile = cpuBoard.get(tileLoc);
			if ("blank" !== tile.tile) {
				// skip calc
				tile.defense = 0;
				tile.offense = 0;
				console.log("SKIPPING " + tileLoc);
			} else {
				// calc horizontal and vertical values
				let cpuCount = 0,
					playCount = 0;
				for (let a = 1; a <= 3; a++) {
					console.log(`-${tileLoc} a:  ${a}`);
					let rowTile = cpuBoard.get(`r${a}c${c}`).tile;
					let colTile = cpuBoard.get(`r${r}c${a}`).tile;
					if ("blank" !== rowTile) {
						if (rowTile === cpuMarker) {
							cpuCount++;
							console.log(`RowTile r${a}c${c}: cpu ${cpuCount}`);
						} else {
							playCount++;
							console.log(`RowTile r${a}c${c}: player ${playCount}`);
						}
					}
					if ("blank" !== colTile) {
						if (colTile === cpuMarker) {
							cpuCount++;
							console.log(`ColTile r${r}c${a}: cpu ${cpuCount}`);
						} else {
							playCount++;
							console.log(`ColTile r${r}c${a}: player ${playCount}`);
						}
					}
					if (r === c) {
						let diaTile = cpuBoard.get(`r${a}c${a}`);
						if ("blank" !== diaTile) {
							if (diaTile === cpuMarker) {
								cpuCount++;
								console.log(`DiagTile r${a}c${a}: cpu ${cpuCount}`);
							} else {
								playCount++;
								console.log(`DiagTile r${a}c${a}: player ${playCount}`);
							}
						}
					}
					if (r === 4 - c) {
						let revTile = cpuBoard.get(`r${a}c${4 - a}`);
						if (revTile === cpuMarker) {
							if (revTile === cpuMarker) {
								cpuCount++;
								console.log(`RevDiagTile r${a}c${4 - a}: cpu ${cpuCount}`);
							} else {
								playCount++;
								console.log(`RevDiagTile r${a}c${4 - a}: player ${playCount}`);
							}
						}
					}
				}
				console.log(`Unscaled cpuCount ${cpuCount} playCount ${playCount}`);
				tile.defense = playCount * 5;
				tile.offense = cpuCount * 5 + 1;
				console.log(`tile: ${tileLoc} d: ${tile.defense} o: ${tile.offense}`);
			}
			cpuBoard.set(tileLoc, tile);
		}
	}

	// random move
	for (let i = emptyTiles.length; i > 0; i--) {
		let n = Math.floor(Math.random() * i);
		let pop = emptyTiles[n];
		let tile = cpuBoard.get(pop);
		// console.log(`l: ${emptyTiles.length} n: ${n}; eTile: ${pop}`);
		// console.log(emptyTiles);
		tile.rando = i * 5;
		cpuBoard.set(pop, tile);
		emptyTiles.splice(n, 1);
	}

	// final move
	let maxTotal = 0;
	let maxTile = "";
	cpuBoard.forEach((value, key) => {
		value.total = 0.1 * value.rando + 0.5 * value.defense + 0.4 * value.offense;
		console.log(
			`Key: ${key}; tile: ${value.tile} tot: ${value.total} ran: ${value.rando} d: ${value.defense} o: ${value.offense}`
		);
		if (value.total > maxTotal) {
			maxTotal = value.total;
			maxTile = key;
		}
	});
	console.log(`Best Move: ${maxTile} score: ${maxTotal}`);
	// make the move
	pickTile(maxTile);
}

function pickTile(id) {
	// check if tile is empty
	console.log("pickTile: " + id);
	let tile = board.get(id);
	if (tile === "blank") {
		board.set(id, document.body.dataset.turn);
		endTurn();
	} else {
		console.log(`tile ${id} is not empty`);
	}
}

function hoverTile(id) {
	// check if tile is empty
	let value = board.get(id);
	const tile = document.getElementById(id);
	const tilePath = tile.querySelector(".tile-path");

	if (value === "blank") {
		if ("x" === document.body.dataset.turn) {
			tile.className = "gs-x-hover";
			tilePath.setAttribute("d", xPath);
		} else {
			tile.className = "gs-o-hover";
			tilePath.setAttribute("d", oPath);
		}
	}
}

function hoverExitTile(id) {
	// check if tile is empty
	let value = board.get(id);
	const tile = document.getElementById(id);
	const tilePath = tile.querySelector(".tile-path");

	if (value === "blank") {
		tile.className = "gs-blank";
		tilePath.setAttribute("d", "");
	}
}

function checkWinner() {
	console.log("checkWinner");
	// return none, x, o, tie
	let winner = false;
	let boardFull = true;

	// check rows and columns for a win
	for (let i = 1; i <= 3; i++) {
		let firstRowTile = board.get(`r${i}c1`),
			firstColTile = board.get(`r1c${i}`),
			rowWin = firstRowTile == "blank" ? false : true,
			colWin = firstColTile == "blank" ? false : true;
		if (firstRowTile == "blank") {
			boardFull = false;
			blankTiles.push(`r${i}c1`);
		}
		for (let j = 2; j <= 3; j++) {
			// does the row tile match?
			let curRowTile = board.get(`r${i}c${j}`);
			if (curRowTile != firstRowTile || "blank" == curRowTile) rowWin = false;
			if ("blank" == curRowTile) {
				boardFull = false;
				blankTiles.push(`r${i}c${j}`);
			}
			// does the col tile match?
			let curColTile = board.get(`r${j}c${i}`);
			if (curColTile != firstColTile || "blank" == curColTile) colWin = false;
		}
		if (rowWin) {
			// console.log(`Row Winner: r${i}`);
			winner = true;
			for (let x = 1; x <= 3; x++) {
				winningTiles.push(`r${i}c${x}`);
			}
		}
		if (colWin) {
			// console.log(`Col Winner: c${i}`);
			winner = true;
			for (let x = 1; x <= 3; x++) {
				winningTiles.push(`r${x}c${i}`);
			}
		}
	}
	// check diagonal win
	let firstDiagTile = board.get("r1c1"),
		firstReverseDiagTile = board.get("r1c3"),
		diagWin = firstDiagTile == "blank" ? false : true,
		reverseDiagWin = firstReverseDiagTile == "blank" ? false : true;
	for (let i = 2; i <= 3; i++) {
		// does the diagonal tile match?
		let curDiagTile = board.get(`r${i}c${i}`);
		if (curDiagTile != firstDiagTile || "blank" == curDiagTile) {
			diagWin = false;
		}
		// does the reverse diagonal tile match?
		let curRevDiagTile = board.get(`r${i}c${4 - i}`);
		console.log(`r${i}c${4 - i} : ${curRevDiagTile}`);
		if (curRevDiagTile != firstReverseDiagTile || "blank" == curRevDiagTile) {
			reverseDiagWin = false;
			console.log(`reverseDiagWin: ${reverseDiagWin}`);
		}
	}
	if (diagWin) {
		winner = true;
		for (let i = 1; i <= 3; i++) {
			winningTiles.push(`r${i}c${i}`);
		}
	}
	if (reverseDiagWin) {
		winner = true;
		for (let i = 1; i <= 3; i++) {
			winningTiles.push(`r${i}c${4 - i}`);
		}
	}
	console.log(`CheckWinners Results: ${winner}`);
	if (winner) {
		console.log(`Player ${document.body.dataset.turn} wins!`);
		return document.body.dataset.turn;
	} else {
		if (boardFull) {
			console.log(`board full: tie`);
			return "tied";
		} else {
			console.log(`no winner`);
			return "none";
		}
	}
}

function endTurn() {
	console.log("endTurn");
	// did the current player win?
	let result = checkWinner();
	let game = document.body.dataset.game;
	let player1 = document.body.dataset.player1;
	console.log(`game type: ${game} player1: ${player1}`);
	let winner;
	console.log(`checkWinner: ${result}`);
	switch (result) {
		case "x":
		case "o":
			if ("cpu" == game) {
				if (player1 === result) {
					// you won
					winner = "you";
					scoreLocalStorage["player1"] = scoreLocalStorage["player1"] + 1;
				} else {
					// cpu
					winner = "cpu";
					scoreLocalStorage["cpu"] = scoreLocalStorage["cpu"] + 1;
				}
			} else {
				if (player1 === result) {
					// player1
					winner = "player1";
					scoreLocalStorage["player1"] = scoreLocalStorage["player1"] + 1;
				} else {
					// player2
					winner = "player2";
					scoreLocalStorage["player2"] = scoreLocalStorage["player2"] + 1;
				}
			}
			break;
		case "tied":
			scoreLocalStorage["ties"] = scoreLocalStorage["ties"] + 1;
			winner = result;
			break;
		case "none":
			winner = result;
			break;
	}
	document.body.dataset.winner = winner;
	setScore();
	// update board
	updateBoard();
	// if winner, end game and display dialog
	if ("none" != result) {
		youLost.style.display = "none";
		youWon.style.display = "none";
		player1Wins.style.display = "none";
		player2Wins.style.display = "none";
		switch (document.body.dataset.winner) {
			case "you":
				youWon.style.display = "block";
				break;
			case "cpu":
				youLost.style.display = "block";
				break;
			case "player1":
				player1Wins.style.display = "block";
				break;
			case "player2":
				player2Wins.style.display = "block";
				break;
			case "tied":
				gameOverTied.style.display = "block";
				gameOverPath.setAttribute("d", "");
				gameOverWinner.className = "";
				gameOverPlayerWon.style.display = "none";
				break;
		}
		if ("tied" != document.body.dataset.winner) {
			gameOverPlayerWon.style.display = "block";
			gameOverTied.style.display = "none";
			switch (document.body.dataset.turn) {
				case "x":
					gameOverPath.setAttribute("d", xPath);
					gameOverWinner.className = "gs-x";
					break;
				case "o":
					gameOverPath.setAttribute("d", oPath);
					gameOverWinner.className = "gs-o";
					break;
			}
		}
		// show winner dialog
		endGameDialogShow();
	} else {
		// if no winner, change player turn
		document.body.dataset.turn = "x" === document.body.dataset.turn ? "o" : "x";
		setTurn();
		// if CPU turn call cpuPlay()
		if ("cpu" == game) {
			if (document.body.dataset.player1 != document.body.dataset.turn) {
				console.log("Call CPU Turn");
				cpuPlay();
			}
		}
	}
}

//
// Dialog functions
//
function resetButton() {
	console.log("resetButton");
	document.body.dataset.dialog = "reset";
	// show reset dialog
	dialog.show();
}

function resetDialogClick(id) {
	switch (id) {
		case "reset-no":
			console.log("Cancel");
			break;
		case "reset-yes":
			console.log("Yes");
			newGame();
			break;
	}
	dialog.close();
}

function endGameDialogShow() {
	document.body.dataset.dialog = "endGame";
	dialog.show();
}

function endGameDialogClick(id) {
	switch (id) {
		case "quit":
			// go back to start-menu
			document.body.dataset.state = "pickGame";
			break;
		case "next-round":
			// new game
			newGame();
			break;
	}
	dialog.close();
}

//
// Initialize game on load
//
function initialize() {
	console.log("Loaded");
	document.body.dataset.state = "pickGame";
	document.body.dataset.game = "none";
	document.body.dataset.winner = "none";
	pickPlayer("pick-x");
}

// Initialize game board
// in case the document is already rendered
if (document.readyState != "loading") {
	initialize();
	// modern browsers
} else {
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", initialize());
		// IE <= 8
	} else {
		document.attachEvent("onreadystatechange", function () {
			if (document.readyState == "complete") initialize();
		});
	}
}
