var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var http = require("http");
var socketio = require("socket.io");
var googleTrends = require("google-trends-api");
// --- Rodo ---
var AWS = require("aws-sdk");
const { env } = require("process");
var dotenv = require('dotenv');
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
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var clientTwitter = require("./module/twitter");
var sentiment = require("./module/sentiment");
const { timeStamp } = require("console");
var app = express();

// Create the http server
const server = require("http").createServer(app);
// Create the Socket IO server on
// the top of http server
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

process.setMaxListeners(Infinity);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const connections = [];
io.on("connection", (socket) => {
  socket.emit("your id", socket.id);
  connections.push(socket);
  console.log(
    "%s Connected. %s sockets connected",
    socket.id,
    connections.length
  );
  // const trend = GetTrendingKeyword();
  // console.log("trend", trend);
  googleTrends.realTimeTrends(
    {
      geo: "AU",
      category: "all",
    },
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        const trends = JSON.parse(results);
        trends.storySummaries.trendingStories.forEach((trend) => {
          const result = {};
          if (trend.entityNames.length >= 1) {
            trend.entityNames.forEach((keyword) => {
              keyword = keyword.split(" ").join("-");
              result.keyword = keyword;
              socket.emit("trending", result);
              // console.log("sent", trend);
            });
          }
        });
      }
    }
  );

  var keywordToDynamo, summary; // Rodo declares

  socket.on("search", (payload) => {
    const keyword = payload.keyword;
    const timer = payload.timer * 1000;
    keywordToDynamo = keyword;
    console.log("Keyword: %s %s", keywordToDynamo, timer);
    console.log("New Twitter Stream!");

    // Start the stream with tracking the keyword
    stream = clientTwitter.stream("statuses/filter", {
      track: keyword,
      language: "en",
    });
    var counter = 0;
    var prevTimestamp = Date.now();

    stream.on("data", (tweet) => {
      counter = counter + 1;
      console.log("streamed");
      clientStream = stream;
      timeStamp = Date.now();
      console.log("timer:", prevTimestamp + timer);
      console.log("now:", timeStamp);
      // Send Tweet Object to Client
      if (timeStamp > prevTimestamp + timer) {
        clientStream.destroy();
        console.log(
          "Socket disconnected: %s sockets remaining",
          connections.length
        );
        console.log(counter);
      } else {
        socket.emit("sendTweet", {
          tweet: sentiment.getSentiment(tweet),
        });
        console.log("Tweet sent");

        stream.on("error", function (message) {
          console.log("Ooops! Error: " + message);
        });

        stream.on("limit", function (message) {
          ok;
          console.log("Limit Reached: " + message);
        });

        stream.on("disconnect", function (message) {
          console.log("Ooops! Disconnected: " + message);
        });
      }
    });

    // Rodo
    var data = readDynamo(keywordToDynamo);
    if  ( isFresh(data) ) {
      summary = data.summary;
      // set Score on Chart 3 to 'summary' score
    }
    else {
        clientTwitter.get(
        "search/tweets",
        { q: keyword, lang: "en", count: "100" },
        function (error, tweets) {
            if (error) {
            console.log("Error: " + error);
            } else {
            // console.log("searchTweet", tweets);
            tweets.statuses.forEach(function (tweet) {
                socket.emit("searchTweet", {
                tweet: sentiment.getSentiment(tweet),
                });
                console.log("sent Search Tweet");
            });
            }
        }
        );
    }
  });
  
  socket.on("achirveScore", (score) => {
    //Rodo (score from client to store)
    console.log("achirveScore", score);
    summary = score;  // Rodo
  });

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
    socket.disconnect();
    // clientStream.destroy();
    console.log(
      "Socket disconnected: %s sockets remaining",
      connections.length
    );

    // --- Rodo ---
    // Write summary to Dynamo as client refresh page =))
    summary = JSON.stringify(summary);
    console.log("summary=====================================", summary);
    writeDynamo(keywordToDynamo, summary, getDateTime());
  });

}); //END io.sockets.on


// --- Rodo ---

var isFresh = function(data) { 
    if (data !== 0) {
        timeStamp = new Date(data.timeStamp);
        now = Date().now()
        return Math.abs(now - timeStamp)/3600/1000 < 24? 1 : 0
    } else {
        return 0
    }
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
      console.log("Write to DynamoDB::error - Could be because new socket starts and summary=null \n" + JSON.stringify(err, null, 2));
    } else {
      console.log("Wrote to DynamoDB: " + JSON.stringify(input));
    }
  });
};

var readDynamo = function (keyword) {
    var params = {
        TableName: table,
        Key: {
            "keywords": keyword
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("keyword::read::error - " + JSON.stringify(err, null, 2));
            return 0;
        }
        else {
            console.log("Read: " + JSON.stringify(data, null, 2));
            return data;
        }
    })
}
// -----------
module.exports = { app: app, server: server };
