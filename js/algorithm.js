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
		// Generate dictionary into which we gather all pairs working together.
		var countDict = {};
		for ( var i = 0; i < pairs.length; ++i) {
			var pair = pairs[i].split(" ");
			for ( var j = 0; j < 2; ++j) {
				if (countDict[pair[j]] == null) {
					countDict[pair[j]] = [];
				}
				countDict[pair[j]].push(pair[1 - j]);
			}
		}

		// First calculate minimum travelers value from original dictionary.
		var luckyOnes = findLuckyOnes(countDict, []);

		// Then create an array where your friend is chosen to Barbados and
		// calculate how many attendees it would take.
		var luckyOnesWithFriend = findLuckyOnes(countDict, [ friendId ]);

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

	//
	// Choose employees to go to Barbados from pairs array.
	//
	function findLuckyOnes(dict, luckyOnes) {

		// Generate array from dictionary. 'id' is employee id and 'partners' is
		// an array of employees the person works with.
		var countArray = [];
		for (key in dict) {
			countArray.push({
				id : key,
				partners : [].concat(dict[key])
			});
		}

		// Remove already chosen employees from countArray.
		for ( var i = 0; i < luckyOnes.length; ++i) {
			removeAndDecrease(countArray, luckyOnes[i]);
		}

		// Algorithm works as follows;
		// 1. Sort array plus put employees with similarly many projects into
		// random order.
		// 2. Choose ids with highest count and remove them from countArray.
		while (countArray.length > 0) {
			// Sort and randomize countArray.
			countArray.sort(function(a, b) {
				if (b['partners'].length == a['partners'].length) {
					return Math.random() >= 0.5 ? 1 : -1;
				}
				return b['partners'].length - a['partners'].length;
			});

			// maxLength is the the first item partners count.
			var maxLength = countArray[0]['partners'].length;
			// maxIndex is the highest index containing maxLength partners.
			var maxIndex = 1;
			while (maxIndex < countArray.length) {
				if (countArray[maxIndex]['partners'].length == maxLength) {
					++maxIndex;
				} else {
					break;
				}
			}
			// Iterate over all indices until maxIndex.
			for ( var i = 0; i < maxIndex && i < countArray.length;) {
				var employee = countArray[i];
				// Re-check partners length as it changes during the loop.
				if (employee['partners'].length == maxLength) {
					// Push randIdx id to lucky ones going to Barbados.
					luckyOnes.push(employee['id']);
					// Remove employee with given id from countArray plus from
					// other employee partners list.
					removeAndDecrease(countArray, employee['id']);
				} else {
					++i;
				}
			}
		}

		// Return array of lucky ones ids.
		return luckyOnes;
	}

	//
	// Removes employee with given id from employees list. Additionally removes
	// it from other employees 'partner' lists too. And finally removes all
	// employees whose partner count is zero.
	//
	function removeAndDecrease(employees, id) {
		// Remove given id from employees list and from employees who got it as
		// a partner.
		for ( var i = 0; i < employees.length;) {
			var employee = employees[i];
			if (employee['id'] == id) {
				employees.splice(i, 1);
			} else {
				for ( var j = 0; j < employee['partners'].length;) {
					if (employee['partners'][j] == id) {
						employee['partners'].splice(j, 1);
					} else {
						++j;
					}
				}
				++i;
			}
		}
		// Remove employees whose partner count is zero.
		for ( var i = 0; i < employees.length;) {
			var employee = employees[i];
			if (employee['partners'].length == 0) {
				employees.splice(i, 1);
			} else {
				++i;
			}
		}
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
