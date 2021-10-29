var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");
const { env } = require("process");
var dotenv = require("dotenv");
var redis = require("redis");
const redisClient = redis.createClient();
dotenv.config();

var awsConfig = {
    region: "ap-southeast-2",
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.AWS_KEYID,
    secretAccessKey: process.env.AWS_SECRETKEY,
};
var AWS = require("aws-sdk");
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "TwitterEnalyst";


const onScan = async(err, data) => {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        var keywords = [];
        data.Items.forEach(function(item) {
            // console.log(item.keywords);
            keywords.push(item.keywords);
        });
        console.log(keywords);


        // continue scanning if we have more data, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}

// Enter http://localhost:3000/myTrend
router.get('/', async (req, res, next) => {
    docClient.scan({TableName: table}, onScan);
});

module.exports = router;