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
	// Then ' [   "' from the beginning.
	employeesJSON = employeesJSON.replace(/^\s*\[\s*\"/, "");
	// Then '"    ] ' from the end.
	employeesJSON = employeesJSON.replace(/\"\s*\]\s*$/, "");
	// Split pairs from remaining string using '" , "' as separator.
	var pairs = employeesJSON.split(/\"\s*,\s*\"/);
	
	// Replace Helsinki or New York ids with highest
	// participant count. Where participant count
	// is the highest number of projects an employee
	// is participating in.
	for (var i = 0; i < pairs.length; ++i) {
		
		// Get ids.
		var helsinkiId = getHelsinkiId(pairs[i]);
		var newYorkId = getNewYorkId(pairs[i]);
		// Count in how many projects person
		// is participating in.
		var countHelsinki = count(pairs, helsinkiId);
		var countNewYork = count(pairs, newYorkId);
		
		// If counts are equal...
		if (countHelsinki == countNewYork) {
			// Prefer friendId, otherwise choose randomly
			// either New York or Helsinki member.
			if (helsinkiId == friendId || Math.random() > 0.5) {
				pairs.splice(i, 1, helsinkiId);				
			} else {
				pairs.splice(i, 1, newYorkId);
			}
		}
		// Otherwise replace lower count id with
		// higher one.
		else if (countHelsinki > countNewYork) {
			pairs.splice(i, 1, helsinkiId);
		} else {
			pairs.splice(i, 1, newYorkId);
		}
	}
	
	// Remove duplicates.
	for (var i = 0; i < pairs.length; ++i) {
		var id = pairs[i];
		for (var j = i + 1; j < pairs.length; ) {
			if (id == pairs[j]) {
				pairs.splice(j, 1);
			} else {
				++j;
			}
		}
	}
	
	// Output selected pairs into selectees list.
	var outputList = "";
	for (var i = 0; i < pairs.length; ++i) {
		outputList += "<li>" + pairs[i] + "</li>";
	}
	document.getElementById("selectees").innerHTML = outputList;
}

//
// Returns Helsinki id for a pair variable.
//
function getHelsinkiId(pair) {
	return pair.split(" ")[0];
}

//
// Returns New York id for a pair variable.
//
function getNewYorkId(pair) {
	return pair.split(" ")[1];
}

//
// Calculates number of times given id exists
// in pairs array.
//
function count(pairs, id) {
	var count = 0;
	for (var i = 0; i < pairs.length; ++i) {
		if (getHelsinkiId(pairs[i]) == id) {
			++count;
		}
		if (getNewYorkId(pairs[i]) == id) {
			++count;
		}
	}
	return count;
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
