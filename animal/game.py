from flask import Flask 

app = Flask(__name__)

@app.route("/")
def board():
	board = generateBoard(0, 4)
	printBoard(board)
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

####################
# HELPER FUNCTIONS #
####################

def generateBoard(min, max):
	board = []
	for i in range(min, max):
		board.append([-1, -1, -1])
	return board


def printBoard(board):
	for row in board:
		print row

if __name__ == "__main__":
	app.run()