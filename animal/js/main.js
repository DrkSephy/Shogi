$(document).ready(function() {

	// Generate rows/column numbers
	generateBoard(0, 0);
	getBoardContents();

	/**
	 * Attaches row/column data to existing DOM elements.
	 * @param {number} row The number of rows to create.
	 * @param {number} col The number of columns to create.
	*/ 
	function generateBoard(row, col) {
		$('.square').each(function() {
			$(this).data('row', row);
			$(this).data('col', col);
			col++;
			if(col > 2) {
				row++;
				col = 0;
			}
		});
	}

	function getBoardContents() {
		$('div.square').each(function(){
			if($(this).children()[0] !== undefined){
				console.log($(this).children()[0].className);	
			}
		});
	}
	
	$('.square').click(function() {
		console.log('Row: ' + $(this).data('row') + ' , ' + 'Col: ' + $(this).data('col'));
		console.log($(this));
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