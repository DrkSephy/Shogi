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

	function printBoard() {
		for(var i = 0; i < 4; i++) {
			console.log(_board[i]);
		}
	}

	function getBoardContents() {
		$('div.square').each(function(){
			if($(this).children()[0] !== undefined){
				console.log($(this).children()[0].className);	
			}
		});
	}

	function getCellContents(cell) {
		if($(this).children()) {
			return $(this).children()[0].className;
		}
	}

	$('.square').click(function() {
		var x = $(this).data('x');
		var y = $(this).data('y');
		console.log(_board[x][y]);
	})

	
	$('div.square').mouseenter(function () {
    $(this).fadeTo('slow', 0.25);
    $(this).css('cursor', 'pointer');
  });

  $('div.square').mouseleave(function () {
    $(this).fadeTo('slow', 1);
    $(this).css('cursor', 'default');
  });

});