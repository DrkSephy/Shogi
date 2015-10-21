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
		'enemyGiraffe' : [
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
		* @param {number} row The starting row value.
		* @param {number} col The starting column value.
		* @param {number} newRow The new row value.
		* @param {number} newCol The new column value.
		* @returns {boolean} Whether a move is valid. 
	*/
	function validMove(row, col, newRow, newCol) {
		/*
		 * This method will need to:
		 *	Check if the new bounds are valid
		 *  Check if the piece selected can make the move
		 *  Check if we aren't trying to attack our own piece
		*/

		// Check if the new bounds are valid
		if(newRow > 3 || newCol > 2) {
			return false;
		}
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
				attackPosition.row = x;
				attackPosition.col = y;
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
			} else {
				// Square selected is not occupied, we simply move our piece
				attackPosition.row = x;
				attackPosition.col = y;
				var attackerName = _board[selectedPosition.row][selectedPosition.col];
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

	})
});