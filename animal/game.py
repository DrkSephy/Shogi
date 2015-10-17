from flask import Flask, render_template
import helpers

app = Flask(__name__)

@app.route("/game")
def game():
	board = helpers.generateBoard(0, 4)
	helpers.generatePieces(board)
	helpers.printBoard(board)
	return render_template("game.html")

if __name__ == "__main__":
	app.run(debug=True)