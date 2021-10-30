
var express = require('express');
var router = express.Router();
const Twitter = require("twitter");
var { getSentiment } = require("../module/sentiment")
// --- Rodo ---
var AWS = require("aws-sdk");
const { env } = require("process");
var dotenv = require("dotenv");
var redis = require("redis");
const redisClient = redis.createClient({
    url: 'redis://redis:6379',
});
dotenv.config();

var awsConfig = {
    region: "ap-southeast-2",
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.AWS_KEYID,
    secretAccessKey: process.env.AWS_SECRETKEY,
};
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "TwitterEnalyst";

const clientTwitter = new Twitter({
    consumer_key: "AOk0yMsQRClAaD6ljtWBYTobq",
    consumer_secret: "FHsH2bvC7oBfts6hgnviEEsQNB0X6uFrCuOTqe4mHTJDgMYwWI",
    access_token_key: "1446607706761035779-WansFFzXz6itabN5jJATVAEFlsVMfq",
    access_token_secret: "TooAlU91Y04nTiqOzhO3k295iRYMBWZOwkwyMsScPcI4w",
});
// --- Rodo ---

// Check whether if data is valid or not (less than 24h old, not empty and count is the same as requested)
var checkData = function (data, count) {
    // data = JSON.parse(data);
    console.log("checkData::Your data returned ", data);
    if (typeof (data) === 'undefined' || isEmpty(data)) {
        console.log('data undefined or empty');
        return 0;
    }

    else if (data) {
        console.log(typeof (data.timeStamp));
        console.log((data.timeStamp));
        var timestamp = new Date(data.timeStamp);
        console.log("checkData::timestamp ", timestamp);
        now = Date.now();
        console.log("checkData::check fresh data ", Math.abs(now - timestamp) / 3600 / 1000 < 24);
        return Math.abs(now - timestamp) / 3600 / 1000 < 24 ? 1 : 0;
    } else {
        return 0;
    }
};

var isEmpty = function (obj) {
    return !Object.keys(obj).length;
}


var getDateTime = function () {
    return new Date().toISOString().slice(0, 19);
};

var writeDynamo = function (keyword, result, count) {
    var input = {
        keywords: keyword,
        result: result,
        count: count,
        timeStamp: getDateTime(),
    };
    var params = {
        TableName: table,
        Item: input,
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.log(
                "DynamoDB::error - Could be because new socket starts and summary=null \n" +
                JSON.stringify(err)
            );
        } else {
            console.log("Persistence ---------> writeDynamo: " + JSON.stringify(input));
        }
    });
};

const readDynamo = async (keyword) => {
    const params = {
        TableName: table,
        Key: {
            keywords: keyword,
        },
    };
    return await docClient.get(params).promise();
};

var writeRedis = (keyword, result, count) => {
    console.log("Persistence ---------> WriteRedis: ", JSON.stringify(keyword, result, count));
    redisClient.setex(
        `TwitterEnalyst:${keyword}`,
        3600,
        JSON.stringify({
            keywords: keyword,
            result: result,
            count: count,
            timeStamp: getDateTime(),
        })
    );
};


function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function (item) {
            console.log(item.keywords);
        });

        // continue scanning if we have more data, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }

}

router.get('/', async (req, res) => {
    console.log("request", req.query.keyword, req.query.count);
    var keyword = req.query.keyword;
    var count = req.query.count;




    console.log("Persistence ---------> Check data in Redis");
    redisClient.get(`TwitterEnalyst:${keyword}`, (err, result) => {
        if (result && checkData(JSON.parse(result), count)) {
            const dataJSON = JSON.parse(result);
            console.log("Persistence ---------> Found in Redis");

            res
                .status(200)
                .json({ error: false, data: dataJSON.result });
        }
        else {
            console.log("Persistence ---------> Not found in Redis");
            console.log("Persistence ---------> Check data in DynamoDB");
            readDynamo(keyword).then((data) => {
                if (checkData(data.Item, count) !== 0) {
                    console.log("Persistence ---------> Found in DynamoDB");
                    result = data.Item.result;
                    console.log(result);
                    res
                        .status(200)
                        .json({ error: false, data: result });

                    console.log("Persistence ---------> Add this data to Redis");
                    writeRedis(keyword, result, count);

                } else {
                    console.log("Persistence ---------> Not found in Dynamo");
                    console.log("Persitence ----------> Using Twitter API");
                    clientTwitter.get(
                        "search/tweets",
                        { q: keyword, lang: "en", count: count },
                        function (error, tweets) {
                            if (error) {
                                console.log("Error: " + error);
                                res.
                                    status(404)
                                    .json({ error: true, message: "Error: " + error });
                            } else {
                                var result = [];
                                // console.log("searchTweet", tweets);
                                tweets.statuses.forEach(function (tweet) {
                                    result.push(getSentiment(tweet));
                                })
                                res
                                    .status(200)
                                    .json({ error: false, data: result });
                                console.log("'result' is collected");
                                // console.log("result", result);

                                console.log("Persitence ----------> Writing result to Dynamo");
                                writeDynamo(keyword, result, count)
                                console.log("Persitence ----------> Writing result to Redis");
                                writeRedis(keyword, result, count);
                            }
                        })
                }
            });
        }
    });

})


module.exports = router; 
