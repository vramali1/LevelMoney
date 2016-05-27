# LevelMoney Transaction Summary

This Project is used to display Monthly transactions of a user from Level Money REST Endpoint URL

https://prod-api.level-labs.com/api/v2/core/get-all-transactions

Opening TransactionProcessor.html will display the following

1) Monthly Transaction Summary in tabular format
2) Monthly Transaction Summary in JSON format
3) Monthly Transaction Summary Ignoring Donuts transaction in tabular format
4) Monthly Transaction Summary Ignoring Donuts transaction in JSON format

Average Monthly Income is calculated using the formula = Total Income for all Months/ Total Months.
Average Spent is calculated using the formula = Total Amount Spent for all Months/ Total Months.
 
Javascript, jquery-2.2.4 framework is used to implement the functionality. qunit 1.2.3.1 framework is used for Unit testing. All unit tests can be run opening TransactionTests.html.

