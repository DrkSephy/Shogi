from flask import Flask 
import helpers

app = Flask(__name__)

@app.route("/game")
def game():
	board = helpers.generateBoard(0, 4)
	helpers.generatePieces(board)
	helpers.printBoard(board)
	return "Hello World!"

####################
# HELPER CONSTANTS #
####################

# Pieces can move one tile in these directions
N, S, W, E, NW, NE, SW, SE = 1, 1, 1, 1, 1, 1, 1, 1

pieces = {
    'C' : (N),
    'H' : (N, S, W, E, NW, NE),
	'E' : (NW, NE, SW, SE),
	'G' : (N, S, W, E),
	'L' : (N, S, W, E, NW, NE, SW, SE)
}

if __name__ == "__main__":
	app.run(debug=True)