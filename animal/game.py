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
# HELPER FUNCTIONS #
####################

def print_board(board):
	for row in board:
		print row

if __name__ == "__main__":
	app.run()