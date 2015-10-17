from flask import Flask 

app = Flask(__name__)

@app.route("/")
def board():
	board = []
	for i in range(0, 4):
		board.append([-1, -1, -1])
	print_board(board)	
	return "Hello World!"

####################
# HELPER CONSTANTS #
####################

# Pieces can move one tile in these directions
N, S, W, E, NW, NE, SW, SE = 1, 1, 1, 1, 1, 1, 1, 1
pieces = {
	'C' : N, 
	'H' : N, S, W, E, NW, NE,
	'E' : NW, NE, SW, SE,
	'G' : N, S, W, E,
	'L' : N, S, W, E, NW, NE, SW, SE
}

####################
# HELPER FUNCTIONS #
####################

def print_board(board):
	for row in board:
		print row

if __name__ == "__main__":
	app.run()