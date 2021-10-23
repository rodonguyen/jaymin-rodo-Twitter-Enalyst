var AWS = require("aws-sdk");
const { env } = require("process");

var awsConfig = {
    "region": "ap-southeast-2",
    "endpoint": "http://dynamodb.ap-southeast-2.amazonaws.com",
    "accessKeyId": "AKIAVOMJOYRWD34QPA6S", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "TwitterEnalyst";


var read = function () {
    var params = {
        TableName: table,
        Key: {
            "keywords": "cat"
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("keyword::read::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("Read: " + JSON.stringify(data, null, 2));
        }
    })
}

var update = function () {  
    var params = {
        TableName: table,
        Key: { "word": "cat" },
        UpdateExpression: "set updated_by = :byUser, cute = :boolValue",
        ExpressionAttributeValues: {
            ":byUser": "modifyFunction",
            ":boolValue": true
        },
        ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

        if (err) {
            console.log("keyword::update::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("keyword::update::success " + JSON.stringify(input) );
        }
    });
}

var getDateTime = function() {
    // return new Date().toISOString().slice(0,17).replaceAll('-','').replaceAll(':','').replace('T','');
    return new Date().toISOString().slice(0,19);
}

var a = new Date('2018-01-17T21:20:00')
var b = new Date('2018-01-17T22:18:00')
console.log(Math.abs(b - a)/3600/1000) // safe to use

var write = function (keyword, summary, timeStamp) {
    var input = {
        "keywords": keyword, "Summary": summary, "timeStamp": timeStamp  
    };
    var params = {
        TableName: table,
        Item:  input
    };
    console.log(input.timeStamp);
    docClient.put(params, function (err, data) {
        if (err) {
            console.log("keyword::write::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("Added: " + JSON.stringify(input) );                      
        }
    });
}

var remove = function () {
    var params = {
        TableName: table,
        Key: {
            "word" : "abc"
        }
    };
    docClient.delete(params, function (err, data) {

        if (err) {
            console.log("keyword::delete::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted: " + JSON.stringify(input) );
        }
    });
}

// remove();
const summary_mockup = {'hi': 4, 'low':-1};
write('btc', JSON.stringify(summary_mockup), getDateTime());
// update();
// read();