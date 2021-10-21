const Twitter = require("twitter");

require("dotenv").config();

const clientTwitter = new Twitter({
  consumer_key: "AOk0yMsQRClAaD6ljtWBYTobq",
  consumer_secret: "FHsH2bvC7oBfts6hgnviEEsQNB0X6uFrCuOTqe4mHTJDgMYwWI",
  access_token_key: "1446607706761035779-WansFFzXz6itabN5jJATVAEFlsVMfq",
  access_token_secret: "TooAlU91Y04nTiqOzhO3k295iRYMBWZOwkwyMsScPcI4w",
});

// clientTwitter.get('search/tweets', {q: 'rodo', lang: 'en', count: '100'}, function(error, tweets, response) {
//   console.log(tweets);
// });

module.exports = clientTwitter;
