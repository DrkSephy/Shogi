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

def placePiece(board, name, row, col):
	board[row][col] = name
	return

def generatePieces(board):
	placePiece(board, 'G', 0, 0)
	placePiece(board, 'L', 0, 1)
	placePiece(board, 'E', 0, 2)
	placePiece(board, 'C', 1, 1)
	placePiece(board, 'c', 2, 1)
	placePiece(board, 'e', 3, 0)
	placePiece(board, 'l', 3, 1)
	placePiece(board, 'g', 3, 2)
	return

def validMove(piece, x, y):
	if(x > 3 and y > 3):
		return False
