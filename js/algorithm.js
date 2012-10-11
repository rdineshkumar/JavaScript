//
// Attach 'loadEmployees' -function to 'run' -button.
//
window.onload = function() {
	document.getElementById("run").onclick = loadEmployees;
};

//
// Calculate function.
//
function calculate(employeesJSON) {

	// Friend id constant.
	var friendId = 1009;

	// First remove line breaks.
	employeesJSON = employeesJSON.replace(/[\r\n]+/g, "");
	// Then ' [ "' from the beginning.
	employeesJSON = employeesJSON.replace(/^\s*\[\s*\"/, "");
	// Then '" ] ' from the end.
	employeesJSON = employeesJSON.replace(/\"\s*\]\s*$/, "");
	// Split pairs from remaining string using '" , "' as separator.
	var pairs = employeesJSON.split(/\"\s*,\s*\"/);

	// First create an array where your friend is chosen to Barbados and
	// calculate how many attendees it would take.
	var pairsWithFriend = [].concat(pairs);
	choose(pairsWithFriend, friendId);
	findLuckyOnes(pairsWithFriend);

	// Then calculate minimum travelers value from original array.
	findLuckyOnes(pairs);

	// If array containing your friend is shorter or same length as original
	// array minimum, choose it as output.
	if (pairsWithFriend.length <= pairs.length) {
		pairs = pairsWithFriend;
	}

	// Output selected pairs into selectees list.
	var outputList = "";
	for ( var i = 0; i < pairs.length; ++i) {
		outputList += "<li>" + pairs[i] + "</li>";
	}
	document.getElementById("selectees").innerHTML = outputList;
}

function findLuckyOnes(pairs) {
	// Algorithm works as follows;
	// 1. Find ids with highest occurrence count.
	// 2. Choose random id from highest count id array and replace all
	// pairs containing that id with it only.
	do {
		// Maximum count variable.
		var maxCount = 0;
		// Array of ids that have maxCount occurrences.
		var maxIds = [];

		// Iterate over all pairs to find maxCount value and corresponding array
		// of ids.
		for ( var i = 0; i < pairs.length; ++i) {
			// First check that pairs item contains pair of ids. Otherwise it
			// has been replaced with one id only (going to Barbados) and ought
			// to be skipped.
			var ids = pairs[i].split(" ");
			if (ids.length != 2) {
				continue;
			}
			// Check both ids whether they have higher or equal occurrences
			// compared to maxCount.
			for ( var j = 0; j < ids.length; ++j) {
				// Number of occurrences an id is contained in pairs array.
				var count = countIds(pairs, ids[j]);
				// If count is at least maxCount.
				if (count >= maxCount) {
					// If count is higher than previous maxCount, clear maxIds
					// array.
					if (count > maxCount) {
						maxIds.splice(0, maxIds.length);
					}
					// Add id to maxIds array.
					maxIds.splice(0, 0, ids[j]);
					maxCount = count;
				}
			}
		}

		// If maxCount greater than zero, choose random id from maximum ids
		// array to Barbados.
		if (maxCount > 0) {
			choose(pairs, maxIds[Math.floor(Math.random() * maxIds.length)]);
		}
	}
	// Continue while maxCount is higher than zero.
	while (maxCount > 0);
}

//
// Calculates number of times given id exists
// in id pairs array. Calculates only items that
// do have two ids.
//
function countIds(pairs, id) {
	var count = 0;
	for ( var i = 0; i < pairs.length; ++i) {
		var ids = pairs[i].split(" ");
		if (ids.length == 2) {
			if (ids[0] == id) {
				++count;
			}
			if (ids[1] == id) {
				++count;
			}
		}
	}
	return count;
}

//
// Checks if array of ids contains given id.
//
function contains(ids, id) {
	// Iterate over ids array and search for given id.
	for ( var i = 0; i < ids.length; ++i) {
		if (ids[i] == id) {
			return true;
		}
	}
	return false;
}

//
// Replaces a pair that contains given id with id only.
//
function choose(pairs, id) {
	// First occurrence is replaced, latter ones are removed.
	var replace = true;

	// Iterate through all pairs.
	for ( var i = 0; i < pairs.length;) {
		// Find ids from pair.
		var ids = pairs[i].split(" ");
		// If there are two ids and either one equals id..
		if (ids.length == 2 && (ids[0] == id || ids[1] == id)) {
			// Replace pair with id string.
			if (replace) {
				pairs.splice(i++, 1, id + "");
				replace = false;
			}
			// Otherwise remove pair.
			else {
				pairs.splice(i, 1);
			}
		} else {
			++i;
		}
	}
}

//
// Loads employees.json file and calls calculate -function
// with its contents.
//
function loadEmployees() {
	// IE7+, FF, Chrome, Opera, Safari
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	// IE5, IE6
	else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			calculate(xmlhttp.responseText);
		}
	}
	xmlhttp.open("GET", "data/employees.json", true);
	xmlhttp.send();
}
