$(document).ready(function() {
	"use strict";
	// Internal state of board
	var _board = [];
	// Internal state of player bench
	var _playerBench = [];
	// Internal state of enemy bench
	var _enemyBench = [];

	// The position of the selected piece
	var selectedPosition = { row: 0, col: 0 };
	// The position of the attacked cell
	var attackPosition = { row: 0, col: 0 };
	// Difference between selected and attack cells
	var differencePosition = { row: 0, col: 0 };
	// Did we select a cell that is occupied?
	var selectedCell = false;
	// Did we select a cell to attack?
	var attackedCell = false;
	// Is the game over?
	var playerLionCaptured = false;
	var enemyLionCaptured = false;
	var seenPlayerLion = false;
	var seenEnemyLion = false;
	var gameOver = false;
	// Whose turn is it?
	var playerTurn = true;
	var enemyTurn = false;
	var turnCount = 1;
	// Has either player moved?
	var playerMoved = false;
	var enemyMoved = false;

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
	}

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

	$('.enemyRow').each(function(rowIndex, row) {
		$(this).find('.square').each(function(cellIndex, square) {
			_enemyBench[rowIndex] = -1;
			$(square).attr({'data-x': rowIndex});
		});
	});

	$('.playerRow').each(function(rowIndex, row) {
		$(this).find('.square').each(function(cellIndex, square) {
			_playerBench[rowIndex] = -1;
			$(square).attr({'data-x': rowIndex});
		});
	});

	printBoard();
	// printEnemyBench();
	// printPlayerBench();
	// Set the first debug message
	debugPanel('=================TURN ' + turnCount + '=================');
	debugPanel('\n\n')
	debugPanel('	Player move for turn: ' + turnCount);

	/**
	 * Prints state of the board.
	 * @return {undefined}
	*/
	function printBoard() {
		for(var i = 0; i < 4; i++) {
			console.log(_board[i]);
		}

		return;
	}

	/**
	 * Prints state of the enemy bench.
	 * @return {undefined}
	*/
	function printEnemyBench() {
		console.log('Enemy bench: ' + _enemyBench);
	}

	/**
	 * Prints state of the player bench.
	 * @return {undefined}
	*/
	function printPlayerBench() {
		console.log('Player bench: ' + _playerBench);
	}

	/**
	 * Switches the active turn player.
	 * @returns {undefined}
	*/
	function toggleTurn() {
		if(playerTurn) {
			playerTurn = false;
			playerMoved = true;
			enemyTurn = true;
		} else if (enemyTurn) {
			enemyTurn = false;
			enemyMoved = true;
			playerTurn = true;
		}
		return;
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
	 * Returns cell contents.
	 * @param {number} row The row to search.
	 * @param {number} col The column to search.
	 * @return {number, string} The value at [row][column]
	*/
	function getCellContents(row, col) {
		return _board[row][col];
	}

	/**
	 * Appends text to the debug panel.
	 * @param {string} message The message to add to debug panel.
	 * @returns {undefined}
	*/
	function debugPanel(message) {
		// $('#debug').append(message);
		// $('#debug').scrollTop($('#debug')[0].scrollHeight);

		return;
	}

	/**
	 * Determines if the game is over.
	 * @return {boolean} Is the game over?
	*/
	function isGameOver() {
		// First winning condition: lion captured
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
	 * @return {boolean} Whether a cell is occupied.
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
		// 	Attack other player pieces
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
	 * Updates internal bench states.
	 * @param {string} piece The name of the piece to place.
	 * @returns {undefined}
	*/
	function benchPiece(piece) {
		if(piece == 'playerChick') {
			_enemyBench[0] = piece;
		} else if(piece == 'playerGiraffe') {
			_enemyBench[1] = piece;
		} else if (piece == 'playerElephant') {
			_enemyBench[2] = piece;
		} else if (piece == 'enemyChick') {
			_playerBench[0] = piece;
		} else if (piece == 'enemyGiraffe') {
			_playerBench[1] = piece;
		} else if (piece == 'enemyElephant') {
			_playerBench[2] = piece;
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

	// Detect clicks on enemy bench
	$('.enemyRow > .square').click(function() {
		var x = $(this).data('x');
		console.log(isBenchOccupied(_enemyBench, x));
	});

	// Detect clicks on player bench
	$('.playerRow > .square').click(function() {
		var x = $(this).data('x');
		console.log(isBenchOccupied(_playerBench, x));
	});

	// TODO: Refactor all of this code
	$('.row > .square').click(function() {
		if(!selectedCell && !gameOver) {
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
					var cell = $('#' + attackedName);
					cell.addClass(attackedName);
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
					benchPiece(attackedName);
					// Update new internal board positions
					_board[x][y] = _board[selectedPosition.row][selectedPosition.col];
					_board[selectedPosition.row][selectedPosition.col] = -1;
					// Reset selected cells
					selectedCell = false;
					attackedCell = false;
					// Check if the game is over 
					isGameOver();
					if(!gameOver) {
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
					// Toggle the turn
					toggleTurn();
					incrementTurn();
				}
			}
		}
	})
});