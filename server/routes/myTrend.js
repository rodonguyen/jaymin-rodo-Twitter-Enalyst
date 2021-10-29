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
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "TwitterEnalyst";


module.exports = router;

const updateMyTrends = async () => {
    
}

router.get('/', async (req, res, next) => {
});

module.exports = router;S