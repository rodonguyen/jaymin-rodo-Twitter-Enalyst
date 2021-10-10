const Sentiment = require("sentiment");

var sentiment = {};

//Send Tweet Text to Sentiment Analysis
sentiment.getSentiment = (tweet, socket) => {
  var sentimentScore = Sentiment(tweet.text);

  if (sentimentScore.score < 0) {
    sentimentScore = "negative";
  } else if (sentimentScore.score > 0) {
    sentimentScore = "positive";
  } else {
    sentimentScore = "neutral";
  }

  return sentiment.appendSentiment(tweet, sentimentScore, socket);
};

//Send sentiment score of tweet to Client
sentiment.appendSentiment = (tweet, sentiment, socket) => {
  var scoreTweet = {
    sentiment: sentiment,
    created_at: tweet.created_at,
    timestamp_ms: tweet.timestamp_ms,
    id_str: tweet.id_str,
    user: {
      name: tweet.user.name,
      screen_name: tweet.user.screen_name,
      profile_image_url_https: tweet.user.profile_image_url_https,
      location: tweet.user.location,
      time_zone: tweet.user.time_zone,
    },
    text: tweet.text,
    lang: tweet.lang,
  };

  console.log(scoreTweet.text);

  return scoreTweet;
};

module.exports = sentiment;
