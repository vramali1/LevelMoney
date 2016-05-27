function processTransaction(responseObj) {
	var parsed = JSON.parse(responseObj);
	var transactions = parsed.transactions;
	var transactionOutput = {};
	var transactionTime;
	if (transactions.length > 0) {
		for (i = 0; i < transactions.length; i++) {
			var transactionTime = transactions[i]['transaction-time'];
			// if (transactionTime) {
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
			// }
		}
		var averageOutput = processAverage(transactionOutput);

		return JSON.stringify(averageOutput);
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
		transactionOutput[i]['income'] = "$"
				+ (transactionOutput[i]['income']).toFixed(2).replace(
						/(\d)(?=(\d{3})+\.)/g, "$1,");
		transactionOutput[i]['spent'] = "$"
				+ transactionOutput[i]['spent'].toFixed(2).replace(
						/(\d)(?=(\d{3})+\.)/g, "$1,");
	}
	if (totalIncome == 0) {
		IncomeAverage = "$" + totalIncome.toFixed(2);
	} else {
		IncomeAverage = "$"
				+ (totalIncome / totalMonths).toFixed(2).replace(
						/(\d)(?=(\d{3})+\.)/g, "$1,");
	}
	if (totalSpent == 0) {
		spentAverage = "$" + totalSpent.toFixed(2);
	} else {
		spentAverage = "$"
				+ (totalSpent / totalMonths).toFixed(2).replace(
						/(\d)(?=(\d{3})+\.)/g, "$1,");
	}
	transactionOutput.average = {
		spent : spentAverage,
		income : IncomeAverage
	};
	return transactionOutput;
}
function displayTransactionSummary(responseObj) {
	var transactionOutput = processTransaction(responseObj);
	var str = eval('(' + jsFriendlyJSONStringify(transactionOutput) + ')');
	writeToDom(str);
}
function writeToDom(content) {
	$("#results").append("<div>" + content + "</div>");
}
function jsFriendlyJSONStringify(s) {
	return JSON.stringify(s, null, 2).replace(/\u2028/g, '\\u2028').replace(
			/\u2029/g, '\\u2029').replace(/},/g, '},<br>');
}
function onReady() {
	var me = this;
	var xhr = new XMLHttpRequest();
	xhr.open("POST",
			"https://prod-api.level-labs.com/api/v2/core/get-all-transactions",
			true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onloadend = function(response) {
		displayTransactionSummary(this.response);
	};
	xhr.onerror = function(err) {
		document.getElementById('menuPanel').textContent = "ugh an error. i can't handle this right now.";
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