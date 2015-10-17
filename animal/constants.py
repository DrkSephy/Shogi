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