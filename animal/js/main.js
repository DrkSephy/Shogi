$(document).ready(function() {

	// Internal state of board
	var _board = [];

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

	var selectedPosition = {row: 0, col: 0};
	var attackPosition = {row: 0, col: 0};
	var selectedCell = false;
	var attackedCell = false;

	
	// Check the contents of a clicked cell
	$('.square').click(function() {
		// We are selecting a piece to attack with
		if(!selectedCell) {
			// Get x, y data
			var x = $(this).data('x');
			var y = $(this).data('y');
			// Check if the cell is occupied and return the contents
			var occupied = isOccupied(x, y);
			if(occupied) {
				selectedCell = true;
				selectedPosition.row = x;
				selectedPosition.col = y;
			}
		}

		// Now to attack
		else if(selectedCell) {
			console.log("Waiting to attack");
			var x = $(this).data('x');
			var y = $(this).data('y');
			var occupied = isOccupied(x, y);
			if(occupied) {
				var name = _board[x][y];
				attackPosition.row = x;
				attackPosition.col = y;
				var $cell = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
				console.log($cell.removeClass(name));
			}
		}
	})

	// Mouse hover effect
	$('div.square').mouseenter(function () {
    $(this).fadeTo('slow', 0.25);
    $(this).css('cursor', 'pointer');
  });

	// Mouse hover effect
  $('div.square').mouseleave(function () {
    $(this).fadeTo('slow', 1);
    $(this).css('cursor', 'default');
  });

});