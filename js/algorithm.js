define(function() {

	// Constant employees JSON file path.
	var JSONPath = "data/employees.json";
	// Constant friend id.
	var friendId = "1009";

	// Hook into run button.
	document.getElementById("run").onclick = function() {
		loadPairs(JSONPath);
	};

	//
	// Calculate function.
	//
	function calculate(pairsArray) {

		// For testing purposes.
		// pairsArray = generateRandomPairs(10000, 999);

		// Instantiate 1001 x 1001 matrix.
		var pairsMatrix = new Array(1001);
		for ( var i = 0; i < 1001; ++i) {
			pairsMatrix[i] = new Array(1001);
			for ( var j = 0; j < 1001; ++j) {
				pairsMatrix[i][j] = 0;
			}
		}

		// Fill in matrix values.
		for ( var i = 0; i < pairsArray.length; ++i) {
			var pair = pairsArray[i].split(" ");
			pairsMatrix[pair[0] - 1000][pair[1] - 2000] = 1;
			++pairsMatrix[pair[0] - 1000][1000];
			++pairsMatrix[1000][pair[1] - 2000];
		}

		// Choose lucky ones from full list.
		var luckyOnes = findLuckyOnes(copyMatrix(pairsMatrix));
		// Remove friend from project matrix.
		if (friendId < 2000) {
			clearRow(pairsMatrix, friendId - 1000);
		} else {
			clearColumn(pairsMatrix, friendId - 2000);
		}
		// Choose lucky ones from remaining matrix.
		var luckyOnesWithFriend = [ friendId ]
				.concat(findLuckyOnes(pairsMatrix));
		// If list containing friend is shorter or same length..
		if (luckyOnesWithFriend.length <= luckyOnes.length) {
			luckyOnes = luckyOnesWithFriend;
		}

		// Output selected pairs into selectees list.
		var outputList = "";
		for ( var i = 0; i < luckyOnes.length; ++i) {
			outputList += "<li>" + luckyOnes[i] + "</li>";
		}
		document.getElementById("selectees").innerHTML = outputList;
	}

	//
	// Generates random pair array.
	//
	function generateRandomPairs(count, maxId) {
		pairs = [];
		for ( var i = 0; i < count; ++i) {
			var pair = Math.floor(Math.random() * maxId + 1000) + " "
					+ Math.floor(Math.random() * maxId + 2000);
			if (pairs.indexOf(pair) == -1) {
				pairs.push(pair);
			}
		}
		return pairs;
	}

	//
	// Creates a copy of the matrix.
	//
	function copyMatrix(pairsMatrix) {
		var matrix = new Array();
		for ( var i = 0; i < 1001; ++i) {
			matrix[i] = [].concat(pairsMatrix[i]);
		}
		return matrix;
	}

	//
	// Actual selector algorithm function.
	//
	function findLuckyOnes(pairsMatrix) {
		// Selected array is list of employee ids selected to Barbados.
		var selected = [];
		// Continue while matrix is not empty.
		while (!isEmptyMatrix(pairsMatrix)) {
			var maximum = 0;
			var maximumArray = [];
			for ( var i = 0; i < 1000; ++i) {
				var max = Math.max(countRow(pairsMatrix, i), countColumn(
						pairsMatrix, i));
				if (max > maximum) {
					maximum = max;
					maximumArray = [];
				}
				if (countRow(pairsMatrix, i) == maximum) {
					maximumArray.push(i + 1000);
				}
				if (countColumn(pairsMatrix, i) == maximum) {
					maximumArray.push(i + 2000);
				}
			}

			// Calculate number of intersections.
			var maximumIntersections = 0;
			for ( var i = 0; i < maximumArray.length;) {
				var intersections = 0;
				for ( var j = 0; j < maximumArray.length; ++j) {
					if (maximumArray[i] < 2000 && maximumArray[j] >= 2000) {
						var row = maximumArray[i] - 1000;
						var column = maximumArray[j] - 2000;
						if (pairsMatrix[row][column] != 1) {
							++intersections;
						}
					}
					if (maximumArray[i] >= 2000 && maximumArray[j] < 2000) {
						var row = maximumArray[j] - 1000;
						var column = maximumArray[i] - 2000;
						if (pairsMatrix[row][column] != 1) {
							++intersections;
						}
					}
				}
				if (intersections > maximumIntersections) {
					maximumArray.splice(0, i);
					maximumIntersections = intersections;
					i = 1;
				} else if (intersections == maximumIntersections) {
					++i;
				} else {
					maximumArray.splice(i, 1);
				}
			}

			// Calculate number of Helsinki and New York employees.
			var countHelsinki = 0;
			var countNewYork = 0;
			for ( var i = 0; i < maximumArray.length; ++i) {
				if (maximumArray[i] < 2000) {
					++countHelsinki;
				} else {
					++countNewYork;
				}
			}

			// Choose pairs from the city where there are more participants in
			// maximumArray.
			for ( var i = 0; i < maximumArray.length; ++i) {
				if (countHelsinki >= countNewYork && maximumArray[i] < 2000) {
					clearRow(pairsMatrix, maximumArray[i] - 1000);
					selected.push(maximumArray[i]);
				} else if (countNewYork > countHelsinki
						&& maximumArray[i] >= 2000) {
					clearColumn(pairsMatrix, maximumArray[i] - 2000);
					selected.push(maximumArray[i]);
				}
			}

		}

		return selected;
	}

	//
	// Returns row count. Row count is value how many pairs Helsinki employee
	// has in New York.
	//
	function countRow(pairsMatrix, row) {
		return pairsMatrix[row][1000];
	}

	//
	// Returns column count. Column count is value how many pairs New York
	// employee has in Helsinki.
	//
	function countColumn(pairsMatrix, column) {
		return pairsMatrix[1000][column];
	}

	//
	// Clears row from matrix.
	//
	function clearRow(pairsMatrix, row) {
		for ( var column = 0; column < 1000; ++column) {
			if (pairsMatrix[row][column] == 1) {
				--pairsMatrix[1000][column];
			}
			pairsMatrix[row][column] = 0;
		}
		pairsMatrix[row][1000] = 0;
	}

	//
	// Clears column from matrix.
	//
	function clearColumn(pairsMatrix, column) {
		for ( var row = 0; row < 1000; ++row) {
			if (pairsMatrix[row][column] == 1) {
				--pairsMatrix[row][1000];
			}
			pairsMatrix[row][column] = 0;
		}
		pairsMatrix[1000][column] = 0;
	}

	//
	// Returns true if matrix is empty.
	//
	function isEmptyMatrix(pairsMatrix) {
		var count = 0;
		for ( var i = 0; i < 1000; ++i) {
			count += countRow(pairsMatrix, i);
		}
		return count == 0;
	}

	//
	// Loads employee pairs JSON file and calls calculate -function
	// with its contents.
	//
	function loadPairs(pathJSON) {
		// IE7+, FF, Chrome, Opera, Safari
		var client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (client.readyState == 4 && client.status == 200) {
				calculate(JSON.parse(client.responseText));
			}
		}
		client.open("GET", pathJSON, true);
		client.setRequestHeader("Pragma", "no-cache");
		client.send();
	}

})
