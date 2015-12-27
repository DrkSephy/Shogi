$(document).ready(function() {

  "use strict";

  /**************************
  *    INTERNAL VARIABLES   *
  **************************/

  // Internal state of board
  var _board = [];
  // Internal state of player bench
  var _playerBench = [];
  // Internal state of enemy bench
  var _enemyBench = [];

  var bestMove;

  /**************************
  *    POSITION VARIABLES   *
  **************************/
  
  // The position of the selected piece
  var selectedPosition = { row: 0, col: 0 };

  // The position of the attacked cell
  var attackPosition = { row: 0, col: 0 };

  // Difference between selected and attack cells
  var differencePosition = { row: 0, col: 0 };

  /**************************
  *    PIECE VALIDATION     *
  **************************/

  // Did we select a cell that is occupied?
  var selectedCell = false;

  // Did we select a cell to attack?
  var attackedCell = false;

  // Did we select a bench piece? 
  var selectedEnemyBenchPiece = false;
  var selectedPlayerBenchPiece = false;
  var selectedPlayerBenchPiecePosition = { col: 0 };
  var selectedEnemyBenchPiecePosition = { col: 0 }; 

  /********************************
  *    GAME EVALUATION VARIABLES  *
  *********************************/

  var playerLionCaptured = false;
  var enemyLionCaptured = false;
  var seenPlayerLion = false;
  var seenEnemyLion = false;
  var gameOver = false;

  /**************************
  *      TURN VARIABLES     *
  **************************/

  var playerTurn = true;
  var enemyTurn = false;
  var turnCount = 1;

  // Has either player moved?
  var playerMoved = false;
  var enemyMoved = false;

  var currentTurn = null; 

  /**************************
  *  PROMOTION VARIABLES  *
  **************************/
  
  var playerChickPromotion = false;
  var playerChickPosition = { row: 0, col: 0 };
  var enemyChickPromotion = false;
  var enemyChickPosition = { row: 0, col: 0 };

  // If Player moved a chick (not placed)
  // it is a legitimate candidate for promotion to Hen
  var movedPlayerChick = false;

  // If Enemy moved a chick (not placed)
  // it is legitimate candidate for promotion to Hen
  var movedEnemyChick = false;

  /**************************
  *     LEGITIMATE MOVES    *
  **************************/
  
  var _pieces = {
    'enemyChick' : [
      { row: 1, col: 0 }  // South
    ],
    'enemyLion' : [
      { row: 1,  col: 0  }, // South
      { row: -1, col: 0  }, // North
      { row: 0,  col: -1 }, // East
      { row: 0,  col: 1  }, // West
      { row: 1,  col: -1 }, // Southwest
      { row: -1, col: -1 }, // Northwest
      { row: 1,  col: 1  }, // Southeast
      { row: -1, col: 1  }, // Northeast
    ],
    'enemyElephant' : [
      { row: 1,  col: -1 }, // Southwest
      { row: -1, col: -1 }, // Northwest
      { row: 1,  col: 1  }, // Southeast
      { row: -1, col: 1  }, // Northeast
    ],
    'enemyGiraffe' : [
      { row: 1,  col: 0  }, // South
      { row: -1, col: 0  }, // North
      { row: 0,  col: -1 }, // West
      { row: 0,  col: 1  }, // East
    ],
    'enemyHen' : [
      { row: 1,  col: 0  }, // South
      { row: -1, col: 0  }, // North
      { row: 0,  col: -1 }, // West
      { row: 0,  col: 1  }, // East
      { row: 1,  col: -1 }, // Southwest
      { row: 1,  col: 1  }, // Southeast
    ],
    'playerChick' : [
      { row: -1, col: 0 }   // North
    ],
    'playerLion' : [
      { row: -1, col: 0  }, // North
      { row: 1,  col: 0  }, // South
      { row: 0,  col: -1 }, // West
      { row: 0,  col: 1  }, // East
      { row: -1, col: -1 }, // Northwest
      { row: 1,  col: -1 }, // Southwest
      { row: -1, col: 1  }, // Northeast
      { row: 1,  col: 1  }, // Southeast
    ],
    'playerElephant' : [
      { row: -1, col: -1 }, // Northwest
      { row: 1,  col: -1 }, // Southwest
      { row: 1,  col: 1  }, // Southeast
      { row: -1, col: 1  }, // Northeast
    ],
    'playerGiraffe' : [
      { row: -1, col: 0  }, // North
      { row: 1,  col: 0  }, // South
      { row: 0,  col: -1 }, // West
      { row: 0,  col: 1  }, // East
    ],
    'playerHen' : [
      { row: -1, col: 0 }, // North
      { row: 1,  col: 0 }, // South
      { row: 0,  col: -1}, // West
      { row: 0,  col: 1 }, // East
      { row: -1, col: -1}, // Northwest
      { row: -1, col: 1 }, // Northeast 
    ],
  }

  /*************************************
  *    INTERNAL BOARD INITIALIZATION   *
  *************************************/
  
  $('.row').each(function(rowIndex, row){
    _board.push([]);
    $(this).find('.square').each(function(cellIndex, square) {
      var cell = $(square).children()[0];
      
      if($(cell).hasClass('enemyGiraffe')) {
        _board[rowIndex][cellIndex] = 'enemyGiraffe';
      } else if ($(cell).hasClass('enemyLion')) {
        _board[rowIndex][cellIndex] = 'enemyLion';
      } else if ($(cell).hasClass('enemyElephant')) {
        _board[rowIndex][cellIndex] = 'enemyElephant'; 
      } else if ($(cell).hasClass('enemyChick')) {
        _board[rowIndex][cellIndex] = 'enemyChick';
      } else if ($(cell).hasClass('playerChick')) {
        _board[rowIndex][cellIndex] = 'playerChick';
      } else if ($(cell).hasClass('playerElephant')) {
        _board[rowIndex][cellIndex] = 'playerElephant';
      } else if ($(cell).hasClass('playerLion')) {
        _board[rowIndex][cellIndex] = 'playerLion';
      } else if ($(cell).hasClass('playerGiraffe')) {
        _board[rowIndex][cellIndex] = 'playerGiraffe';
      } else {
        _board[rowIndex][cellIndex] = -1;
      }
  
      $(square).attr({'data-x': rowIndex, 'data-y': cellIndex});
    });
  });

  // Initialize Enemy Bench Internal Board
  $('.enemyRow').each(function(rowIndex, row) {
    $(this).find('.square').each(function(cellIndex, square) {
      _enemyBench[rowIndex] = -1;
      $(square).attr({'data-x': rowIndex});
    });
  });

  // Initialize Player Bench Internal Board
  $('.playerRow').each(function(rowIndex, row) {
    $(this).find('.square').each(function(cellIndex, square) {
      _playerBench[rowIndex] = -1;
      $(square).attr({'data-x': rowIndex});
    });
  });

  // Set the first debug message
  debugPanel('=================TURN ' + turnCount + '=================');
  debugPanel('\n\n')
  debugPanel('  Enemy move for turn: ' + turnCount);

  /**************************
  *      HELPER METHODS     *
  **************************/

  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * @returns {number}
  */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Prints state of the board.
   * @returns {undefined}
  */
  function printBoard(board) {
    for(var i = 0; i < 4; i++) {
      console.log(board[i]);
    }
    console.log('--------------Finished printing board----------------');
    return;
  }

  /**
   * Prints state of the enemy bench.
   * @returns {undefined}.
  */
  function printEnemyBench() {
    console.log('Enemy bench: ' + _enemyBench);
    return;
  }

  /**
   * Prints state of the player bench.
   * @returns {undefined}
  */
  function printPlayerBench() {
    console.log('Player bench: ' + _playerBench);
    console.log('----------------Finished printing benches--------------------');
    return;
  }

  /** 
   * Returns cell contents.
   * @param {number} row The row to search.
   * @param {number} col The column to search.
   * @returns {number, string} The value at [row][column].
  */
  function getCellContents(row, col) {
    return _board[row][col];
  }

  /**
   * Appends text to the debug panel.
   * @param {string} message The message to add to debug panel.
   * @return {undefined}
  */
  function debugPanel(message) {
    $('#debug').append(message);
    $('#debug').scrollTop($('#debug')[0].scrollHeight);
    return;
  }

  /**
   * Determines location of a piece.
   * @param {string} piece The name of the piece to locate. 
   * @return {object} position The Row/Col position of piece.
  */
  function getPosition(piece) {
    var position = {'row': 0, 'col': 0};
    for(var row = 0; row < 4; row++) {
      for(var col = 0; col < 3; col++) {
        if(_board[row][col] === piece) {
          position.row = row;
          position.col = col;
        }
      }
    }

    return position; 
  }

  /**
   * Determines is a piece is on the board.
   * @param {object} board The configuration to test.
   * @param {string} piece The piece to search for.
   * @returns {boolean} found Whether the piece was found.
  */
  function isPieceOnBoard(board, piece) {
    var found = false;
    for(var row = 0; row < 4; row++) {
      for(var col = 0; col < 3; col++) {
        if(board[row][col] === piece) {
          found = true;
        }
      }
    }

    return found;
  }

  /**
   * Determines occurances of all pieces on the board.
   * @param {string} board The board to iterate over.
   * @return {object} count The number of occurances of all pieces.
  */
  function getOccurances(board) {
    var occurances = {
      'enemyLion'     : 0,
      'playerLion'    : 0,
      'enemyElephant' : 0,
      'playerElephant': 0,
      'enemyGiraffe'  : 0,
      'playerGiraffe' : 0,
      'enemyChick'    : 0,
      'playerChick'   : 0,
      'enemyHen'      : 0,
      'playerHen'     : 0
    }

    for(var row = 0; row < 4; row++) {
      for(var col = 0; col < 3; col++) {
        // If position is not empty
        if(board[row][col] != -1) {
          occurances[board[row][col]] += 1;
        }
      }
    }

    return occurances;
  }

  /**
   * Determines which pieces on the board are threatened.
   * @param {object} moves All possible moves for this turn.
   * @param {object} board The configuration to test.
   * @returns {list} threatenedPieces A list containing all threatened pieces.
  */
  function getThreatenedPieces(board, moves) {
    var threatenedPieces = [];
    $.each(moves, function(index) {
      var move = moves[index];
      if(move.type === 'movement') {
        var toRowPos = move.to.row;
        var toColPos = move.to.col;
        if(board[toRowPos][toColPos] != -1) {
          if((board[toRowPos][toColPos]).indexOf('enemy') > -1) {
            threatenedPieces.push(board[toRowPos][toColPos]);
          }  
        }
      }
    });

    return threatenedPieces;
  }
  

  /**
   * Makes a move on the internal board, and updates front-end.
   * @param {object} move Contains information for move.
   * @returns {undefined}
  */
  function _makeMove(move) {
    var fromRowPos = move.from.row;
    var fromColPos = move.from.col;
    var toRowPos   = move.to.row;
    var toColPos   = move.to.col;

    if(move.type === 'movement') {
      setTimeout(function(){
        // Select the piece
        $('.row > .square[data-x=' + fromRowPos + '][data-y=' + fromColPos + ']').click();
      }, 1000);
      
      setTimeout(function(){
        // Move the piece!
        $('.row > .square[data-x=' + toRowPos + '][data-y=' + toColPos + ']').click();
      }, 1500);
    } 

    if(move.type === 'placement') {
      setTimeout(function(){
        // Select the piece
        $('.enemyRow > .square[data-x=' + move['from']['row'] + ']').click();
      }, 1000);

      setTimeout(function(){
        // Move the piece!
        $('.row > .square[data-x=' + move['to']['row'] + '][data-y=' + move['to']['col'] + ']').click();
      }, 1500);
    }
  }

  /**************************
  *       GAME METHODS      *
  **************************/ 

  /**
   * Switches the active turn player.
   * @returns {undefined}
  */
  function toggleTurn() {
    if(playerTurn) {
      playerTurn = false;
      playerMoved = true;
      enemyTurn = true;
      currentTurn = 'enemy';

      // AI will make a random move
      // makeRandomMove();

      // Get all possible moves for enemy
      // var moves = getValidMoves(_board, currentTurn);

      // Get all possible board combinations
      // var boards = makeAllPossibleMoves(moves);

      // AI will make a move based on manhattan distance 
      // To playerLion
      // manhattanDistance(boards, moves);

      // AI will make move based on custom heuristic
      // boardEvaluation(boards, moves);
      setTimeout(function() {
        // Get the best move
        // var data = minimax(5, 'enemy', _board);
        // console.log(data);
        // var move = data[1];
        // console.log(move);
        // _makeMove(move);

        var data = alphabeta(7, 'enemy', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, _board);
        console.log(data);
        var move = data[1];
        _makeMove(move);
      }, 500);
      
    } else if (enemyTurn) {
      enemyTurn = false;
      enemyMoved = true;
      playerTurn = true;
      currentTurn = 'player';
    }

    return;
  }

  /**
   * Returns all possible board configurations after each move.  
   * @param {list} moves All moves to be tried.
   * @returns {list} All possible board configurations.
  */
  function makeAllPossibleMoves(moves) {
    var boards = [];
    
    // Make enough copies of the board for all possible moves
    for(var copy = 0; copy < moves.length; copy++) {
      // Deep copy our internal board
      var copiedBoard = $.extend(true, {}, _board);
      boards.push(copiedBoard);
    }

    $.each(moves, function(index) {
      var board = boards[index];
      var fromRowPos = moves[index]['from']['row'];
      var fromColPos = moves[index]['from']['col'];
      var toRowPos   = moves[index]['to']['row'];
      var toColPos   = moves[index]['to']['col'];
      var pieceName  = moves[index]['piece'];
      
      // Clear contents of cell 
      board[fromRowPos][fromColPos] = -1;

      // Move piece
      board[toRowPos][toColPos] = pieceName;
    });

    return boards;
  }

  /**
   * Returns a new board configuration for a single move.
   * @param {object} move The parameters describing the piece being moved
   * @returns {object} copiedBoard The new game state after the move was made.
  */
  function makeSingleMove(move, board) {
    // Copy the board
    var copiedBoard = $.extend(true, {}, board);
    
    // Store movement parameters
    var fromRowPos = move['from']['row'];
    var fromColPos = move['from']['col'];
    var toRowPos   = move['to']['row'];
    var toColPos   = move['to']['col'];
    var pieceName  = move['piece'];

    // Clear contents of cell
    copiedBoard[fromRowPos][fromColPos] = -1;

    // Move piece 
    copiedBoard[toRowPos][toColPos] = pieceName;

    return copiedBoard;
  }

  /**
   * Returns the score of a new game state.
   * @param {object} configuration The game state to score.
   * @returns {number} score The score of the current game state.
  */
  function evaluateSingleBoard(configuration) {
    // Piece-wise weights
    var lionWeight      = 100;
    var elephantWeight  = 3;
    var giraffeWeight   = 5;
    var chickWeight     = 1;
    var henWeight       = 7;

    // Static weight
    var mobilityWeight  = 0.1;

    // Piece-wise mobility weight
    var pieceMobilityWeight = {
      'enemyLion'     : 0.5,
      'playerLion'    : 0.5,
      'enemyElephant' : 0.3,
      'playerElephant': 0.3,
      'enemyGiraffe'  : 0.2,
      'playerGiraffe' : 0.2,
      'enemyChick'    : 0.4,
      'playerChick'   : 0.4,
      'enemyHen'      : 0.1,
      'playerHen'     : 0.1
    }

    var score;
    var materialScore     = 0;
    var mobilityScore     = 0;
    var inCheck           = 0;

    // Get frequency of each piece
    var occurances = getOccurances(configuration);

    // Compute material score
    materialScore = 
      lionWeight * (occurances['enemyLion'] - occurances['playerLion']) + 
      elephantWeight * (occurances['enemyElephant'] - occurances['playerElephant']) + 
      giraffeWeight * (occurances['enemyGiraffe'] - occurances['playerGiraffe']) + 
      chickWeight * (occurances['enemyChick'] - occurances['playerChick']) + 
      henWeight * (occurances['enemyHen'] - occurances['playerHen']);

    // Compute all valid moves for the enemy in this board configuration
    var validEnemyMoves = getValidMoves(configuration, 'enemy');

    // Compute all valid moves for the player in this board configuration
    var validPlayerMoves = getValidMoves(configuration, 'player');

    // Check if the enemy put themselves in check. If so, player will win next turn
    var threatenedPieces = getThreatenedPieces(configuration, validPlayerMoves);

    // We also need to check if we would win by making the move, too
    // Check if making this move captures the player lion
    var isPlayerLionAlive = isPieceOnBoard(configuration, 'playerLion');

    if($.inArray('enemyLion', threatenedPieces) > -1 && isPlayerLionAlive) {
      inCheck = Number.NEGATIVE_INFINITY;
    }

    mobilityScore = mobilityWeight * (validEnemyMoves.length - validPlayerMoves.length);
    // mobilityScore = pieceMobilityWeight[piece] * (validEnemyMoves.length - validPlayerMoves.length);
    
    // Total score is worth of pieces + mobility score + inCheck
    score = materialScore + mobilityScore + inCheck;

    return score;
  }

  /**
   * Computes the evaluation of the board based on the heuristic:
   *
   *        f(board) = materialScore + mobilityScore
   * 
   * Where materialScore = 
   *    lionWeight     * (enemyLion - playerLion) + 
   *    elephantWeight * (enemyElephant - playerElephant) + 
   *    giraffeWeight  * (enemyGiraffe - playerGiraffe) +
   *    chickWeight    * (enemyChick - playerChick) + 
   *    henWeight      * (enemyHen - playerHen) 
   * 
   * where the weights can be set appropriately. 
   *
   * mobilityScore = mobilityWeight * (# of enemy moves - # of player moves)
   *
   * where it is generally advantageous to have more moves available. 
   * 
   * @param {list} configurations Array of board configurations to test.
   * @param {object} moves Contains all possible moves.
   * @returns {object} The best possible move for this turn.
  */
  function boardEvaluation(configurations, moves) {
    var lionWeight      = 10;
    var elephantWeight  = 3;
    var giraffeWeight   = 5;
    var chickWeight     = 1;
    var henWeight       = 7;

    // Static weight
    var mobilityWeight  = 0.1;

    // Piece-wise mobility weight
    var pieceMobilityWeight = {
      'enemyLion'     : 0.5,
      'playerLion'    : 0.5,
      'enemyElephant' : 0.3,
      'playerElephant': 0.3,
      'enemyGiraffe'  : 0.2,
      'playerGiraffe' : 0.2,
      'enemyChick'    : 0.4,
      'playerChick'   : 0.4,
      'enemyHen'      : 0.1,
      'playerHen'     : 0.1
    }

    // Store all scores of each board
    var scores = []; 
    $.each(configurations, function(index) {
      var materialScore     = 0;
      var mobilityScore     = 0;
      var inCheck           = 0;

      // Indexed board configuration
      var configuration = configurations[index];

      // Get frequency of each piece
      var occurances = getOccurances(configuration);

      // Compute material score
      materialScore = 
        lionWeight * (occurances['enemyLion'] - occurances['playerLion']) + 
        elephantWeight * (occurances['enemyElephant'] - occurances['playerElephant']) + 
        giraffeWeight * (occurances['enemyGiraffe'] - occurances['playerGiraffe']) + 
        chickWeight * (occurances['enemyChick'] - occurances['playerChick']) + 
        henWeight * (occurances['enemyHen'] - occurances['playerHen']);

      // Compute all valid moves for the enemy in this board configuration
      var validEnemyMoves = getValidMoves(configuration, 'enemy');

      // Compute all valid moves for the player in this board configuration
      var validPlayerMoves = getValidMoves(configuration, 'player');

      // Check if the enemy put themselves in check. If so, player will win next turn
      var threatenedPieces = getThreatenedPieces(configuration, validPlayerMoves);

      // We also need to check if we would win by making the move, too
      // Check if making this move captures the player lion
      var isPlayerLionAlive = isPieceOnBoard(configuration, 'playerLion');
      if($.inArray('enemyLion', threatenedPieces) > -1 && isPlayerLionAlive) {
        inCheck = Number.NEGATIVE_INFINITY;
      }
      
      // Mobility bonus should be implemented based on piece, to prevent AI from repeatedly
      // moving the lion which provides more possible moves

      // Store the piece that is being moved 
      // var piece = moves[index].piece;
      
      // NOTE: It seems that moves which don't use piece-wise weights are tougher
      mobilityScore = mobilityWeight * (validEnemyMoves.length - validPlayerMoves.length);
      // mobilityScore = pieceMobilityWeight[piece] * (validEnemyMoves.length - validPlayerMoves.length);
      
      // Total score is worth of pieces + mobility score + inCheck
      var totalScore = materialScore + mobilityScore + inCheck;

      scores.push(totalScore);
    });
    
    // Get maximum value from scores
    var maximumValue = Math.max.apply(Math, scores);
    
    // Get index of move that resulted in maximum evaluation
    var move = moves[scores.indexOf(maximumValue)];

    // Make the best move!
    _makeMove(move);
  }

  /**
   * Computes Manhattan Distance of all pieces to lion.
   * @param {list} configurations Array of board configurations to test.
   * @param {object} moves Contains all possible moves.
   * @returns Move with minimal Manhattan Distance.
  */
  function manhattanDistance(configurations, moves) {
    // Get position of player lion
    var position = getPosition('playerLion');
    var distances = [];
    
    // Loop over all configurations
    $.each(configurations, function(index) {
      var configuration = configurations[index];
      var manhattanDistanceTotal = 0;
      for(var row = 0; row < 4; row++) {
        for(var col = 0; col < 3; col++) {
          if(configuration[row][col] != -1 && (configuration[row][col]).indexOf('enemy') > -1) {
            var distance = Math.abs(position.row - row) + Math.abs(position.col - col);
            manhattanDistanceTotal += distance;
          }
        }
      }
      distances.push(manhattanDistanceTotal);
    });
    
    var minimumDistance = Math.min.apply(Math, distances)
    // Use indexOf to find index of the move that minimizes the difference
    // In the case of multiple moves with minimum value, this will choose the
    // first one in the array
    var move = moves[distances.indexOf(minimumDistance)];

    // Make the move
    _makeMove(move);
  }
  
  /**
   * AI player will make a random move.
   *
  */
  function makeRandomMove() {
    var moves = getValidMoves(_board, currentTurn);
    var choice = getRandomInt(0, moves.length - 1);
    var piece = moves[choice];
    
    if(piece['type'] === 'movement') {
      // Select the piece
      $('.row > .square[data-x=' + piece['from']['row'] + '][data-y=' + piece['from']['col'] + ']').click();
      
      setTimeout(function(){
        // Move the piece!
        $('.row > .square[data-x=' + piece['to']['row'] + '][data-y=' + piece['to']['col'] + ']').click();
      },1000);
    } 

    if(piece['type'] === 'placement') {
      // Select the piece
      $('.enemyRow > .square[data-x=' + piece['from']['row'] + ']').click();

      setTimeout(function(){
        // Move the piece!
        $('.row > .square[data-x=' + piece['to']['row'] + '][data-y=' + piece['to']['col'] + ']').click();
      },1000);
    }
  }

  /**
   * Computes all valid moves for a turn player on a board.
   * @param {object} board The configuration to find all possible moves in.
   * @param {string} player The player to find all valid moves for.
   * @returns {object} validMoves An object containing all valid moves with To/From data.
  */
  function getValidMoves(board, player) {
    // Computes all valid moves for a turn player
    var validMoves = [];
  
    for(var row = 0; row < 4; row++) {
      for(var col = 0; col < 3; col++) {
        if(board[row][col] == player + 'Chick') {
          var chickRowPosition = row;
          var chickColPosition = col;
          for(var length = 0; length < _pieces[player + 'Chick'].length; length++) {
            var newChickRowPosition = chickRowPosition + _pieces[player + 'Chick'][length].row;
            var newChickColPosition = chickColPosition + _pieces[player + 'Chick'][length].col;

            if(newChickRowPosition >= 0 && newChickRowPosition < 4 && 
               newChickColPosition >= 0 && newChickColPosition < 3 && 
               board[newChickRowPosition][newChickColPosition] == -1) {
              validMoves.push({'type': 'movement', piece: player + 'Chick', 'from': {row: chickRowPosition, col: chickColPosition},  'to': {row: newChickRowPosition, col: newChickColPosition}});
            }

            if(newChickRowPosition >= 0 && newChickRowPosition < 4 && 
               newChickColPosition >= 0 && newChickColPosition < 3 && 
               board[newChickRowPosition][newChickColPosition] !== -1) {
               if(player === 'enemy' && (board[newChickRowPosition][newChickColPosition]).indexOf('player') > -1) {
                validMoves.push({'type': 'movement', piece: player + 'Chick', 'from': {row: chickRowPosition, col: chickColPosition}, 'to': {row: newChickRowPosition, col: newChickColPosition}});
               } else if(player === 'player' && (board[newChickRowPosition][newChickColPosition]).indexOf('enemy') > -1) {
                validMoves.push({'type': 'movement', piece: player + 'Chick', 'from': {row: chickRowPosition, col: chickColPosition}, 'to': {row: newChickRowPosition, col: newChickColPosition}});
               } 
            } 
          }
        }

        if(board[row][col] == player + 'Lion') {
          var lionRowPosition = row;
          var lionColPosition = col;
          for(var length = 0; length < _pieces[player + 'Lion'].length; length++) {
            var newLionRowPosition = lionRowPosition + _pieces[player + 'Lion'][length].row;
            var newLionColPosition = lionColPosition + _pieces[player + 'Lion'][length].col;
            
            if(newLionRowPosition >= 0 && newLionRowPosition < 4 && 
               newLionColPosition >= 0 && newLionColPosition < 3 && 
               board[newLionRowPosition][newLionColPosition] == -1) {
              validMoves.push({'type': 'movement', piece: player + 'Lion', 'from': {row: lionRowPosition, col: lionColPosition}, 'to': {row: newLionRowPosition, col: newLionColPosition}});
            }

            if(newLionRowPosition >= 0 && newLionRowPosition < 4 && 
               newLionColPosition >= 0 && newLionColPosition < 3 && 
               board[newLionRowPosition][newLionColPosition] !== -1) {
               if(player === 'enemy' && (board[newLionRowPosition][newLionColPosition]).indexOf('player') > -1) {
                validMoves.push({'type': 'movement', piece: player + 'Lion', 'from': {row: lionRowPosition, col: lionColPosition}, 'to': {row: newLionRowPosition, col: newLionColPosition}});
               } else if(player === 'player' && (board[newLionRowPosition][newLionColPosition]).indexOf('enemy') > -1) {
                validMoves.push({'type': 'movement', piece: player + 'Lion', 'from': {row: lionRowPosition, col: lionColPosition}, 'to': {row: newLionRowPosition, col: newLionColPosition}});
               } 
            }
          }
        }

        if(board[row][col] == player + 'Elephant') {  
          var elephantRowPosition = row;
          var elephantColPosition = col;
          for(var length = 0; length < _pieces[player + 'Elephant'].length; length++) {
            var newElephantRowPosition = elephantRowPosition + _pieces[player + 'Elephant'][length].row;
            var newElephantColPosition = elephantColPosition + _pieces[player + 'Elephant'][length].col;
            if(newElephantRowPosition >= 0 && newElephantRowPosition < 4 && 
               newElephantColPosition >= 0 && newElephantColPosition < 3 && 
               board[newElephantRowPosition][newElephantColPosition] == -1) {
              validMoves.push({'type': 'movement', piece: player + 'Elephant', 'from': {row: elephantRowPosition, col: elephantColPosition}, 'to': {row: newElephantRowPosition, col: newElephantColPosition}});
            }

            if(newElephantRowPosition >= 0 && newElephantRowPosition < 4 && 
               newElephantColPosition >= 0 && newElephantColPosition < 3 && 
               board[newElephantRowPosition][newElephantColPosition] !== -1) {
               if(player === 'enemy' && (board[newElephantRowPosition][newElephantColPosition]).indexOf('player') > -1) {
                 validMoves.push({'type': 'movement', piece: player + 'Elephant', 'from': {row: elephantRowPosition, col: elephantColPosition}, 'to': {row: newElephantRowPosition, col: newElephantColPosition}});
               } else if(player === 'player' && (board[newElephantRowPosition][newElephantColPosition]).indexOf('enemy') > -1) {
                 validMoves.push({'type': 'movement', piece: player + 'Elephant', 'from': {row: elephantRowPosition, col: elephantColPosition}, 'to': {row: newElephantRowPosition, col: newElephantColPosition}});
               } 
            }
          }
        }

        if(board[row][col] == player + 'Giraffe') {
          var giraffeRowPosition = row;
          var giraffeColPosition = col;
          for(var length = 0; length < _pieces[player + 'Giraffe'].length; length++) {
            var newGiraffeRowPosition = giraffeRowPosition + _pieces[player + 'Giraffe'][length].row;
            var newGiraffeColPosition = giraffeColPosition + _pieces[player + 'Giraffe'][length].col;
            if(newGiraffeRowPosition >= 0 && newGiraffeRowPosition < 4 && 
               newGiraffeColPosition >= 0 && newGiraffeColPosition < 3 && 
               board[newGiraffeRowPosition][newGiraffeColPosition] == -1) {
              validMoves.push({'type': 'movement', piece: player + 'Giraffe', 'from': {row: giraffeRowPosition, col: giraffeColPosition}, 'to': {row: newGiraffeRowPosition, col: newGiraffeColPosition}});
            }

            if(newGiraffeRowPosition >= 0 && newGiraffeRowPosition < 4 && 
               newGiraffeColPosition >= 0 && newGiraffeColPosition < 3 && 
               board[newGiraffeRowPosition][newGiraffeColPosition] !== -1) {
               if(player === 'enemy' && (board[newGiraffeRowPosition][newGiraffeColPosition]).indexOf('player') > -1) {
                 validMoves.push({'type': 'movement', piece: player + 'Giraffe', 'from': {row: giraffeRowPosition, col: giraffeColPosition}, 'to': {row: newGiraffeRowPosition, col: newGiraffeColPosition}});
               } else if(player === 'player' && (board[newGiraffeRowPosition][newGiraffeColPosition]).indexOf('enemy') > -1) {
                 validMoves.push({'type': 'movement', piece: player + 'Giraffe', 'from': {row: giraffeRowPosition, col: giraffeColPosition}, 'to': {row: newGiraffeRowPosition, col: newGiraffeColPosition}});
               } 
            }
          }
        }

        if(board[row][col] == player + 'Hen') {
          var henRowPosition = row;
          var henColPosition = col;
          for(var length = 0; length < _pieces[player + 'Hen'].length; length++) {
            var newHenRowPosition = henRowPosition + _pieces[player + 'Hen'][length].row;
            var newHenColPosition = henColPosition + _pieces[player + 'Hen'][length].col;
            if(newHenRowPosition >= 0 && newHenRowPosition < 4 && 
               newHenColPosition >= 0 && newHenColPosition < 3 && 
               board[newHenRowPosition][newHenColPosition] == -1) {
              validMoves.push({'type': 'movement', piece: player + 'Hen', 'from': {row: henRowPosition, col: henColPosition}, 'to': {row: newHenRowPosition, col: newHenColPosition}});
            }

            if(newHenRowPosition >= 0 && newHenRowPosition < 4 && 
               newHenColPosition >= 0 && newHenColPosition < 3 && 
               board[newHenRowPosition][newHenColPosition] !== -1) {
               if(player === 'enemy' && (board[newHenRowPosition][newHenColPosition]).indexOf('player') > -1) {
                 validMoves.push({'type': 'movement', piece: player + 'Hen', 'from': {row: henRowPosition, col: henColPosition}, 'to': {row: newHenRowPosition, col: newHenColPosition}});
               } else if(player === 'player' && (board[newHenRowPosition][newHenColPosition]).indexOf('enemy') > -1) {
                 validMoves.push({'type': 'movement', piece: player + 'Hen', 'from': {row: henRowPosition, col: henColPosition}, 'to': {row: newHenRowPosition, col: newHenColPosition}});
               } 
            }
          }
        }
      }
    }
  
    if(player === 'player') {
      // Loop over all pieces on respective player's bench
      for(var piece = 0; piece < _playerBench.length; piece++) {
        // If there is a piece on the bench
        if(_playerBench[piece] !== -1) {
          // Each empty spot on our game board is a valid placement spot
          for(var row = 0; row < 4; row++) {
            for(var col = 0; col < 3; col++) {
              // If the spot is empty, we can place the piece there
              if(board[row][col] == -1) {
                validMoves.push({'type': 'placement', piece: _playerBench[piece], 'from': {row: piece}, 'to': {row: row, col: col}});
              }
            }
          }
        }
      }
    }

    if(player === 'enemy') {
      // Loop over all pieces on respective player's bench
      for(var piece = 0; piece < _enemyBench.length; piece++) {
        // If there is a piece on the bench
        if(_enemyBench[piece] !== -1) {
          // Each empty spot on our game board is a valid placement spot
          for(var row = 0; row < 4; row++) {
            for(var col = 0; col < 3; col++) {
              // If the spot is empty, we can place the piece there
              if(board[row][col] == -1) {
                validMoves.push({'type': 'placement', piece: _enemyBench[piece], 'from': {row: piece}, 'to': {row: row, col: col}});
              }
            }
          }
        }
      }
    }
    
    return validMoves;
  }


  /**
   * Returns controlled squares by a player.
   * @param {object} board The configuration to test.
   * @param {string} player The player to find controlled spaces for.
   * @returns {list} A list of objects containing all row/col values for controlled spaces.
  */
  function getControlledSquares(board, player) {
    var controlledSquares = [];
    for(var row = 0; row < 4; row++) {
      for(var col = 0; col < 3; col++) {
        if(board[row][col] != -1) {
          // If we found an enemy piece
          if((board[row][col]).indexOf('enemy') > -1) {
            var piece = board[row][col];
            // console.log(piece);
            // Loop over all movements for this piece
            for(var length = 0; length < _pieces[piece].length; length++) {
              var oldRowPosition = row;
              var oldColPosition = col;
              // console.log('oldRowPosition: ' + oldRowPosition + ' ,oldColPosition: ' + oldColPosition + ' , for piece: ' + piece);
              var currentRowPosition = _pieces[piece][length].row;
              var currentColPosition = _pieces[piece][length].col;
              // New position for each movement
              var newRowPosition = oldRowPosition + currentRowPosition;
              var newColPosition = oldColPosition + currentColPosition;
              // console.log('currentRowPosition: ' + currentRowPosition + ' , currentColPosition: ' + currentColPosition + ' , for piece: ' + piece);
              // console.log('newRowPosition: ' + newRowPosition + ' , newColPosition: ' + newColPosition + ' , for piece: ' + piece);
              // console.log('-----------------------------');
              // If move is in bounds
              if(newRowPosition >= 0 && newRowPosition < 4 && newColPosition >= 0 && newColPosition < 3) {
                var newLocation = {'row': newRowPosition, 'col': newColPosition, 'piece': piece};
                controlledSquares.push(newLocation);
              }
            }
          }
        }
      }
    }

    return controlledSquares;
  }

  /**
   * Increments turn counter and resets move states.
   * @returns {undefined}
  */
  function incrementTurn() {
    if(playerMoved && enemyMoved) {
      turnCount++;
      playerMoved = false;
      enemyMoved = false;
      debugPanel('\n\n');
      debugPanel('            =================TURN ' + turnCount + '=================');
    }

    // Debug
    if(playerTurn) {
      debugPanel('\n\n');
      debugPanel('  Player move for turn: ' + turnCount);
    }

    if(enemyTurn) {
      debugPanel('\n\n');
      debugPanel('  Enemy move for turn: ' + turnCount);
    }
    return;
  }

  /**
   * Determines if the game is over.
   * @returns {boolean} Is the game over?
  */
  function isGameOver(board) {
    // Check if either lion has reached opposite end
    // Check if player lion reached opposite end
    for(var col = 0; col < 3; col++) {
      if(board[0][col] === 'playerLion') {
        gameOver = true;
        debugPanel('\n');
        debugPanel('  Player has defeated the enemy!');
        return;
      } 
      if (board[3][col] === 'enemyLion') {
        gameOver = true;
        debugPanel('\n');
        debugPanel('  Enemy has defeated the player :/');
        return;
      }
    }

    // Check if either lion is captured
    seenPlayerLion = false;
    seenEnemyLion = false;
    for(var row = 0; row < 4; row++) {
      for(var col = 0; col < 3; col++) {
        // If the current entry is not the player lion
        // And we haven't seen it yet
        if(board[row][col] !== 'playerLion' && !seenPlayerLion) {
          playerLionCaptured = true;
        } else {
          playerLionCaptured = false;
          seenPlayerLion = true;
        }
        if(board[row][col] !== 'enemyLion' && !seenEnemyLion) {
          enemyLionCaptured = true;
        } else {
          enemyLionCaptured = false;
          seenEnemyLion = true;
        }
      }
    }
    if(playerLionCaptured) {
      debugPanel('\n');
      debugPanel('  Enemy has won :/');
      gameOver = true;
    } else if (enemyLionCaptured) {
      debugPanel('\n');
      debugPanel('  Player has defeated the enemy :)');
      gameOver = true;
    } else {
      gameOver = false;
    }
  }

  /**
   * Determines if a cell is occupied. 
   * @param {number} row The row to search.
   * @param {number} col The column to search.
   * @returns {boolean} Whether a cell is occupied.
  */
  function isOccupied(row, col) {
    return _board[row][col] === -1 ? false : true;
  }

  /**
   * Empties the contents of a cell.
   * @param {number} row The row component to clear.
   * @param {number} column The column component to clear.
   * @returns {undefined}
  */
  function clearCell(row, col) {
    _board[row][col] = -1;
    return;
  }

  /**
   * Checks if a move is valid.
   * @param {string} attacker The piece attempting to move.
   * @returns {boolean} Whether a move is valid. 
  */
  function validMove(attacker) {
    // Check if the new bounds are valid
    if(attackPosition.row > 3 || attackPosition.col > 2) {
      return false;
    }

    // It is the player's turn, we cannot:
    // Attack other player pieces
    if(playerTurn) {
      if(_board[attackPosition.row][attackPosition.col] !== -1 && 
        (_board[attackPosition.row][attackPosition.col]).indexOf('player') !== -1) {
        debugPanel('\n');
        debugPanel('  Player attempted to attack one of their own pieces, invalid move!');
        selectedCell = false;
        attackedCell = false;
        return false;
      }
    }

    if(enemyTurn) {
      if(_board[attackPosition.row][attackPosition.col] !== -1 && 
        (_board[attackPosition.row][attackPosition.col]).indexOf('enemy') !== -1) {
        debugPanel('\n');
        debugPanel('  Enemy attempted to attack one of their own pieces, invalid move!');
        selectedCell = false;
        attackedCell = false;
        return false;
      }
    }

    // Check if this piece performed a legal move
    for(var i = 0; i < _pieces[attacker].length; i++) {
      if(_pieces[attacker][i].row == differencePosition.row && 
         _pieces[attacker][i].col == differencePosition.col) {
        return true;
      } 
    }

    if(playerTurn) {
      debugPanel('\n');
      debugPanel('  Player performed an illegal move for: ' + attacker);
    }

    if(enemyTurn) {
      debugPanel('\n');
      debugPanel('  Enemy performed an illegal move for: ' + attacker);
    }
        
    // Made an invalid move, reset our selections
    selectedCell = false;
    attackedCell = false;
    return false; 
  }

  /**
   * Determines if we selected a valid piece.
   * @param {number} x The row to search.
   * @param {number} y The column to search.
   * @returns {boolean} If a valid selection occured
  */
  function validSelection(x, y) {
    // It is the player's turn. We cannot:
    //  Try to move the opponents pieces!
    if(playerTurn) {
      // Attempting to select an enemy piece...
      if((_board[x][y]).indexOf('enemy') !== -1) {
        debugPanel('\n');
        debugPanel('  Player tried to move an enemy piece: ' + _board[x][y] + ' at position: ' + x + ', ' + y);
        selectedCell = false;
        return false;
      }
    }

    // It is the enemy turn. We cannot:
    // Try to move the Player's pieces!
    if(enemyTurn) {
      // Attempting to select an enemy piece...
      if((_board[x][y]).indexOf('player') !== -1) {
        debugPanel('\n');
        debugPanel('  Enemy tried to move a player piece ' + _board[x][y] + ' at position: ' + x + ', ' + y);
        selectedCell = false;
        return false;
      }
    }

    // Debug 
    if(playerTurn) {
      debugPanel('\n')
      debugPanel('  Player has selected the piece ' + _board[x][y] + ' at position: ' + x + ', ' + y);
    }

    if(enemyTurn) {
      debugPanel('\n')
      debugPanel('  Enemy has selected the piece ' + _board[x][y] + ' at position: ' + x + ', ' + y);
    }
    return true;
  }

  /**
   * Checks if a chick should be promoted to a hen.
   * @returns {undefined} 
  */
  function checkChicks() {
    // Check first row
    for(var col = 0; col < 3; col++) {
      if(_board[0][col] === 'playerChick' && movedPlayerChick) {
        playerChickPromotion = true;
        debugPanel('\n');
        debugPanel('  Player chick gets promoted to a hen!');
        movedPlayerChick = false;
        return;
      }

      if (_board[3][col] === 'enemyChick' && movedEnemyChick) {
        enemyChickPromotion = true;
        debugPanel('\n');
        debugPanel('  Enemy chick gets promoted to a hen!');
        movedEnemyChick = false;
        return;
      }
    }
  }

  /**
   * Checks if bench is occupied at a position.
   * @param {number} position The position of bench to check.
   * @param {string} bench The bench to check.
   * @returns {boolean} Whether a position is occupied.
  */
  function isBenchOccupied(bench, position) {
    return bench[position] == -1 ? false : true;
  }

  /**
   * Adds piece to respective bench. 
   * @param {string} piece The piece to add to the bench.
   * @returns {undefined} 
  */
  function addToBench(piece) {
    if(piece == 'playerChick') {
      var cell = $('#playerChick');
      if($(cell).hasClass('enemyChick')) {
        cell = $('#playerChickTwo');
        cell.addClass('enemyChick');
        _enemyBench[3] = 'enemyChick';
      } else {
        cell.addClass('enemyChick');
      _enemyBench[0] = 'enemyChick';
      }
    } 

    else if(piece == 'playerGiraffe') {
      var cell = $('#playerGiraffe');
      if($(cell).hasClass('enemyGiraffe')) {
        cell = $('#playerGiraffeTwo');
        cell.addClass('enemyGiraffe');
        _enemyBench[4] = 'enemyGiraffe';
      } else {
        cell.addClass('enemyGiraffe');
        _enemyBench[1] = 'enemyGiraffe';
      }
    } 

    else if(piece == 'playerElephant') {
      var cell = $('#playerElephant');
      if($(cell).hasClass('enemyElephant')) {
        cell = $('#playerElephantTwo');
        cell.addClass('enemyElephant');
        _enemyBench[5] = 'enemyElephant';
      } else {
        cell.addClass('enemyElephant');
      _enemyBench[2] = 'enemyElephant';
      }
    } 

    else if(piece == 'playerHen') {
      var cell = $('#playerChick');
      if($(cell).hasClass('enemyChick')) {
        cell = $('#playerChickTwo');
        cell.addClass('enemyChick');
        _enemyBench[3] = 'enemyChick';
      } else {
        cell.addClass('enemyChick');
      _enemyBench[0] = 'enemyChick';
      }
    }  

    // Player bench pieces
    else if(piece == 'enemyChick') {
      var cell = $('#enemyChick');
      if($(cell).hasClass('playerChick')) {
        cell = $('#enemyChickTwo');
        cell.addClass('playerChick');
        _playerBench[3] = 'playerChick';
      } else {
        cell.addClass('playerChick');
      _playerBench[0] = 'playerChick';
      }
    }

    else if(piece == 'enemyGiraffe') {
      var cell = $('#enemyGiraffe');
      if($(cell).hasClass('playerGiraffe')) {
        cell = $('#enemyGiraffeTwo');
        cell.addClass('playerGiraffe');
        _playerBench[4] = 'playerGiraffe';
      } else {
        cell.addClass('playerGiraffe');
      _playerBench[1] = 'playerGiraffe';
      }
    }  

    else if(piece == 'enemyElephant') {
      var cell = $('#enemyElephant');
      if($(cell).hasClass('playerElephant')) {
        cell = $('#enemyElephantTwo');
        cell.addClass('playerElephant');
        _playerBench[5] = 'playerElephant';
      } else {
        cell.addClass('playerElephant');
      _playerBench[2] = 'playerElephant';
      }
    } 

    else if(piece == 'enemyHen') {
      var cell = $('#enemyChick');
      if($(cell).hasClass('playerChick')) {
        cell = $('#enemyChickTwo');
        cell.addClass('playerChick');
        _playerBench[3] = 'playerChick';
      } else {
        cell.addClass('playerChick');
      _playerBench[0] = 'playerChick';
      }
    }

    else {
      return;
    }
  }

  function clearCells() {
    /**
     * Resets border properties of all cells.
     * @return {undefined}
    */
    $('.row').each(function() {
      $(this).find('.square').each(function() {
        $(this).css('border', '2px dashed gray');
      });
    })

    $('.playerRow').each(function() {
      $(this).find('.square').each(function() {
        $(this).css('border', '2px dashed gray');
      });
    })

    $('.enemyRow').each(function() {
      $(this).find('.square').each(function() {
        $(this).css('border', '2px dashed gray');
      });
    });
    return;
  }

  /**
   * Removes a piece from a bench.
   * @param {number} position The column of the piece in the internal bench.
   * @param {string} piece The name of the piece to remove from the internal bench.
   * @param {string} player The respective bench to remove a piece from.
   * @return {undefined}
  */ 
  function removeFromBench(position, piece, player) {
    if(player == 'enemy') {
      var $benchCell = ($('.enemyRow > .square[data-x=' + position + ']')).children();
      $benchCell.removeClass(piece);
    } else if (player == 'player') {
      var $benchCell = ($('.playerRow > .square[data-x=' + position + ']')).children();
      $benchCell.removeClass(piece);
    }
    return;
  }

  /*********************
  *     AI METHODS     *
  *********************/


  /**
   * Computes the next move using minimax with Alpha-Beta pruning. 
   * @param {number} depth How many plies to look ahead.
   * @param {string} player The maximizing player.
   * @param {number} alpha The current maximum value.
   * @param {number} beta The current minimum value.
   * @param {object} board The configuration of the game.
   * @returns {object} The best score and move.
  */
  function alphabeta(depth, player, alpha, beta, board) {
    var nextMoves = getValidMoves(board, player);
    var score;
    var bestMove = -1;

    if(depth === 0) {
      score = evaluateSingleBoard(board);
      return [score, bestMove];
    } else {
      for(var i = 0; i < nextMoves.length; i++) {
        var m = nextMoves[i];
        // Make the move
        var newGameState = makeSingleMove(m, board);

        // If player is maximizing (enemy)
        if(player === 'enemy') {
          score = alphabeta(depth - 1, 'player', alpha, beta, newGameState)[0];
          if(score > alpha) {
            alpha = score;
            bestMove = m;
          }
        } 

        // Player is minimizing (player)
        else {  
          score = alphabeta(depth - 1, 'enemy', alpha, beta, newGameState)[0];
          if(score < beta) {
            beta = score;
            bestMove = m;
          }
        }
        if(alpha >= beta) {
          break;
        }  
      }
      if(player === 'enemy') {
        return [alpha, bestMove]; 
      } else {
        return [beta, bestMove];
      }
    }
  }

  /**
   * Computes the best move for the player using minimax.
   * @param {number} depth How many moves to look ahead.
   * @param {string} player The max player.
   * @param {object} board The board to compute on.
   * @returns {list} The best score and best move index.
  */
  function minimax(depth, player, board) {
    // Get available moves
    var nextMoves = getValidMoves(board, player);

    // Set maximizing and minimizing value for player
    var best;

    if(player === 'enemy') {
      best = -1000;
    } else {
      best = 1000;
    } 
  
    var current;
    var bestMove = -1;

    // Rank board at lowest depth
    if(depth === 0) {
      best = evaluateSingleBoard(board);
    } else {
      for(var i = 0; i < nextMoves.length; i++) {
        var m = nextMoves[i];
        var newGameState = makeSingleMove(m, board);
        
        if(player === 'enemy') {
          current = minimax(depth - 1, 'player', newGameState)[0];
          if(current > best) {
            best = current;
            bestMove = m;
          }
        } 

        else {
          current = minimax(depth - 1, 'enemy', newGameState)[0];
          if(current < best) {
            best = current;
            bestMove = m;
          }
        }
      }
    }

    return [best, bestMove];
  }

  // Let the enemy move first
  toggleTurn();

  /*********************
  *   EVENT HANDLERS   *
  *********************/
  
  // Detect clicks on enemy bench
  $('.enemyRow > .square').click(function() {
    // If we had a piece selected and then clicked the bench,
    // We cancel the previous selection
    selectedEnemyBenchPiece = false;
    selectedCell = false;
    // We select a piece from our bench
    if(!selectedEnemyBenchPiece && enemyTurn) {
      // Grab position of bench
      var x = $(this).data('x');
      $(this).css('border-color', 'red');
      $(this).css('border-style', 'solid');
      selectedEnemyBenchPiecePosition.col = x;
      debugPanel("\n");
      debugPanel("  Enemy is trying to place the bench piece: " + _enemyBench[selectedEnemyBenchPiecePosition.col]);
      // If the bench has a piece
      if(isBenchOccupied(_enemyBench, x)) {
        selectedEnemyBenchPiece = true; 
      }
    } 
  });

  // Detect clicks on player bench
  $('.playerRow > .square').click(function() {
    $(this).css('border-color', 'red');
    $(this).css('border-style', 'solid');
    selectedPlayerBenchPiece = false;
    var selectedCell = false;
    if(!selectedPlayerBenchPiece && playerTurn) {
      var x = $(this).data('x');
      selectedPlayerBenchPiecePosition.col = x;
      debugPanel("\n");
      debugPanel("  Player is trying to place the bench piece: " + _playerBench[selectedPlayerBenchPiecePosition.col] + ' in col: ' + x);
      if(isBenchOccupied(_playerBench, x)) {
        selectedPlayerBenchPiece = true;
      }
    }
  });

  $('.row > .square').click(function() {
    $(this).css('border-color', 'red');
    $(this).css('border-style', 'solid');
    // We selected an enemy bench piece, so we check and place it
    if(selectedEnemyBenchPiece && !gameOver) {
      var x = $(this).data('x');
      var y = $(this).data('y');
      if(!isOccupied(x, y)) {

        // Cell is not occupied, we can place the piece!
        // Get square to place tile down
        var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();

        // Add CSS class to selected tile
        $a.addClass(_enemyBench[selectedEnemyBenchPiecePosition.col]);

        // We are placing a chick from our bench, so it cannot promote unless moved
        if(selectedEnemyBenchPiecePosition.col == 'enemyChick') {
          movedEnemyChick = false;
        }

        debugPanel("\n");
        debugPanel("  Enemy has placed the bench piece: " + _enemyBench[selectedEnemyBenchPiecePosition.col] + " successfully!");

        // Update internal game board state with name of placed piece
        _board[x][y] = _enemyBench[selectedEnemyBenchPiecePosition.col];

        // Remove the CSS class for the corresponding cell
        removeFromBench(selectedEnemyBenchPiecePosition.col, _enemyBench[selectedEnemyBenchPiecePosition.col], 'enemy');

        // Clear bench position
        _enemyBench[selectedEnemyBenchPiecePosition.col] = -1;

        // Reset variables storing bench piece
        selectedEnemyBenchPiecePosition.col = 0;
        selectedEnemyBenchPiece = false;

        // After placing a piece, we end this player's turn
        toggleTurn();

        // Reset grid styles
        clearCells();

        // Increment the turn
        incrementTurn();
      } 

      // We tried to place the piece on an occupied cell, reset
      else {
        debugPanel("\n");
        debugPanel("  Enemy tried to place the piece: " + _enemyBench[selectedEnemyBenchPiecePosition.col] + " in an occupied cell");
        selectedEnemyBenchPiece = false;
        // Reset grid styles
        clearCells();
      }
    } 

    // We selected a player bench piece, check and place it
    else if(selectedPlayerBenchPiece && !gameOver) {
      var x = $(this).data('x');
      var y = $(this).data('y');
      $(this).css('border-color', 'red');
      $(this).css('border-style', 'solid');
      if(!isOccupied(x, y)) {

        // Cell is not occupied, we can place the piece!
        // Get square to place tile down
        var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();

        // Add CSS class to selected tile
        $a.addClass(_playerBench[selectedPlayerBenchPiecePosition.col]);

        // We are placing a chick from our bench, so it cannot promote unless moved
        if(_playerBench[selectedPlayerBenchPiecePosition.col] == 'playerChick') {
          movedPlayerChick = false;
        } 

        debugPanel("\n");
        debugPanel("  Player has placed the bench piece: " + _playerBench[selectedPlayerBenchPiecePosition.col] + " successfully!");

        // Update internal game board state with name of placed piece
        _board[x][y] = _playerBench[selectedPlayerBenchPiecePosition.col];

        // Remove CSS class for position
        removeFromBench(selectedPlayerBenchPiecePosition.col, _playerBench[selectedPlayerBenchPiecePosition.col], 'player');

        // Clear bench position
        _playerBench[selectedPlayerBenchPiecePosition.col] = -1;

        // Clear holder variables
        selectedPlayerBenchPiecePosition.col = 0;
        selectedPlayerBenchPiece = false;

        // After placing a piece, we end this player's turn
        toggleTurn();

        // Reset grid styles
        clearCells();
        // Increment the turn
        incrementTurn();
      }

      // We tried to put our bench piece on an occupied cell
      else {
        debugPanel("\n");
        debugPanel("  Player tried to place the piece: " + _playerBench[selectedPlayerBenchPiecePosition.col] + " in an occupied space");
        selectedPlayerBenchPiece = false;
      }
    }

    // We are selecting a game piece
    else if(!selectedCell && !gameOver) {
      var x = $(this).data('x');
      var y = $(this).data('y');
      $(this).css('border-color', 'red');
      $(this).css('border-style', 'solid');
      if(isOccupied(x, y) && validSelection(x, y)) {
        // We've selected a piece to move
        selectedCell = true;
        // Update the position of our selected piece
        selectedPosition.row = x;
        selectedPosition.col = y;
      }
    }

    // Now to attack
    else if(selectedCell) {
      // Grab the x, y coordinates of the attacked square
      var x = $(this).data('x');
      var y = $(this).data('y');
      $(this).css('border-color', 'red');
      $(this).css('border-style', 'solid');
      // If the square is occupied, we attack!
      if(isOccupied(x, y)) {
        var attackedName = _board[x][y];
        var attackerName = _board[selectedPosition.row][selectedPosition.col];
        attackPosition.row = x, attackPosition.col = y;
        differencePosition.row = attackPosition.row - selectedPosition.row;
        differencePosition.col = attackPosition.col - selectedPosition.col;
        if(validMove(attackerName)) {
          // Add attacked piece to respective bench
          addToBench(attackedName);

          // If we moved a chick, it is valid for promotion
          if(attackerName == 'playerChick') {
            movedPlayerChick = true;
            playerChickPosition.row = x;
            playerChickPosition.col = y;
          } else {
            movedPlayerChick = false;
          }

          if (attackerName == 'enemyChick') {
            movedEnemyChick = true;
            enemyChickPosition.row = x;
            enemyChickPosition.col = y;
          } else {
            movedEnemyChick = false;
          }

          var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
          var $p = ($('.square[data-x=' + selectedPosition.row + '][data-y=' + selectedPosition.col + ']')).children();
          $p.removeClass(attackerName);
          $a.removeClass(attackedName);
          $a.addClass(attackerName);
          if(playerTurn) {
            debugPanel('\n');
            debugPanel('  The player attacked the piece: ' + _board[attackPosition.row][attackPosition.col] + ' at position: ' + attackPosition.row + ', ' + attackPosition.col);
          }

          if(enemyTurn) {
            debugPanel('\n');
            debugPanel('  The enemy attacked the piece: ' + _board[attackPosition.row][attackPosition.col] + ' at position: ' + attackPosition.row + ', ' + attackPosition.col);
          }
          // Update respective bench
          // _benchPiece(attackedName);
          // Update new internal board positions
          _board[x][y] = _board[selectedPosition.row][selectedPosition.col];
          _board[selectedPosition.row][selectedPosition.col] = -1;
          // Reset selected cells
          selectedCell = false;
          attackedCell = false;
          // Reset grid styles
          clearCells();
          // Check if the game is over 
          isGameOver(_board);
          if(!gameOver) {
            // Check if a chick should be promoted
            checkChicks();
            if(enemyChickPromotion) {
              var $enemyChick = ($('.square[data-x=' + enemyChickPosition.row + '][data-y=' + enemyChickPosition.col + ']')).children();
              $enemyChick.removeClass('enemyChick');
              $enemyChick.addClass('enemyHen');
              // Reset position of enemy chick
              enemyChickPosition.row = 0;
              enemyChickPosition.col = 0;
              // Reset promotion flag
              enemyChickPromotion = false;
              _board[x][y] = 'enemyHen';
            } else if (playerChickPromotion) {
              var $playerChick = ($('.square[data-x=' + playerChickPosition.row + '][data-y=' + playerChickPosition.col + ']')).children();
              $playerChick.removeClass('playerChick');
              $playerChick.addClass('playerHen');
              // Reset position of enemy chick
              playerChickPosition.row = 0;
              playerChickPosition.col = 0;
              // Reset promotion flag
              playerChickPromotion = false;
              _board[x][y] = 'playerHen';
            }
            // Toggle the turn
            toggleTurn();

            // Increment turn
            incrementTurn();
          }
        } 
      } else {
        // Square selected is not occupied, we simply move our piece
        attackPosition.row = x;
        attackPosition.col = y;
        differencePosition.row = attackPosition.row - selectedPosition.row;
        differencePosition.col = attackPosition.col - selectedPosition.col;
        var attackerName = _board[selectedPosition.row][selectedPosition.col];
        if(validMove(attackerName)) {

          // If we moved a chick, it is valid for promotion
          if(attackerName == 'playerChick') {
            movedPlayerChick = true;
            playerChickPosition.row = x;
            playerChickPosition.col = y;
          } else {
            movedPlayerChick = false;
          }

          if (attackerName == 'enemyChick') {
            movedEnemyChick = true;
            enemyChickPosition.row = x;
            enemyChickPosition.col = y;
          } else {
            movedEnemyChick = false;
          }
          var $a = ($('.square[data-x=' + x + '][data-y=' + y + ']')).children();
          var $p = ($('.square[data-x=' + selectedPosition.row + '][data-y=' + selectedPosition.col + ']')).children();
          $p.removeClass(attackerName);
          $a.addClass(attackerName);
          if(playerTurn) {
            debugPanel('\n');
            debugPanel('  The player moved the piece: ' + _board[selectedPosition.row][selectedPosition.col] + ' to position: ' + attackPosition.row + ', ' + attackPosition.col);
          }

          if(enemyTurn) {
            debugPanel('\n');
            debugPanel('  The enemy moved the piece: ' + _board[selectedPosition.row][selectedPosition.col] + ' to position: ' + attackPosition.row + ', ' + attackPosition.col);
          }
          // Update new internal board positions
          _board[x][y] = _board[selectedPosition.row][selectedPosition.col];
          _board[selectedPosition.row][selectedPosition.col] = -1;
          selectedCell = false;
          attackedCell = false;
          // Reset grid styles
          clearCells();
          // Check if the game is over 
          isGameOver(_board);
          if(!gameOver) {
            // Check if a chick should be promoted
            checkChicks();
            // Enemy Chick needs to be promoted
            if(enemyChickPromotion) {
              var $enemyChick = ($('.square[data-x=' + enemyChickPosition.row + '][data-y=' + enemyChickPosition.col + ']')).children();
              $enemyChick.removeClass('enemyChick');
              $enemyChick.addClass('enemyHen');
              // Reset position of enemy chick
              enemyChickPosition.row = 0;
              enemyChickPosition.col = 0;
              // Reset promotion flag
              enemyChickPromotion = false;
              _board[x][y] = 'enemyHen';
            } else if (playerChickPromotion) {
              var $playerChick = ($('.square[data-x=' + playerChickPosition.row + '][data-y=' + playerChickPosition.col + ']')).children();
              $playerChick.removeClass('playerChick');
              $playerChick.addClass('playerHen');
              // Reset position of enemy chick
              playerChickPosition.row = 0;
              playerChickPosition.col = 0;
              // Reset promotion flag
              playerChickPromotion = false;
              _board[x][y] = 'playerHen';
            }
            // Toggle the turn
            toggleTurn();

            // Increment turn
            incrementTurn();
          }
        }
      }
    }
  });

  // Programmatic click!
  // $('.row > .square[data-x=' + 2 + '][data-y=' + 1 + ']').click();
});