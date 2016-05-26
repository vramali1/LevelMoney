function processTransaction(responseObj) {
	var parsed = JSON.parse(responseObj);
	var transactions = parsed.transactions;
	var transactionOutput = {};
	var transactionTime;
	if (transactions) {
		for (i = 0; i < transactions.length; i++) {
			var transactionTime = transactions[i]['transaction-time'];
			if (transactionTime) {
				transactionTime = new Date(transactionTime);
				var transactionDate = transactionTime.getFullYear().toString()
						+ "-" + transactionTime.getDate().toString();
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
		}
	}
	var averageOutput = processAverage(transactionOutput);
	return JSON.stringify(transactionOutput);
};
function processAverage(transactionOutput){
	var totalMonths = transactionOutput.length;
	var totalIncome = 0;
	var totalSpent = 0;
	
	
	for(i = 0; i < totalMonths;i++){
		
		totalIncome  = totalIncome +  transactionOutput[i]['income'];
		totalSpent  = totalIncome +  transactionOutput[i]['spent'];
		transactionOutput[i]['income'] = "$" + transactionOutput[i]['income'];
		transactionOutput[i]['spent'] = "$" + transactionOutput[i]['spent'];
		
	}
	var IncomeAverage = totalIncome/totalMonths;
	var spentAverage = totalSpent/totalMonths;
	console.log(transactionOutput);
	
	/*
	{"2014-10": {"spent": "$200.00", "income": "$500.00"},
	"2014-11": {"spent": "$1510.05", "income": "$1000.00"},
...
	"2015-04": {"spent": "$300.00", "income": "$500.00"},
	"average": {"spent": "$750.00", "income": "$950.00"}}*/
	
	
	
	
}



function displayTransactionSummary(responseObj) {

	var transactionOutput = processTransaction(responseObj);
	var pretty = JSON.stringify(transactionOutput, null, 2);
	document.getElementById('menuPanel').textContent = pretty;
}

function onReady() {
	debugger;
	var me = this;
	var xhr = new XMLHttpRequest();
	xhr.open("POST",
			"https://prod-api.level-labs.com/api/v2/core/get-all-transactions",
			true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', 'application/json');
	debugger;
	xhr.onloadend = function(response) {
		processTransaction(this.response);
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