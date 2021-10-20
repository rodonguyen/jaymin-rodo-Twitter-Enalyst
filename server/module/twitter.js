const Twitter = require("twitter");

require("dotenv").config();

const clientTwitter = new Twitter({
  consumer_key: "AOk0yMsQRClAaD6ljtWBYTobq",
  consumer_secret: "FHsH2bvC7oBfts6hgnviEEsQNB0X6uFrCuOTqe4mHTJDgMYwWI",
  access_token_key: "1446607706761035779-WansFFzXz6itabN5jJATVAEFlsVMfq",
  access_token_secret: "TooAlU91Y04nTiqOzhO3k295iRYMBWZOwkwyMsScPcI4w",
});

module.exports = clientTwitter;
