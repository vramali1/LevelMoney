function processTransaction(responseObj){
debugger;
	var parsed = JSON.parse(responseObj);
	var transactions = parsed.transactions;
	var transactionOutput = {};
	var transactionTime;
	//var resultObject = {};
	
	
	if(transactions){
			for(i = 0; i < transactions.length;i++){
				
				var transactionTime = transactions[i]['transaction-time'];
				
				if(transactionTime) {
					transactionTime = new Date(transactionTime);
					var transactionDate = transactionTime.getFullYear().toString() + "-" + transactionTime.getDate().toString();
					if(!transactionOutput.hasOwnProperty(transactionDate)){
						transactionOutput[transactionDate] = {};
						transactionOutput[transactionDate].income = 0;
						transactionOutput[transactionDate].spent = 0;
					
					}
					if(transactions[i].amount >= 0){
						transactionOutput[transactionDate].income = transactionOutput[transactionDate].income + transactions[i].amount;					
					} else {
						transactionOutput[transactionDate].spent = transactionOutput[transactionDate].spent - transactions[i].amount;					
					}
					
					/*if(transactionOutput.hasOwnProperty(transactionDate)){
					transactionOutput[transactionDate].
					 
					
					} else {
					transactionOutput[transactionDate] = {};
					transactionOutput[transactionDate].spent = amount;
					
					
					}*/
					
					/*
					{ "amount": 17081500, "is-pending": false, "aggregation-time": 1412859120000,
					"account-id": "nonce:comfy-checking/hdhehe", "clear-date": 1412909700000, "transaction-id": "1412909700000", "raw-merchant": "ZENPAYROLL",
					"categorization": "Unknown", "merchant": "Zenpayroll", "transaction-time": "2014-10-09T12:52:00.000Z" },*/
					
					/*
					
					 "amount": -34300, "is-pending": false, "aggregation-time": 1412686740000, 
					 "account-id": "nonce:comfy-cc/hdhehe", "clear-date": 1412790480000, 
					 "transaction-id": "1412790480000", "raw-merchant": "7-ELEVEN 23853", 
					 "categorization": "Unknown", "merchant": "7-Eleven 23853", "transaction-time": "2014-10-07T12:59:00.000Z" }*/
					 
					 
					 
					/*
					{"2014-10": {"spent": "$200.00", "income": "$500.00"},
					"2014-11": {"spent": "$1510.05", "income": "$1000.00"},
...
					"2015-04": {"spent": "$300.00", "income": "$500.00"},
					"average": {"spent": "$750.00", "income": "$950.00"}}*/
				
				
				
				
				}
				
			
			
	
			}
			}
				
    return JSON.stringify(transactionOutput);
    
};
function displayTransactionSummary(responseObj){
	
	var transactionOutput = processTransaction(responseObj);
	var pretty = JSON.stringify(transactionOutput, null, 2);
	document.getElementById('menuPanel').textContent = pretty;
	
	
	
}





function onReady()
{
debugger;
var me = this;
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://prod-api.level-labs.com/api/v2/core/get-all-transactions", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Accept', 'application/json');
debugger;
xhr.onloadend = function(response){
//me.processTransaction.call(this,this.response);

	processTransaction(this.response);
};

xhr.onerror = function(err) {
    document.getElementById('menuPanel').textContent = "ugh an error. i can't handle this right now.";
};
args = {"args": {"uid":  1110590645, "token":  "90B366006F5834DFC493B11880D6FBDC", "api-token":  "AppTokenForInterview", "json-strict-mode": false, "json-verbose-response": false}};
xhr.send(JSON.stringify(args));
}