$(document).ready(function() {

	// Internal state of board
	var _board = [];

	// Attach row, column values to dom elements
	// TODO: Initialize _board to contain board positions
	$('.row').each(function(rowIndex, row){
		_board.push([]);
		$(this).find('.cell').each(function(cellIndex, cell) {
			$(cell).attr({'data-x': rowIndex, 'data-y': cellIndex});
			console.log($(cell));
		});
	});

	// NOTE: Grid attributes will be used for handling movement of pieces

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
	
	var selectedPosition = {row: 0, col: 0};
	var attackPosition = {row: 0, col: 0};
	var selectedPiece = false; 

	$('.square').click(function() {
		console.log('Row: ' + $(this).data('row') + ' , ' + 'Col: ' + $(this).data('col'));
		selectedPosition.row = $(this).data('row');
		selectedPosition.col = $(this).data('col');
		console.log(selectedPosition);
		console.log($(this).children()[0].className);
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