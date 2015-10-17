$(document).ready(function() {

	// Generate rows/column numbers
	generateBoard(0, 0);

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
	
	$('.square').click(function() {
		console.log('Row: ' + $(this).data('row') + ' , ' + 'Col: ' + $(this).data('col'));
	})
});