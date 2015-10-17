$(document).ready(function() {
	/* Set up the board */
	var row = 0;
	var col = 0;
	$('.square').each(function() {
		$(this).data('row', row);
		$(this).data('col', col);
		col++;
		if(col > 2) {
			row++;
			col = 0;
		}
	});

	$('.square').click(function() {
		console.log($(this).data('row'));
		console.log($(this).data('col'));
	})
});