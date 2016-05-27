function processTransaction(responseObj) {
	var parsed = JSON.parse(responseObj);
	var transactions = parsed.transactions;
	var transactionOutput = {};
	var transactionTime;
	if (transactions.length > 0) {
		for (i = 0; i < transactions.length; i++) {
			var transactionTime = transactions[i]['transaction-time'];
			transactionTime = new Date(transactionTime);
			var transactionDate = transactionTime.getFullYear().toString()
					+ "-" + (transactionTime.getMonth() + 1).toString();
			if (!transactionOutput.hasOwnProperty(transactionDate)) {
				transactionOutput[transactionDate] = {};
				transactionOutput[transactionDate].income = 0;
				transactionOutput[transactionDate].spent = 0;
			}
			if (transactions[i].amount >= 0) {
				transactionOutput[transactionDate].income = transactionOutput[transactionDate].income
						+ transactions[i].amount;
			} else {
				transactionOutput[transactionDate].spent = transactionOutput[transactionDate].spent
						- transactions[i].amount;
			}
		}
		var averageOutput = processAverage(transactionOutput);
		return averageOutput;
	}
	return null;
};
function processAverage(transactionOutput) {
	var totalMonths = 0;
	var totalIncome = 0;
	var totalSpent = 0;
	var IncomeAverage;
	var spentAverage;
	for ( var i in transactionOutput) {
		totalIncome = totalIncome + transactionOutput[i]['income'];
		totalSpent = totalSpent + transactionOutput[i]['spent'];
		totalMonths = totalMonths + 1;
		transactionOutput[i]['income'] = processAmount(transactionOutput[i]['income']);
		transactionOutput[i]['spent'] = processAmount(transactionOutput[i]['spent']);
	}
	if (totalIncome == 0) {
		IncomeAverage = "$" + totalIncome.toFixed(2);
	} else {
		IncomeAverage = processAmount((totalIncome / totalMonths).toFixed(2));
	}
	if (totalSpent == 0) {
		spentAverage = "$" + totalSpent.toFixed(2);
	} else {
		spentAverage = processAmount((totalSpent / totalMonths).toFixed(2));
	}
	transactionOutput.average = {
		spent : spentAverage,
		income : IncomeAverage
	};
	return transactionOutput;
}

function ignoreDonutTransaction(responseObj){
	//“Krispy Kreme Donuts” or “DUNKIN #336784”
	var parsed = JSON.parse(responseObj);
	var transactions = parsed.transactions;
	var transactionOutput = {};
	var transactionTime;
	if (transactions.length > 0) {
		for (i = 0; i < transactions.length; i++) {
			var transactionTime = transactions[i]['transaction-time'];
			transactionTime = new Date(transactionTime);
			var transactionDate = transactionTime.getFullYear().toString()
					+ "-" + (transactionTime.getMonth() + 1).toString();
			if (!transactionOutput.hasOwnProperty(transactionDate)) {
				transactionOutput[transactionDate] = {};
				transactionOutput[transactionDate].income = 0;
				transactionOutput[transactionDate].spent = 0;
			}
			if (transactions[i].amount >= 0) {
				transactionOutput[transactionDate].income = transactionOutput[transactionDate].income
						+ transactions[i].amount;
			} else {
				if(transactions[i]['merchant'] !== 'Krispy Kreme Donuts' && transactions[i]['merchant'] !== 'DUNKIN #336784'){
					transactionOutput[transactionDate].spent = transactionOutput[transactionDate].spent - transactions[i].amount;
				}
			}
		}
		var averageOutput = processAverage(transactionOutput);

		return averageOutput;
	}
	return null;
}

function processAmount(amount){
	return "$" + (amount/10000).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
function displayTransactionSummary(responseObj) {
	var transactionOutput = processTransaction(responseObj);
	var str = eval('(' + jsFriendlyJSONStringify(JSON.stringify(transactionOutput)) + ')');
	drawTable(transactionOutput);
	writeToDom(str);
}

function displayIgnoreDonutSummary(responseObj) {
	var transactionOutput = ignoreDonutTransaction(responseObj);
	var str = eval('(' + jsFriendlyJSONStringify(JSON.stringify(transactionOutput)) + ')');
	drawIgnoreDonutSummaryTable(transactionOutput);
	writeToIgnoreDonut(str);
}

function writeToDom(content) {
	$("#transactionSummaryJSON").append("<br><b>Level Money Transaction Summary in JSON</b><br><br>" + content );
}

function writeToIgnoreDonut(content) {
	$("#ignoreDonutSummaryJSON").append("<br><b>Level Money Ignore Donuts Transaction Summary in JSON</b><br><br>" + content);
}
function jsFriendlyJSONStringify(s) {
	return JSON.stringify(s, null, 2).replace(/\u2028/g, '\\u2028').replace(
			/\u2029/g, '\\u2029').replace(/},/g, '},<br>');
}
function drawTable(data) {
	$("#transactionSummary").append("<b>Level Money Transaction Summary</b><br><br>");
	$("#DataTable").append("<tr><th>Month</th><th>Income</th><th>Spent</th></tr>");
    for (var i in data) {
    	if(i !== "average"){
    		var row = $("<tr />");
            $("#DataTable").append(row);
            row.append($("<td>" + i + "</td>"));
            row.append($("<td>" + data[i].income + "</td>"));
            row.append($("<td>" + data[i].spent + "</td>"));
    	}
    }
    $("#averageIncome").append("<br>Average Income : <b>" + data.average.income +"</b>");
    $("#averageExpense").append("Average Spent : <b>" +data.average.spent +"</b>");
}



function drawIgnoreDonutSummaryTable(data) {
	debugger;
	$("#ignoreDonut").append("<br><b>Level Money Ignore Donuts Transaction Summary</b><br><br>");
	$("#ignoreDonutTable").append("<tr><th>Month</th><th>Income</th><th>Spent</th></tr>");
    for (var i in data) {
    	if(i !== "average"){
    		var row = $("<tr />");
            $("#ignoreDonutTable").append(row);
            row.append($("<td>" + i + "</td>"));
            row.append($("<td>" + data[i].income + "</td>"));
            row.append($("<td>" + data[i].spent + "</td>"));
    	}
    }
    $("#averageIgnoreDonutIncome").append("<br>Average Income : <b>" + data.average.income +"</b>");
    $("#averageIgnoreDonutExpense").append("Average Spent : <b>" +data.average.spent +"</b>");
}





function onReady() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST",
			"https://prod-api.level-labs.com/api/v2/core/get-all-transactions",
			true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onloadend = function(response) {
		displayTransactionSummary(this.response);
		displayIgnoreDonutSummary(this.response);
	};
	xhr.onerror = function(err) {
		document.getElementById('menuPanel').textContent = "Level Money Transaction REST API is down and not working. Please try again later";
	};
	args = {
		"args" : {
			"uid" : 1110590645,
			"token" : "90B366006F5834DFC493B11880D6FBDC",
			"api-token" : "AppTokenForInterview",
			"json-strict-mode" : false,
			"json-verbose-response" : false
		}
	};
	xhr.send(JSON.stringify(args));
}