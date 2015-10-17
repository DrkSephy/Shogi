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
	return

def placePiece(board, name, x, y):
	board[x][y] = name
	return

def generatePieces(board):
	placePiece(board, 'G', 0, 0)
	placePiece(board, 'L', 0, 1)
	placePiece(board, 'E', 0, 2)
	placePiece(board, 'C', 1, 1)
	placePiece(board, 'C', 2, 1)
	placePiece(board, 'E', 3, 0)
	placePiece(board, 'L', 3, 1)
	placePiece(board, 'G', 3, 2)
	return

def validMove(piece, x, y):
	if(x > 3 || y > 3):
		return False