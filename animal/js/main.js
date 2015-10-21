$(document).ready(function() {
	"use strict";
	// Internal state of board
	var _board = [];

	// Internal Game state variables
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
	// Whose turn is it?
	var playerTurn = true;
	var enemyTurn = false;
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

	printBoard();

	/**
	 * Prints state of the board.
	 * @return {undefined}
	*/
	function printBoard() {
		for(var i = 0; i < 4; i++) {
			console.log(_board[i]);
		}
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
		$('#debug').append(message);
		return;
	}

	/**
	 * Determines if the game is over.
	 * @return {boolean} Is the game over?
	*/
	function isGameOver() {
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
		console.log('Enemy Lion has been captured: ' + enemyLionCaptured);
		console.log('Player Lion has been captured: ' + playerLionCaptured);
		if(playerLionCaptured) {
			console.log('Enemy has won :/')
		} else if (enemyLionCaptured) {
			console.log('Player has defeated the enemy!!!!');
		} else {
			console.log('Game is still ongoing');
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

		// Check if this piece performed a legal move
		for(var i = 0; i < _pieces[attacker].length; i++) {
			if(_pieces[attacker][i].row == differencePosition.row && 
				 _pieces[attacker][i].col == differencePosition.col) {
				console.log('Valid move for: ' + attacker);
				return true;
			} 
		}

		console.log('Invalid move for: ' + attacker);
		// Made an invalid move, reset our selections
		selectedCell = false;
		attackedCell = false;
		return false;	
	}

	// TODO: Refactor all of this code

	$('.square').click(function() {
		if(!selectedCell) {
			var x = $(this).data('x');
			var y = $(this).data('y');
			if(isOccupied(x, y)) {
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
				// console.log('Difference in row is: ' + differencePosition.row + ' , ' + 'Difference in Col is: ' + differencePosition.col);
				if(validMove(attackerName)) {
					var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
					var $p = ($('.square[data-x=' + selectedPosition.row + '][data-y=' + selectedPosition.col + ']')).children();
					$p.removeClass(attackerName);
					$a.removeClass(attackedName);
					$a.addClass(attackerName);
					// Update new internal board positions
					_board[x][y] = _board[selectedPosition.row][selectedPosition.col];
					_board[selectedPosition.row][selectedPosition.col] = -1;
					selectedCell = false;
					attackedCell = false;
					// Check if the game is over 
					isGameOver();
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
					// Update new internal board positions
					_board[x][y] = _board[selectedPosition.row][selectedPosition.col];
					_board[selectedPosition.row][selectedPosition.col] = -1;
					selectedCell = false;
					attackedCell = false;
				}
			}
		}
	})
});
