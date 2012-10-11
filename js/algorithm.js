define(function() {

	// Constant employees JSON file path.
	var JSONPath = "data/employees.json";
	// Constant friend id.
	var friendId = "1009";

	// Hook into run button.
	document.getElementById("run").onclick = function() {
		loadJSON(JSONPath);
	};

	//
	// Calculate function.
	//
	function calculate(employeesJSON) {

		// First remove line breaks.
		employeesJSON = employeesJSON.replace(/[\r\n]+/g, "");
		// Then ' [ "' from the beginning.
		employeesJSON = employeesJSON.replace(/^\s*\[\s*\"/, "");
		// Then '" ] ' from the end.
		employeesJSON = employeesJSON.replace(/\"\s*\]\s*$/, "");
		// Split pairs from remaining string using '" , "' as separator.
		var pairs = employeesJSON.split(/\"\s*,\s*\"/);
		// Split pairs into 3d array.
		for ( var i = 0; i < pairs.length; ++i) {
			pairs[i] = pairs[i].split(" ");
		}
		
		pairs = [];
		for (var i=0; i<1000; ++i) {
			pairs.push([]);
			pairs[i].push((Math.floor(Math.random() * 999 + 1000)) + "");
			pairs[i].push((Math.floor(Math.random() * 999 + 2000)) + "");
		}

		// First create an array where your friend is chosen to Barbados and
		// calculate how many attendees it would take.
		var pairsWithFriend = pairs.slice(0, pairs.length);
		remove(pairsWithFriend, friendId);
		var luckyOnesWithFriend = findLuckyOnes(pairsWithFriend);
		luckyOnesWithFriend.push(friendId);

		// Then calculate minimum travelers value from original array.
		var luckyOnes = findLuckyOnes(pairs);

		// If array containing your friend is shorter or same length as original
		// array minimum, choose it as output.
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

	function findLuckyOnes(pairs) {
		// Algorithm works as follows;
		// 1. Find ids with highest occurrence count.
		// 2. Choose random id from highest count id array and replace all
		// pairs containing that id with it only.

		// Array for constructing lucky ones ids.
		var luckyOnes = [];

		do {
			// Maximum count variable.
			var maxCount = 0;
			// Array of ids that have maxCount occurrences.
			var maxIds = [];

			// Iterate over all pairs to find maxCount value and corresponding
			// array of ids.
			for ( var i = 0; i < pairs.length; ++i) {
				// Check both ids whether they have higher or equal occurrences
				// compared to maxCount.
				for ( var j = 0; j < pairs[i].length; ++j) {
					if (maxIds.indexOf(pairs[i][j]) != -1) {
						continue;
					}

					// Number of occurrences an id is contained in pairs array.
					var count = countIds(pairs, pairs[i][j]);
					// If count is at least maxCount.
					if (count >= maxCount) {
						// If count is higher than previous maxCount, clear
						// maxIds array.
						if (count > maxCount) {
							maxIds.splice(0, maxIds.length);
						}
						// Add id to maxIds array.
						maxIds.push(pairs[i][j]);
						maxCount = count;
					}
				}
			}

			// If maxCount greater than zero, choose random id from maximum ids
			// array to Barbados travelers.
			if (maxCount > 0) {
				// Iterate over all maxIds plus remove ones from it whose count
				// changes during removal operations.
				while (maxIds.length > 0) {
					// Choose random index.
					var randIdx = Math.floor(Math.random() * maxIds.length);
					// Push randIdx id to lucky ones going to Barbados.
					luckyOnes.push(maxIds[randIdx]);
					// Remove all pairs containing randIdx id and remove ids
					// from maxIds whose count changed during removal operation.
					var removedIds = remove(pairs, maxIds[randIdx]);
					for ( var i = 0; i < removedIds.length; ++i) {
						var idx = maxIds.indexOf(removedIds[i]);
						if (idx != -1) {
							maxIds.splice(idx, 1);
						}
					}
				}
			}
		}
		// Continue while maxCount is higher than zero.
		while (maxCount > 0);

		// Return array of lucky ones ids.
		return luckyOnes;
	}

	//
	// Calculates number of times given id exists
	// in id pairs array. Calculates only items that
	// do have two ids.
	//
	function countIds(pairs, id) {
		var count = 0;
		for ( var i = 0; i < pairs.length; ++i) {
			if (pairs[i].indexOf(id) != -1) {
				++count;
			}
		}
		return count;
	}

	//
	// Remove pairs that contain given id.
	//
	function remove(pairs, id) {
		var removedIds = [ id ];
		// Iterate through all pairs.
		for ( var i = 0; i < pairs.length;) {
			// If either one of the ids equals id..
			var idx = pairs[i].indexOf(id);
			if (idx != -1) {
				removedIds.push(pairs[i][1 - idx]);
				pairs.splice(i, 1);
			} else {
				++i;
			}
		}
		return removedIds;
	}

	//
	// Loads employees JSON file and calls calculate -function
	// with its contents.
	//
	function loadJSON(path) {
		// IE7+, FF, Chrome, Opera, Safari
		var client = new XMLHttpRequest();
		client.onreadystatechange = function() {
			if (client.readyState == 4 && client.status == 200) {
				calculate(client.responseText);
			}
		}
		client.open("GET", path, true);
		client.send();
	}

})
