const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
 
require('dotenv');

const client = new Twitter({
  consumer_key: 'process.env.customer_api_key',
  consumer_secret: 'process.env.customer_api_secret',
  access_token_key: 'proces.env.access_token_key',
  access_token_secret: 'process.env.access_token_secret'
});
 
let stream = null;

// Router POST 
// Receive keyword from user to start streaming 
router.get('/', async (req, res, next) => {
	let keyword = req.body.keyword;
    console.log("body.keyword:", keyword);
	// let redisKey = 'cab432tweets:' + req.body.keyword;
	// if (stream === null) {
		console.log('New Twitter Stream!');
		// Start the stream with tracking the keyword 
		stream = await client.get('statuses/filter', { track: keyword, language: 'en' });
        console.log("steam:",stream)
        res
            .status(200)
            .json({error: false, data: stream})
		// Start Streaming 
		stream.on('tweet', function (tweet) {
            console.log("tw:", tweet);
		// 	// Extract tweet from raw data 
			// helper.parseTweets(tweet).then(result => {
				// helper.sentimentAnalysis(result, keyword, tweet.id_str).then(result => {
                    // console.log('result raw data: ', result);
		// 			redisClient.hgetall(redisKey, (err, data) => {
		// 				if(data){
		// 						if(data[result.id] === undefined){
		// 							console.log("Save to both Redis and Azure");
		// 							redisClient.hset(redisKey, result.id, JSON.stringify(result));
		// 							documentDB.getDocument(config.creds.tweetCollection.id, result);
		// 						} else{ 
		// 							console.log("The tweet exists in Redis");
		// 						}
		// 				}
		// 				else {
		// 						console.log("Save to Redis at first");
		// 						redisClient.hset(redisKey, result.id, JSON.stringify(result));
		// 						documentDB.getDocument(config.creds.tweetCollection.id, result);
		// 				} 
		// 			});
		// 		}).catch(err => {
		// 			console.log(err);
		// 		})
			// })
		// });
	})
	//else {
		// stream.stop();
		// console.log("Stop the old stream and start the new stream!");
		// // Remove old stream to create new stream 
		// stream = client.stream('statuses/filter', { track: keyword, language: 'en' });
		// stream.on('tweet', function (tweet) {
		// 	helper.parseTweets(tweet).then(result => {
		// 		// Extract tweet from raw data 
		// 		helper.sentimentAnalysis(result, keyword, tweet.id_str).then(result => {
		// 			redisClient.hgetall(redisKey, (err, data) => {
		// 				if(data){
		// 						if(data[result.id] === undefined){
		// 							console.log("Save to both Redis and Azure");
		// 							redisClient.hset(redisKey, result.id, JSON.stringify(result));
		// 							documentDB.getDocument(config.creds.tweetCollection.id, result);
		// 						}else{
		// 							// Found data in 
		// 							console.log("The tweet exists in Redis");
		// 						}
		// 				}
		// 				else {
		// 						console.log("Save to Redis at first");
		// 						redisClient.hset(redisKey, result.id, JSON.stringify(result));
		// 						documentDB.getDocument(config.creds.tweetCollection.id, result);
		// 				} 
		// 			});
		// 		}).catch(err => {
		// 			console.log(err);
		// 		})
		// 	})
		// })

		// setTimeout(function () {
		// 	stream.destroy();
		// 	console.log('Stream Destroyed due to delay!');
		// }, 900000);
	//}
	stream.on('limit', function (message) {
		console.log("Limit Reached: " + message);
	});

	stream.on('disconnect', function (message) {
		console.log("Ooops! Disconnected: " + message);
	});
	stream.on('error', function (message) {
		console.log("Ooops! Error: " + message);
	});
});
module.exports = router;