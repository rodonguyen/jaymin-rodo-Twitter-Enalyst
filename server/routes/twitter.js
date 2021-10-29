
var express = require('express');
var router = express.Router();
const Twitter = require("twitter");
var AWS = require("aws-sdk");
var { getSentiment } = require("../module/sentiment")
require("dotenv").config();
// --- Rodo ---
var AWS = require("aws-sdk");
const { env } = require("process");
var dotenv = require("dotenv");
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
// ------------
const clientTwitter = new Twitter({
    consumer_key: "AOk0yMsQRClAaD6ljtWBYTobq",
    consumer_secret: "FHsH2bvC7oBfts6hgnviEEsQNB0X6uFrCuOTqe4mHTJDgMYwWI",
    access_token_key: "1446607706761035779-WansFFzXz6itabN5jJATVAEFlsVMfq",
    access_token_secret: "TooAlU91Y04nTiqOzhO3k295iRYMBWZOwkwyMsScPcI4w",
});
// --- Rodo ---

var isFresh = function (data) {
    console.log("isFresh::Your data returned ", data);
    if (typeof (data) === 'undefined' || isEmpty(data)) {
        console.log('return 0');
        return 0;
    }
    else if (data) {
        const timestamp = new Date(data.Item.timeStamp);
        console.log("isFresh::timestamp ", timestamp);
        now = Date.now();
        console.log("isFresh::check fresh data ", Math.abs(now - timestamp) / 3600 / 1000 < 24);
        return Math.abs(now - timestamp) / 3600 / 1000 < 24 ? 1 : 0;
    } else {
        return 0;
    }
};

var isEmpty = function (obj) {
    return !Object.keys(obj).length;
}


var getDateTime = function () {
    // return new Date().toISOString().slice(0,17).replaceAll('-','').replaceAll(':','').replace('T','');
    return new Date().toISOString().slice(0, 19);
};

var writeDynamo = function (keyword, summary, timeStamp) {
    var input = {
        keywords: keyword,
        summary: summary,
        timeStamp: timeStamp,
    };
    var params = {
        TableName: table,
        Item: input,
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.log(
                "Write to DynamoDB::error - Could be because new socket starts and summary=null \n" +
                JSON.stringify(err, null, 2)
            );
        } else {
            console.log("Wrote to DynamoDB: " + JSON.stringify(input));
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

router.get('/', async (req, res) => {
    console.log("request", req.query.keyword);
    keyword = req.query.keyword;
    readDynamo(keyword).then((data) => {
        // if (isFresh(data) !== 0) {
        //     console.log("Using 'summary' from DynamoDB for keyword", data.Item.keywords);
        //     useDynamoDB = 1;
        //     summary = data.Item.summary;
        //     summaryJson = JSON.parse(summary);
        //     // set Score on Chart 3 to 'summary' score
        //     console.log("DBscore", summaryJson);
        // } else {
        console.log("Using 'summary' from Twitter API");
        clientTwitter.get(
            "search/tweets",
            { q: keyword, lang: "en", count: "100" },
            function (error, tweets) {
                if (error) {
                    console.log("Error: " + error);
                    res.
                        status(404)
                        .json({ error: true, message: "Error: " + error });
                } else {
                    let result = [];
                    // console.log("searchTweet", tweets);
                    tweets.statuses.forEach(function (tweet) {
                        result.push(getSentiment(tweet));
                    })
                    ///Rodo, save result to database
                    res
                        .status(200)
                        .json({ error: false, data: result });
                    console.log("result", result);
                }
            })
        // }
    });
})


module.exports = router; 
