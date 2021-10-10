const Twitter = require("twitter");

require("dotenv").config();

const clientTwitter = new Twitter({
  consumer_key: "AOk0yMsQRClAaD6ljtWBYTobq",
  consumer_secret: "FHsH2bvC7oBfts6hgnviEEsQNB0X6uFrCuOTqe4mHTJDgMYwWI",
  access_token_key: "1446607706761035779-WansFFzXz6itabN5jJATVAEFlsVMfq",
  access_token_secret: "TooAlU91Y04nTiqOzhO3k295iRYMBWZOwkwyMsScPcI4w",
});

// // Router POST
// // Receive keyword from user to start streaming
// router.post("/", (req, res, next) => {
//   let keyword = req.body.keyword;
//   console.log("body.keyword:", keyword);
//   // let redisKey = 'cab432tweets:' + req.body.keyword;
//   //   if (streaming === false) {
//   console.log("New Twitter Stream!");
//   // Start the stream with tracking the keyword
//   client.stream(
//     "statuses/filter",
//     { track: "keyword", language: "en" },
//     function (stream) {
//       stream.on("data", function (tweet) {
//         //   streaming = true;
//         console.log(tweet.text);
//       });
//       stream.on("error", function (message) {
//         console.log("Ooops! Error: " + message);
//       });
//       stream.on("limit", function (message) {
//         ok;
//         console.log("Limit Reached: " + message);
//       });

//       stream.on("disconnect", function (message) {
//         console.log("Ooops! Disconnected: " + message);
//       });
//     }
//   );
// });

module.exports = clientTwitter;
