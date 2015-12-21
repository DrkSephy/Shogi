$(document).ready(function() {

	"use strict";

	/**************************
	*  	 INTERNAL VARIABLES   *
	**************************/

	// Internal state of board
	var _board = [];
	// Internal state of player bench
	var _playerBench = [];
	// Internal state of enemy bench
	var _enemyBench = [];

	/**************************
	*  	 POSITION VARIABLES   *
	**************************/
	
	// The position of the selected piece
	var selectedPosition = { row: 0, col: 0 };

	// The position of the attacked cell
	var attackPosition = { row: 0, col: 0 };

	// Difference between selected and attack cells
	var differencePosition = { row: 0, col: 0 };

	/**************************
	*  	 PIECE VALIDATION     *
	**************************/

	// Did we select a cell that is occupied?
	var selectedCell = false;

	// Did we select a cell to attack?
	var attackedCell = false;

	// Did we select a bench piece? 
	var selectedEnemyBenchPiece = false;
	var selectedPlayerBenchPiece = false;
	var selectedPlayerBenchPiecePosition = { col: 0 };
	var selectedEnemyBenchPiecePosition = { col: 0 }; 

	/********************************
	*  	 GAME EVALUATION VARIABLES  *
	*********************************/

	var playerLionCaptured = false;
	var enemyLionCaptured = false;
	var seenPlayerLion = false;
	var seenEnemyLion = false;
	var gameOver = false;

	/**************************
	*  	   TURN VARIABLES     *
	**************************/

	var playerTurn = true;
	var enemyTurn = false;
	var turnCount = 1;

	// Has either player moved?
	var playerMoved = false;
	var enemyMoved = false;

	var currentTurn = null; 

	/**************************
	*	 PROMOTION VARIABLES  *
	**************************/
	
	var playerChickPromotion = false;
	var playerChickPosition = { row: 0, col: 0 };
	var enemyChickPromotion = false;
	var enemyChickPosition = { row: 0, col: 0 };

	// Player moved a chick, not placed
	// 	- legitimate candidate for promotion
	var movedPlayerChick = false;

	// Enemy moved a chick, not placed
	// 	- legitimate candidate for promotion
	var movedEnemyChick = false;

	/**************************
	*  	  LEGITIMATE MOVES    *
	**************************/
	
	var _pieces = {
		'enemyChick' : [
			{	row: 1, col: 0 }  // South
		],
		'enemyLion' : [
			{ row: 1,  col: 0  }, // South
			{ row: -1, col: 0  }, // North
			{ row: 0,  col: -1 }, // East
			{ row: 0,  col: 1  }, // West
			{ row: 1,  col: -1 }, // Southwest
			{ row: -1, col: -1 }, // Northwest
			{ row: 1,  col: 1  }, // Southeast
			{ row: -1, col: 1  }, // Northeast
		],
		'enemyElephant' : [
			{ row: 1,  col: -1 }, // Southwest
			{ row: -1, col: -1 }, // Northwest
			{ row: 1,  col: 1  }, // Southeast
			{ row: -1, col: 1  }, // Northeast
		],
		'enemyGiraffe' : [
			{ row: 1,  col: 0  }, // South
			{ row: -1, col: 0  }, // North
			{ row: 0,  col: -1 }, // West
			{ row: 0,  col: 1  }, // East
		],
		'enemyHen' : [
			{ row: 1,  col: 0  }, // South
			{ row: -1, col: 0  }, // North
			{ row: 0,  col: -1 }, // West
			{ row: 0,  col: 1  }, // East
			{ row: 1,  col: -1 }, // Southwest
			{ row: 1,  col: 1  }, // Southeast
		],
		'playerChick' : [
			{	row: -1, col: 0 }   // North
		],
		'playerLion' : [
			{ row: -1, col: 0  }, // North
			{ row: 1,  col: 0  }, // South
			{ row: 0,  col: -1 }, // West
			{ row: 0,  col: 1  }, // East
			{ row: -1, col: -1 }, // Northwest
			{ row: 1,  col: -1 }, // Southwest
			{ row: -1, col: 1  }, // Northeast
			{ row: 1,  col: 1  }, // Southeast
		],
		'playerElephant' : [
			{ row: -1, col: -1 }, // Northwest
			{ row: 1,  col: -1 }, // Southwest
			{ row: 1,  col: 1  }, // Southeast
			{ row: -1, col: 1  }, // Northeast
		],
		'playerGiraffe' : [
			{ row: -1, col: 0  }, // North
			{ row: 1,  col: 0  }, // South
			{ row: 0,  col: -1 }, // West
			{ row: 0,  col: 1  }, // East
		],
		'playerHen' : [
			{ row: -1, col: 0 }, // North
			{ row: 1,  col: 0 }, // South
			{ row: 0,  col: -1}, // West
			{ row: 0,  col: 1 }, // East
			{ row: -1, col: -1}, // Northwest
			{ row: -1, col: 1 }, // Northeast 
		],
	}

	/*************************************
	*  	 INTERNAL BOARD INITIALIZATION   *
	*************************************/
	
	$('.row').each(function(rowIndex, row){
		_board.push([]);
		$(this).find('.square').each(function(cellIndex, square) {
			var cell = $(square).children()[0];
			
			if($(cell).hasClass('enemyGiraffe')) {
				_board[rowIndex][cellIndex] = 'enemyGiraffe';
			} else if ($(cell).hasClass('enemyLion')) {
				_board[rowIndex][cellIndex] = 'enemyLion';
			} else if ($(cell).hasClass('enemyElephant')) {
				_board[rowIndex][cellIndex] = 'enemyElephant'; 
			} else if ($(cell).hasClass('enemyChick')) {
				_board[rowIndex][cellIndex] = 'enemyChick';
			} else if ($(cell).hasClass('playerChick')) {
				_board[rowIndex][cellIndex] = 'playerChick';
			} else if ($(cell).hasClass('playerElephant')) {
				_board[rowIndex][cellIndex] = 'playerElephant';
			} else if ($(cell).hasClass('playerLion')) {
				_board[rowIndex][cellIndex] = 'playerLion';
			} else if ($(cell).hasClass('playerGiraffe')) {
				_board[rowIndex][cellIndex] = 'playerGiraffe';
			} else {
				_board[rowIndex][cellIndex] = -1;
			}
	
			$(square).attr({'data-x': rowIndex, 'data-y': cellIndex});
		});
	});

	// Initialize Enemy Bench Internal Board
	$('.enemyRow').each(function(rowIndex, row) {
		$(this).find('.square').each(function(cellIndex, square) {
			_enemyBench[rowIndex] = -1;
			$(square).attr({'data-x': rowIndex});
		});
	});

	// Initialize Player Bench Internal Board
	$('.playerRow').each(function(rowIndex, row) {
		$(this).find('.square').each(function(cellIndex, square) {
			_playerBench[rowIndex] = -1;
			$(square).attr({'data-x': rowIndex});
		});
	});

	// Set the first debug message
	debugPanel('=================TURN ' + turnCount + '=================');
	debugPanel('\n\n')
	debugPanel('	Player move for turn: ' + turnCount);

	/**************************
	*  	   HELPER METHODS     *
	**************************/

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive).
	 * @returns {number}
	*/
	function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	/**
	 * Prints state of the board.
	 * @returns {undefined}
	*/
	function printBoard(board) {
		for(var i = 0; i < 4; i++) {
			console.log(board[i]);
		}
		return;
	}

	/**
	 * Prints state of the enemy bench.
	 * @returns {undefined}
	*/
	function printEnemyBench() {
		console.log('Enemy bench: ' + _enemyBench);
		return;
	}

	/**
	 * Prints state of the player bench.
	 * @returns {undefined}
	*/
	function printPlayerBench() {
		console.log('Player bench: ' + _playerBench);
		return;
	}

	/** 
	 * Returns cell contents.
	 * @param {number} row The row to search.
	 * @param {number} col The column to search.
	 * @returns {number, string} The value at [row][column]
	*/
	function getCellContents(row, col) {
		return _board[row][col];
	}

	/**
	 * Appends text to the debug panel.
	 * @param {string} message The message to add to debug panel.
	 * @return {undefined}
	*/
	function debugPanel(message) {
		$('#debug').append(message);
		$('#debug').scrollTop($('#debug')[0].scrollHeight);
		return;
	}

	/**
	 * Determines location of a piece.
	 * @param {string} piece The name of the piece to locate. 
	 * @return {object} position The Row/Col position of piece.
	*/
	function getPosition(piece) {
		var position = {'row': 0, 'col': 0};
		for(var row = 0; row < 4; row++) {
			for(var col = 0; col < 3; col++) {
				if(_board[row][col] === piece) {
					position.row = row;
					position.col = col;
				}
			}
		}
		return position; 
	}

	/**************************
	*  	    GAME METHODS      *
	**************************/	

	/**
	 * Switches the active turn player.
	 * @returns {undefined}
	*/
	function toggleTurn() {
		if(playerTurn) {
			playerTurn = false;
			playerMoved = true;
			enemyTurn = true;
			currentTurn = 'enemy';
			// Call a function to make the enemy move
			// makeRandomMove();
			makeAllPossibleMoves();
		} else if (enemyTurn) {
			enemyTurn = false;
			enemyMoved = true;
			playerTurn = true;
			currentTurn = 'player';
		}

		return;
	}

	/**
	 * Returns all possible board configurations after each move.  
	 * @returns {list} All possible board configurations.
	*/
	function makeAllPossibleMoves() {
		var boards = [];
		var moves = getValidMoves(_board, currentTurn);
		
		// Make enough copies of the board for all possible moves
		for(var copy = 0; copy < moves.length; copy++) {
			// Deep copy our internal board
			var copiedBoard = $.extend(true, {}, _board);
			boards.push(copiedBoard);
		}

		$.each(moves, function(index) {
			var board = boards[index];
			var fromRowPos = moves[index]['from']['row'];
			var fromColPos = moves[index]['from']['col'];
			var toRowPos   = moves[index]['to']['row'];
			var toColPos   = moves[index]['to']['col'];
			var pieceName  = moves[index]['piece'];
			
			// Clear contents of cell 
			board[fromRowPos][fromColPos] = -1;
			// Move piece
			board[toRowPos][toColPos] = pieceName;
		});

		$.each(boards, function(index) {
			printBoard(boards[index]);
		});

		return boards;
	}

	

	/**
	 * AI player will make a random move.
	 *
	*/
	function makeRandomMove() {
		var moves = getValidMoves(_board, currentTurn);
		var choice = getRandomInt(0, moves.length - 1);
		var piece = moves[choice];
		
		if(piece['type'] === 'movement') {
			// Select the piece
			$('.row > .square[data-x=' + piece['from']['row'] + '][data-y=' + piece['from']['col'] + ']').click();
			
			setTimeout(function(){
				// Move the piece!
				$('.row > .square[data-x=' + piece['to']['row'] + '][data-y=' + piece['to']['col'] + ']').click();
			},1000);
		} 

		if(piece['type'] === 'placement') {
			// Select the piece
			$('.enemyRow > .square[data-x=' + piece['from']['row'] + ']').click();

			setTimeout(function(){
				// Move the piece!
				$('.row > .square[data-x=' + piece['to']['row'] + '][data-y=' + piece['to']['col'] + ']').click();
			},1000);
		}
	}

	// Returns a list of all valid moves for the turn
	function getValidMoves(board, player) {
		// Computes all valid moves for a turn player
		var validMoves = [];
	
		for(var row = 0; row < 4; row++) {
			for(var col = 0; col < 3; col++) {
				if(board[row][col] == player + 'Chick') {
					var chickRowPosition = row;
					var chickColPosition = col;
					for(var length = 0; length < _pieces[player + 'Chick'].length; length++) {
						var newChickRowPosition = chickRowPosition + _pieces[player + 'Chick'][length].row;
						var newChickColPosition = chickColPosition + _pieces[player + 'Chick'][length].col;

						if(newChickRowPosition >= 0 && newChickRowPosition < 4 && 
							 newChickColPosition >= 0 && newChickColPosition < 3 && 
							 board[newChickRowPosition][newChickColPosition] == -1) {
							validMoves.push({'type': 'movement', piece: player + 'Chick', 'from': {row: chickRowPosition, col: chickColPosition},  'to': {row: newChickRowPosition, col: newChickColPosition}});
						}

						if(newChickRowPosition >= 0 && newChickRowPosition < 4 && 
							 newChickColPosition >= 0 && newChickColPosition < 3 && 
							 board[newChickRowPosition][newChickColPosition] !== -1) {
							 if(player === 'enemy' && (board[newChickRowPosition][newChickColPosition]).indexOf('player') > -1) {
							 	validMoves.push({'type': 'movement', piece: player + 'Chick', 'from': {row: chickRowPosition, col: chickColPosition}, 'to': {row: newChickRowPosition, col: newChickColPosition}});
							 } else if(player === 'player' && (board[newChickRowPosition][newChickColPosition]).indexOf('enemy') > -1) {
							 	validMoves.push({'type': 'movement', piece: player + 'Chick', 'from': {row: chickRowPosition, col: chickColPosition}, 'to': {row: newChickRowPosition, col: newChickColPosition}});
							 } 
						} 
					}
				}

				if(board[row][col] == player + 'Lion') {
					var lionRowPosition = row;
					var lionColPosition = col;
					for(var length = 0; length < _pieces[player + 'Lion'].length; length++) {
						var newLionRowPosition = lionRowPosition + _pieces[player + 'Lion'][length].row;
						var newLionColPosition = lionColPosition + _pieces[player + 'Lion'][length].col;
						
						if(newLionRowPosition >= 0 && newLionRowPosition < 4 && 
							 newLionColPosition >= 0 && newLionColPosition < 3 && 
							 board[newLionRowPosition][newLionColPosition] == -1) {
							validMoves.push({'type': 'movement', piece: player + 'Lion', 'from': {row: lionRowPosition, col: lionColPosition}, 'to': {row: newLionRowPosition, col: newLionColPosition}});
						}

						if(newLionRowPosition >= 0 && newLionRowPosition < 4 && 
							 newLionColPosition >= 0 && newLionColPosition < 3 && 
							 board[newLionRowPosition][newLionColPosition] !== -1) {
							 if(player === 'enemy' && (board[newLionRowPosition][newLionColPosition]).indexOf('player') > -1) {
							 	validMoves.push({'type': 'movement', piece: player + 'Lion', 'from': {row: lionRowPosition, col: lionColPosition}, 'to': {row: newLionRowPosition, col: newLionColPosition}});
							 } else if(player === 'player' && (board[newLionRowPosition][newLionColPosition]).indexOf('enemy') > -1) {
							 	validMoves.push({'type': 'movement', piece: player + 'Lion', 'from': {row: lionRowPosition, col: lionColPosition}, 'to': {row: newLionRowPosition, col: newLionColPosition}});
							 } 
						}
					}
				}

				if(board[row][col] == player + 'Elephant') {	
					var elephantRowPosition = row;
					var elephantColPosition = col;
					for(var length = 0; length < _pieces[player + 'Elephant'].length; length++) {
						var newElephantRowPosition = elephantRowPosition + _pieces[player + 'Elephant'][length].row;
						var newElephantColPosition = elephantColPosition + _pieces[player + 'Elephant'][length].col;
						if(newElephantRowPosition >= 0 && newElephantRowPosition < 4 && 
							 newElephantColPosition >= 0 && newElephantColPosition < 3 && 
							 board[newElephantRowPosition][newElephantColPosition] == -1) {
							validMoves.push({'type': 'movement', piece: player + 'Elephant', 'from': {row: elephantRowPosition, col: elephantColPosition}, 'to': {row: newElephantRowPosition, col: newElephantColPosition}});
						}

						if(newElephantRowPosition >= 0 && newElephantRowPosition < 4 && 
							 newElephantColPosition >= 0 && newElephantColPosition < 3 && 
							 board[newElephantRowPosition][newElephantColPosition] !== -1) {
							 if(player === 'enemy' && (board[newElephantRowPosition][newElephantColPosition]).indexOf('player') > -1) {
							 	 validMoves.push({'type': 'movement', piece: player + 'Elephant', 'from': {row: elephantRowPosition, col: elephantColPosition}, 'to': {row: newElephantRowPosition, col: newElephantColPosition}});
							 } else if(player === 'player' && (board[newElephantRowPosition][newElephantColPosition]).indexOf('enemy') > -1) {
							 	 validMoves.push({'type': 'movement', piece: player + 'Elephant', 'from': {row: elephantRowPosition, col: elephantColPosition}, 'to': {row: newElephantRowPosition, col: newElephantColPosition}});
							 } 
						}
					}
				}

				if(board[row][col] == player + 'Giraffe') {
					var giraffeRowPosition = row;
					var giraffeColPosition = col;
					for(var length = 0; length < _pieces[player + 'Giraffe'].length; length++) {
						var newGiraffeRowPosition = giraffeRowPosition + _pieces[player + 'Giraffe'][length].row;
						var newGiraffeColPosition = giraffeColPosition + _pieces[player + 'Giraffe'][length].col;
						if(newGiraffeRowPosition >= 0 && newGiraffeRowPosition < 4 && 
							 newGiraffeColPosition >= 0 && newGiraffeColPosition < 3 && 
							 board[newGiraffeRowPosition][newGiraffeColPosition] == -1) {
							validMoves.push({'type': 'movement', piece: player + 'Giraffe', 'from': {row: giraffeRowPosition, col: giraffeColPosition}, 'to': {row: newGiraffeRowPosition, col: newGiraffeColPosition}});
						}

						if(newGiraffeRowPosition >= 0 && newGiraffeRowPosition < 4 && 
							 newGiraffeColPosition >= 0 && newGiraffeColPosition < 3 && 
							 board[newGiraffeRowPosition][newGiraffeColPosition] !== -1) {
							 if(player === 'enemy' && (board[newGiraffeRowPosition][newGiraffeColPosition]).indexOf('player') > -1) {
							 	 validMoves.push({'type': 'movement', piece: player + 'Giraffe', 'from': {row: giraffeRowPosition, col: giraffeColPosition}, 'to': {row: newGiraffeRowPosition, col: newGiraffeColPosition}});
							 } else if(player === 'player' && (board[newGiraffeRowPosition][newGiraffeColPosition]).indexOf('enemy') > -1) {
							 	 validMoves.push({'type': 'movement', piece: player + 'Giraffe', 'from': {row: giraffeRowPosition, col: giraffeColPosition}, 'to': {row: newGiraffeRowPosition, col: newGiraffeColPosition}});
							 } 
						}
					}
				}

				if(board[row][col] == player + 'Hen') {
					var henRowPosition = row;
					var henColPosition = col;
					for(var length = 0; length < _pieces[player + 'Hen'].length; length++) {
						var newHenRowPosition = henRowPosition + _pieces[player + 'Hen'][length].row;
						var newHenColPosition = henColPosition + _pieces[player + 'Hen'][length].col;
						if(newHenRowPosition >= 0 && newHenRowPosition < 4 && 
							 newHenColPosition >= 0 && newHenColPosition < 3 && 
							 board[newHenRowPosition][newHenColPosition] == -1) {
							validMoves.push({'type': 'movement', piece: player + 'Hen', 'from': {row: henRowPosition, col: henColPosition}, 'to': {row: newHenRowPosition, col: newHenColPosition}});
						}

						if(newHenRowPosition >= 0 && newHenRowPosition < 4 && 
							 newHenColPosition >= 0 && newHenColPosition < 3 && 
							 board[newHenRowPosition][newHenColPosition] !== -1) {
							 if(player === 'enemy' && (board[newHenRowPosition][newHenColPosition]).indexOf('player') > -1) {
							 	 validMoves.push({'type': 'movement', piece: player + 'Hen', 'from': {row: henRowPosition, col: henColPosition}, 'to': {row: newHenRowPosition, col: newHenColPosition}});
							 } else if(player === 'player' && (board[newHenRowPosition][newHenColPosition]).indexOf('enemy') > -1) {
							 	 validMoves.push({'type': 'movement', piece: player + 'Hen', 'from': {row: henRowPosition, col: henColPosition}, 'to': {row: newHenRowPosition, col: newHenColPosition}});
							 } 
						}
					}
				}
			}
		}
	
		if(player === 'player') {
			// Loop over all pieces on respective player's bench
			for(var piece = 0; piece < _playerBench.length; piece++) {
				// If there is a piece on the bench
				if(_playerBench[piece] !== -1) {
					// Each empty spot on our game board is a valid placement spot
					for(var row = 0; row < 4; row++) {
						for(var col = 0; col < 3; col++) {
							// If the spot is empty, we can place the piece there
							if(_board[row][col] == -1) {
								validMoves.push({'type': 'placement', piece: _playerBench[piece], 'from': {row: piece}, 'to': {row: row, col: col}});
							}
						}
					}
				}
			}
		}

		if(player === 'enemy') {
			// Loop over all pieces on respective player's bench
			for(var piece = 0; piece < _enemyBench.length; piece++) {
				// If there is a piece on the bench
				if(_enemyBench[piece] !== -1) {
					// Each empty spot on our game board is a valid placement spot
					for(var row = 0; row < 4; row++) {
						for(var col = 0; col < 3; col++) {
							// If the spot is empty, we can place the piece there
							if(_board[row][col] == -1) {
								validMoves.push({'type': 'placement', piece: _enemyBench[piece], 'from': {row: piece}, 'to': {row: row, col: col}});
							}
						}
					}
				}
			}
		}
		
		return validMoves;
	}

	/**
	 * Increments turn counter and resets move states.
	 * @returns {undefined}
	*/
	function incrementTurn() {
		if(playerMoved && enemyMoved) {
			turnCount++;
			playerMoved = false;
			enemyMoved = false;
			debugPanel('\n\n');
			debugPanel('		        =================TURN ' + turnCount + '=================');
		}

		// Debug
		if(playerTurn) {
			debugPanel('\n\n');
			debugPanel('	Player move for turn: ' + turnCount);
		}

		if(enemyTurn) {
			debugPanel('\n\n');
			debugPanel('	Enemy move for turn: ' + turnCount);
		}
		return;
	}

	/**
	 * Determines if the game is over.
	 * @returns {boolean} Is the game over?
	*/
	function isGameOver() {
		// Check if either lion has reached opposite end
		// Check if player lion reached opposite end
		for(var col = 0; col < 3; col++) {
			if(_board[0][col] === 'playerLion') {
				gameOver = true;
				debugPanel('\n');
				debugPanel('	Player has defeated the enemy!');
				return;
			} 
			if (_board[3][col] === 'enemyLion') {
				gameOver = true;
				debugPanel('\n');
				debugPanel('	Enemy has defeated the player :/');
				return;
			}
		}

		// Check if either lion is captured
		seenPlayerLion = false;
		seenEnemyLion = false;
		for(var row = 0; row < 4; row++) {
			for(var col = 0; col < 3; col++) {
				// If the current entry is not the player lion
				// And we haven't seen it yet
				if(_board[row][col] !== 'playerLion' && !seenPlayerLion) {
					playerLionCaptured = true;
				} else {
					playerLionCaptured = false;
					seenPlayerLion = true;
				}
				if(_board[row][col] !== 'enemyLion' && !seenEnemyLion) {
					enemyLionCaptured = true;
				} else {
					enemyLionCaptured = false;
					seenEnemyLion = true;
				}
			}
		}
		if(playerLionCaptured) {
			debugPanel('\n');
			debugPanel('	Enemy has won :/');
			gameOver = true;
		} else if (enemyLionCaptured) {
			debugPanel('\n');
			debugPanel('	Player has defeated the enemy :)');
			gameOver = true;
		} else {
			gameOver = false;
		}
	}

	/**
	 * Determines if a cell is occupied. 
	 * @param {number} row The row to search.
	 * @param {number} col The column to search.
	 * @returns {boolean} Whether a cell is occupied.
	*/
	function isOccupied(row, col) {
		return _board[row][col] === -1 ? false : true;
	}

	/**
	 * Empties the contents of a cell.
	 * @param {number} row The row component to clear.
	 * @param {number} column The column component to clear.
	 * @returns {undefined}
	*/
	function clearCell(row, col) {
		_board[row][col] = -1;
		return;
	}

	/**
	 * Checks if a move is valid.
	 * @param {string} attacker The piece attempting to move.
	 * @returns {boolean} Whether a move is valid. 
	*/
	function validMove(attacker) {
		// Check if the new bounds are valid
		if(attackPosition.row > 3 || attackPosition.col > 2) {
			return false;
		}

		// It is the player's turn, we cannot:
		// Attack other player pieces
		if(playerTurn) {
			if(_board[attackPosition.row][attackPosition.col] !== -1 && 
				(_board[attackPosition.row][attackPosition.col]).indexOf('player') !== -1) {
				debugPanel('\n');
				debugPanel('	Player attempted to attack one of their own pieces, invalid move!');
				selectedCell = false;
				attackedCell = false;
				return false;
			}
		}

		if(enemyTurn) {
			if(_board[attackPosition.row][attackPosition.col] !== -1 && 
				(_board[attackPosition.row][attackPosition.col]).indexOf('enemy') !== -1) {
				debugPanel('\n');
				debugPanel('	Enemy attempted to attack one of their own pieces, invalid move!');
				selectedCell = false;
				attackedCell = false;
				return false;
			}
		}

		// Check if this piece performed a legal move
		for(var i = 0; i < _pieces[attacker].length; i++) {
			if(_pieces[attacker][i].row == differencePosition.row && 
				 _pieces[attacker][i].col == differencePosition.col) {
				return true;
			} 
		}

		if(playerTurn) {
			debugPanel('\n');
			debugPanel('	Player performed an illegal move for: ' + attacker);
		}

		if(enemyTurn) {
			debugPanel('\n');
			debugPanel('	Enemy performed an illegal move for: ' + attacker);
		}
				
		// Made an invalid move, reset our selections
		selectedCell = false;
		attackedCell = false;
		return false;	
	}

	/**
	 * Determines if we selected a valid piece.
	 * @param {number} x The row to search.
	 * @param {number} y The column to search.
	 * @returns {boolean} If a valid selection occured
	*/
	function validSelection(x, y) {
		// It is the player's turn. We cannot:
		// 	Try to move the opponents pieces!
		if(playerTurn) {
			// Attempting to select an enemy piece...
			if((_board[x][y]).indexOf('enemy') !== -1) {
				debugPanel('\n');
				debugPanel('	Player tried to move an enemy piece: ' + _board[x][y] + ' at position: ' + x + ', ' + y);
				selectedCell = false;
				return false;
			}
		}

		// It is the enemy turn. We cannot:
		// Try to move the Player's pieces!
		if(enemyTurn) {
			// Attempting to select an enemy piece...
			if((_board[x][y]).indexOf('player') !== -1) {
				debugPanel('\n');
				debugPanel('	Enemy tried to move a player piece ' + _board[x][y] + ' at position: ' + x + ', ' + y);
				selectedCell = false;
				return false;
			}
		}

		// Debug 
		if(playerTurn) {
			debugPanel('\n')
			debugPanel('	Player has selected the piece ' + _board[x][y] + ' at position: ' + x + ', ' + y);
		}

		if(enemyTurn) {
			debugPanel('\n')
			debugPanel('	Enemy has selected the piece ' + _board[x][y] + ' at position: ' + x + ', ' + y);
		}
		return true;
	}

	/**
	 * Checks if a chick should be promoted to a hen.
	 * @returns {undefined} 
	*/
	function checkChicks() {
		// Check first row
		for(var col = 0; col < 3; col++) {
			if(_board[0][col] === 'playerChick' && movedPlayerChick) {
				playerChickPromotion = true;
				debugPanel('\n');
				debugPanel('	Player chick gets promoted to a hen!');
				movedPlayerChick = false;
				return;
			}

			if (_board[3][col] === 'enemyChick' && movedEnemyChick) {
				enemyChickPromotion = true;
				debugPanel('\n');
				debugPanel('	Enemy chick gets promoted to a hen!');
				movedEnemyChick = false;
				return;
			}
		}
	}

	/**
	 * Checks if bench is occupied at a position.
	 * @param {number} position The position of bench to check.
	 * @param {string} bench The bench to check.
	 * @returns {boolean} Whether a position is occupied.
	*/
	function isBenchOccupied(bench, position) {
		return bench[position] == -1 ? false : true;
	}

	/**
	 * Adds piece to respective bench. 
	 * @param {string} piece The piece to add to the bench.
	 * @returns {undefined} 
	*/
	function addToBench(piece) {
		if(piece == 'playerChick') {
			var cell = $('#playerChick');
			if($(cell).hasClass('enemyChick')) {
				cell = $('#playerChickTwo');
				cell.addClass('enemyChick');
				_enemyBench[3] = 'enemyChick';
			} else {
				cell.addClass('enemyChick');
			_enemyBench[0] = 'enemyChick';
			}
		} 

		else if(piece == 'playerGiraffe') {
			var cell = $('#playerGiraffe');
			if($(cell).hasClass('enemyGiraffe')) {
				console.log("Duplicate Giraffe, place in extra slot");
				cell = $('#playerGiraffeTwo');
				cell.addClass('enemyGiraffe');
				_enemyBench[4] = 'enemyGiraffe';
			} else {
				cell.addClass('enemyGiraffe');
				_enemyBench[1] = 'enemyGiraffe';
			}
		} 

		else if(piece == 'playerElephant') {
			var cell = $('#playerElephant');
			if($(cell).hasClass('enemyElephant')) {
				cell = $('#playerElephantTwo');
				cell.addClass('enemyElephant');
				_enemyBench[5] = 'enemyElephant';
			} else {
				cell.addClass('enemyElephant');
			_enemyBench[2] = 'enemyElephant';
			}
		} 

		else if(piece == 'playerHen') {
			var cell = $('#playerChick');
			if($(cell).hasClass('enemyChick')) {
				cell = $('#playerChickTwo');
				cell.addClass('enemyChick');
				_enemyBench[3] = 'enemyChick';
			} else {
				cell.addClass('enemyChick');
			_enemyBench[0] = 'enemyChick';
			}
		}  

		// Player bench pieces
		else if(piece == 'enemyChick') {
			var cell = $('#enemyChick');
			if($(cell).hasClass('playerChick')) {
				cell = $('#enemyChickTwo');
				cell.addClass('playerChick');
				_playerBench[3] = 'playerChick';
			} else {
				cell.addClass('playerChick');
			_playerBench[0] = 'playerChick';
			}
		}

		else if(piece == 'enemyGiraffe') {
			var cell = $('#enemyGiraffe');
			if($(cell).hasClass('playerGiraffe')) {
				cell = $('#enemyGiraffeTwo');
				cell.addClass('playerGiraffe');
				_playerBench[4] = 'playerGiraffe';
			} else {
				cell.addClass('playerGiraffe');
			_playerBench[1] = 'playerGiraffe';
			}
		}  

		else if(piece == 'enemyElephant') {
			var cell = $('#enemyElephant');
			if($(cell).hasClass('playerElephant')) {
				cell = $('#enemyElephantTwo');
				cell.addClass('playerElephant');
				_playerBench[5] = 'playerElephant';
			} else {
				cell.addClass('playerElephant');
			_playerBench[2] = 'playerElephant';
			}
		} 

		else if(piece == 'enemyHen') {
			var cell = $('#enemyChick');
			if($(cell).hasClass('playerChick')) {
				cell = $('#enemyChickTwo');
				cell.addClass('playerChick');
				_playerBench[3] = 'playerChick';
			} else {
				cell.addClass('playerChick');
			_playerBench[0] = 'playerChick';
			}
		}

		else {
			return;
		}
	}

	function clearCells() {
		/**
		 * Resets border properties of all cells.
		 * @return {undefined}
		*/
		$('.row').each(function() {
			$(this).find('.square').each(function() {
				$(this).css('border', '2px dashed gray');
			});
		})

		$('.playerRow').each(function() {
			$(this).find('.square').each(function() {
				$(this).css('border', '2px dashed gray');
			});
		})

		$('.enemyRow').each(function() {
			$(this).find('.square').each(function() {
				$(this).css('border', '2px dashed gray');
			});
		});
		return;
	}

	/**
	 * Removes a piece from a bench.
	 * @param {number} position The column of the piece in the internal bench.
	 * @param {string} piece The name of the piece to remove from the internal bench.
	 * @param {string} player The respective bench to remove a piece from
	 * @return {undefined}
	*/ 
	function removeFromBench(position, piece, player) {
		if(player == 'enemy') {
			var $benchCell = ($('.enemyRow > .square[data-x=' + position + ']')).children();
			$benchCell.removeClass(piece);
		} else if (player == 'player') {
			var $benchCell = ($('.playerRow > .square[data-x=' + position + ']')).children();
			$benchCell.removeClass(piece);
		}
		return;
	}

	/*********************
	*      AI METHODS    *
	*********************/

	/**
	 * Possible heuristics:
	 * 	- How many tiles away from the lion
	 * 		- Deduct one point for each enemy piece in the way
	 * 		- Manhattan Distance
	 *  - How many pieces are being threatened after a move
	 * 		- Attacking enemy lion would normally be good
	*/
	function minimax(board, player) {
		// Function for determining best positions 
		// Computer player will move first (max player)
		return; 
	}

	function evaluation() {
		// Function for determining which player has won, and assign the score
	}


	/*********************
	*    EVENT HANDLERS  *
	*********************/
	
	// Detect clicks on enemy bench
	$('.enemyRow > .square').click(function() {
		// If we had a piece selected and then clicked the bench,
		// We cancel the previous selection
		selectedEnemyBenchPiece = false;
		selectedCell = false;
		// We select a piece from our bench
		if(!selectedEnemyBenchPiece && enemyTurn) {
			// Grab position of bench
			var x = $(this).data('x');
			selectedEnemyBenchPiecePosition.col = x;
			debugPanel("\n");
			debugPanel("	Enemy is trying to place the bench piece: " + _enemyBench[selectedEnemyBenchPiecePosition.col]);
			// If the bench has a piece
			if(isBenchOccupied(_enemyBench, x)) {
				selectedEnemyBenchPiece = true; 
			}
		} 
	});

	// Detect clicks on player bench
	$('.playerRow > .square').click(function() {
		$(this).css('border-color', 'red');
		$(this).css('border-style', 'solid');
		selectedPlayerBenchPiece = false;
		var selectedCell = false;
		if(!selectedPlayerBenchPiece && playerTurn) {
			var x = $(this).data('x');
			selectedPlayerBenchPiecePosition.col = x;
			debugPanel("\n");
			debugPanel("	Player is trying to place the bench piece: " + _playerBench[selectedPlayerBenchPiecePosition.col]);
			if(isBenchOccupied(_playerBench, x)) {
				selectedPlayerBenchPiece = true;
			}
		}
	});

	// TODO: Refactor all of this code
	$('.row > .square').click(function() {
		$(this).css('border-color', 'red');
		$(this).css('border-style', 'solid');
		// We selected an enemy bench piece, so we check and place it
		if(selectedEnemyBenchPiece && !gameOver) {
			var x = $(this).data('x');
			var y = $(this).data('y');
			if(!isOccupied(x, y)) {
				// Cell is not occupied, we can place the piece!
				// Get square to place tile down
				var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
				// Add CSS class to selected tile
				$a.addClass(_enemyBench[selectedEnemyBenchPiecePosition.col]);
				// We are placing a chick from our bench, so it cannot promote unless moved
				if(selectedEnemyBenchPiecePosition.col == 'enemyChick') {
					movedEnemyChick = false;
				}
				debugPanel("\n");
				debugPanel("	Enemy has placed the bench piece: " + _enemyBench[selectedEnemyBenchPiecePosition.col] + " successfully!");
				// Update internal game board state with name of placed piece
				_board[x][y] = _enemyBench[selectedEnemyBenchPiecePosition.col];
				removeFromBench(selectedEnemyBenchPiecePosition.col, _enemyBench[selectedEnemyBenchPiecePosition.col], 'enemy');
				// Clear bench position
				_enemyBench[selectedEnemyBenchPiecePosition.col] = -1;
				selectedEnemyBenchPiecePosition.col = 0;
				selectedEnemyBenchPiece = false;
				// After placing a piece, we end this player's turn
				toggleTurn();
				// Reset grid styles
				clearCells();
				// Increment the turn
				incrementTurn();
			} 

			// We tried to place the piece on an occupied cell, reset
			else {
				debugPanel("\n");
				debugPanel("	Enemy tried to place the piece: " + _enemyBench[selectedEnemyBenchPiecePosition.col] + " in an occupied cell");
				selectedEnemyBenchPiece = false;
				// Reset grid styles
				clearCells();
			}
		} 

		// We selected a player bench piece, check and place it
		else if(selectedPlayerBenchPiece && !gameOver) {
			var x = $(this).data('x');
			var y = $(this).data('y');
			$(this).css('border-color', 'red');
			$(this).css('border-style', 'solid');
			if(!isOccupied(x, y)) {
				// Cell is not occupied, we can place the piece!
				// Get square to place tile down
				var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
				// Add CSS class to selected tile
				$a.addClass(_playerBench[selectedPlayerBenchPiecePosition.col]);
				// We are placing a chick from our bench, so it cannot promote unless moved
				if(_playerBench[selectedPlayerBenchPiecePosition.col] == 'playerChick') {
					movedPlayerChick = false;
				} 
				debugPanel("\n");
				debugPanel("	Player has placed the bench piece: " + _playerBench[selectedPlayerBenchPiecePosition.col] + " successfully!");
				// Update internal game board state with name of placed piece
				_board[x][y] = _playerBench[selectedPlayerBenchPiecePosition.col];
				removeFromBench(selectedPlayerBenchPiecePosition.col, _playerBench[selectedPlayerBenchPiecePosition.col], 'player');
				// Clear bench position
				_playerBench[selectedEnemyBenchPiecePosition.col] = -1;
				selectedPlayerBenchPiecePosition.col = 0;
				selectedPlayerBenchPiece = false;
				// After placing a piece, we end this player's turn
				toggleTurn();
				// Reset grid styles
				clearCells();
				// Increment the turn
				incrementTurn();
			}

			// We tried to put our bench piece on an occupied cell
			else {
				debugPanel("\n");
				debugPanel("	Player tried to place the piece: " + _playerBench[selectedPlayerBenchPiecePosition.col] + " in an occupied space");
				selectedPlayerBenchPiece = false;
			}
		}

		// We are selecting a game piece
		else if(!selectedCell && !gameOver) {
			var x = $(this).data('x');
			var y = $(this).data('y');
			if(isOccupied(x, y) && validSelection(x, y)) {
				// We've selected a piece to move
				selectedCell = true;
				// Update the position of our selected piece
				selectedPosition.row = x;
				selectedPosition.col = y;
			}
		}

		// Now to attack
		else if(selectedCell) {
			// Grab the x, y coordinates of the attacked square
			var x = $(this).data('x');
			var y = $(this).data('y');
			// If the square is occupied, we attack!
			if(isOccupied(x, y)) {
				var attackedName = _board[x][y];
				var attackerName = _board[selectedPosition.row][selectedPosition.col];
				attackPosition.row = x, attackPosition.col = y;
				differencePosition.row = attackPosition.row - selectedPosition.row;
				differencePosition.col = attackPosition.col - selectedPosition.col;
				if(validMove(attackerName)) {
					// Add attacked piece to respective bench
					addToBench(attackedName);

					// If we moved a chick, it is valid for promotion
					if(attackerName == 'playerChick') {
						movedPlayerChick = true;
						playerChickPosition.row = x;
						playerChickPosition.col = y;
					} else {
						movedPlayerChick = false;
					}

					if (attackerName == 'enemyChick') {
						movedEnemyChick = true;
						enemyChickPosition.row = x;
						enemyChickPosition.col = y;
					} else {
						movedEnemyChick = false;
					}

					var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
					var $p = ($('.square[data-x=' + selectedPosition.row + '][data-y=' + selectedPosition.col + ']')).children();
					$p.removeClass(attackerName);
					$a.removeClass(attackedName);
					$a.addClass(attackerName);
					if(playerTurn) {
						debugPanel('\n');
						debugPanel('	The player attacked the piece: ' + _board[attackPosition.row][attackPosition.col] + ' at position: ' + attackPosition.row + ', ' + attackPosition.col);
					}

					if(enemyTurn) {
						debugPanel('\n');
						debugPanel('	The enemy attacked the piece: ' + _board[attackPosition.row][attackPosition.col] + ' at position: ' + attackPosition.row + ', ' + attackPosition.col);
					}
					// Update respective bench
					// _benchPiece(attackedName);
					// Update new internal board positions
					_board[x][y] = _board[selectedPosition.row][selectedPosition.col];
					_board[selectedPosition.row][selectedPosition.col] = -1;
					// Reset selected cells
					selectedCell = false;
					attackedCell = false;
					// Reset grid styles
					clearCells();
					// Check if the game is over 
					isGameOver();
					if(!gameOver) {
						// Check if a chick should be promoted
						checkChicks();
						if(enemyChickPromotion) {
							var $enemyChick = ($('.square[data-x=' + enemyChickPosition.row + '][data-y=' + enemyChickPosition.col + ']')).children();
							$enemyChick.removeClass('enemyChick');
							$enemyChick.addClass('enemyHen');
							// Reset position of enemy chick
							enemyChickPosition.row = 0;
							enemyChickPosition.col = 0;
							// Reset promotion flag
							enemyChickPromotion = false;
							_board[x][y] = 'enemyHen';
						} else if (playerChickPromotion) {
							var $playerChick = ($('.square[data-x=' + playerChickPosition.row + '][data-y=' + playerChickPosition.col + ']')).children();
							$playerChick.removeClass('playerChick');
							$playerChick.addClass('playerHen');
							// Reset position of enemy chick
							playerChickPosition.row = 0;
							playerChickPosition.col = 0;
							// Reset promotion flag
							playerChickPromotion = false;
							_board[x][y] = 'playerHen';
						}
						// Toggle the turn
						toggleTurn();
						// Increment turn
						incrementTurn();
					}
				} 
			} else {
				// Square selected is not occupied, we simply move our piece
				attackPosition.row = x;
				attackPosition.col = y;
				differencePosition.row = attackPosition.row - selectedPosition.row;
				differencePosition.col = attackPosition.col - selectedPosition.col;
				var attackerName = _board[selectedPosition.row][selectedPosition.col];
				if(validMove(attackerName)) {

					// If we moved a chick, it is valid for promotion
					if(attackerName == 'playerChick') {
						movedPlayerChick = true;
						playerChickPosition.row = x;
						playerChickPosition.col = y;
					} else {
						movedPlayerChick = false;
					}

					if (attackerName == 'enemyChick') {
						movedEnemyChick = true;
						enemyChickPosition.row = x;
						enemyChickPosition.col = y;
					} else {
						movedEnemyChick = false;
					}
					var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
					var $p = ($('.square[data-x=' + selectedPosition.row + '][data-y=' + selectedPosition.col + ']')).children();
					$p.removeClass(attackerName);
					$a.addClass(attackerName);
					if(playerTurn) {
						debugPanel('\n');
						debugPanel('	The player moved the piece: ' + _board[selectedPosition.row][selectedPosition.col] + ' to position: ' + attackPosition.row + ', ' + attackPosition.col);
					}

					if(enemyTurn) {
						debugPanel('\n');
						debugPanel('	The enemy moved the piece: ' + _board[selectedPosition.row][selectedPosition.col] + ' to position: ' + attackPosition.row + ', ' + attackPosition.col);
					}
					// Update new internal board positions
					_board[x][y] = _board[selectedPosition.row][selectedPosition.col];
					_board[selectedPosition.row][selectedPosition.col] = -1;
					selectedCell = false;
					attackedCell = false;
					// Reset grid styles
					clearCells();
					// Check if the game is over 
					isGameOver();
					if(!gameOver) {
						// Check if a chick should be promoted
						checkChicks();
						// Enemy Chick needs to be promoted
						if(enemyChickPromotion) {
							var $enemyChick = ($('.square[data-x=' + enemyChickPosition.row + '][data-y=' + enemyChickPosition.col + ']')).children();
							$enemyChick.removeClass('enemyChick');
							$enemyChick.addClass('enemyHen');
							// Reset position of enemy chick
							enemyChickPosition.row = 0;
							enemyChickPosition.col = 0;
							// Reset promotion flag
							enemyChickPromotion = false;
							_board[x][y] = 'enemyHen';
						} else if (playerChickPromotion) {
							var $playerChick = ($('.square[data-x=' + playerChickPosition.row + '][data-y=' + playerChickPosition.col + ']')).children();
							$playerChick.removeClass('playerChick');
							$playerChick.addClass('playerHen');
							// Reset position of enemy chick
							playerChickPosition.row = 0;
							playerChickPosition.col = 0;
							// Reset promotion flag
							playerChickPromotion = false;
							_board[x][y] = 'playerHen';
						}
						// Toggle the turn
						toggleTurn();
						// Increment turn
						incrementTurn();
					}
				}
			}
		}
	});

	// Programmatic click!
	// $('.row > .square[data-x=' + 2 + '][data-y=' + 1 + ']').click();
});