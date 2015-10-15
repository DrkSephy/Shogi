from flask import Flask 

app = Flask(__name__)

@app.route("/")
def board():
	board = []
	for i in range(0, 4):
		board.append([-1, -1, -1, -1])
	print board
	return "Hello World!"

if __name__ == "__main__":
	app.run()