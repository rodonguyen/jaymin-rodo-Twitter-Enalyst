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
var { env } = require("process");
var redis = require("redis");
var redisClient = redis.createClient();
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
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var clientTwitter = require("./module/twitter");
var sentiment = require("./module/sentiment");
var { timeStamp } = require("console");

var app = express();

// Create the http server
var server = require("http").createServer(app);
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

// --- Rodo ---
const isFresh = function (data) {
  console.log("isFresh::Your data ", data);
  if (typeof data === "undefined") {
    console.log("isFresh::return 0");
    return 0;
  } else if (data) {
    const timestamp = new Date(data.timeStamp);
    console.log("isFresh::timestamp ", timestamp);
    now = Date.now();
    console.log(
      "isFresh::check fresh data ",
      Math.abs(now - timestamp) / 3600 / 1000 < 24
    );
    return Math.abs(now - timestamp) / 3600 / 1000 < 24 ? 1 : 0;
  } else {
    return 0;
  }
};

const isEmpty = function (obj) {
  return !Object.keys(obj).length;
};

const getDateTime = function () {
  // return new Date().toISOString().slice(0,17).replaceAll('-','').replaceAll(':','').replace('T','');
  return new Date().toISOString().slice(0, 19);
};

const writeDynamo = function (keyword, summary) {
  var input = {
    keywords: keyword,
    summary: summary,
    timeStamp: getDateTime(),
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

const writeRedis = (redisClient, redisKey, keywordToStorage, summaryString) => {
  console.log("Writing to Redis");
  redisClient.setex(
    redisKey,
    3600,
    JSON.stringify({
      keywords: keywordToStorage,
      summary: summaryString,
      timeStamp: getDateTime(),
    })
  );
  console.log(
    "writeRedis::Successfully uploaded data to Redis: ",
    redisKey,
    keywordToStorage,
    summaryString
  );
};

// -----------
const connections = [];
io.on("connection", (socket) => {
  socket.emit("your id", socket.id);
  connections.push(socket);
  console.log(
    "%s Connected. %s sockets connected",
    socket.id,
    connections.length
  );

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
            });
          }
        });
      }
    }
  );

  var keywordToStorage, summary, redisKey; // Rodo declares
  var useDynamoDB = 0;
  var useStorageSummary = 0;

  socket.on("search", (payload) => {
    const keyword = payload.keyword;
    const timer = payload.timer * 1000;
    keywordToStorage = keyword;
    console.log("Keyword: %s %s", keywordToStorage, timer);
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
      const timeStamp = Date.now();
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
          //   console.log("Ooops! Error: " + message);
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

    console.log("Persistence ---------> Check data in Redis");
    redisKey = `TwitterEnalyst:${keywordToStorage}`;
    console.log("Redis key: ", redisKey);
    redisClient.get(redisKey, (data) => {
      console.log("Redis::data ", data);
      if (data) {
        console.log("Persistence ---------> Found in Redis");
        summaryJSON = JSON.parse(data);
      }
      // Get wanted data from DynamoDB
      else {
        console.log(
          "Persistence ---------> Not found in Redis. Check data in DynamoDB"
        );
        readDynamo(keywordToStorage).then((data) => {
          if (!isEmpty(data)) {
            if (isFresh(data.Item) !== 0) {
              console.log("Persistence ---------> Found in DynamoDB");
              useDynamoDB = 1;
              useStorageSummary = 1;
              summary = data.Item.summary;
              console.log(summary, '\n');
              //   summaryJson = JSON.parse(summary);

              // set Score on Chart 3 to 'summary' score
              // socket.emit("searchTweet", { tweet: { num_score: summaryJson } });
              //
              //
              // console.log(summaryJson);
            }
          } else {
            console.log(
              "Persistence ---------> Not found in DynamoDB. Query data from Twitter API"
            );
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
                    console.log("Sent a Search Tweet from API");
                  });
                }
              }
            );
          }
        });
      }
    });
  });

  socket.on("achirveScore", (score) => {
    if (useStorageSummary === 1) {
      // Rodo (score from client to store)
      console.log("achirveScore", score);
      summary = score; // Rodo
    }
  });

  socket.on("disconnect", () => {
    try {
      connections.splice(connections.indexOf(socket), 1);
      socket.disconnect();
      // clientStream.destroy();
      console.log(
        "Socket disconnected: %s sockets remaining",
        connections.length
      );
    } catch (e) {
      console.log(e);
    }

    // --- Rodo ---
    // Write data as client refresh page =))
    try {
      if (!useDynamoDB) {
        summaryString = JSON.stringify(summary);
        console.log(
          "=== Write summary to DynamoDB + Redis ===\n",
          summaryString
        );
        writeDynamo(keywordToStorage, summaryString);
        writeRedis(redisClient, redisKey, keywordToStorage, summaryString);
        console.log("\n\n***\n\n");
      }
    } catch (e) {
      console.log("Error in trying to write data", e);
    }
  });
}); //END io.sockets.on

module.exports = { app: app, server: server };

/*
    redisClient.get(redisKey, (error, result) => {
        if (isFresh(result.timeStamp)) {
            const resultJSON = JSON.parse(result);
            summary = resultJSON.summary
        }
        // Get wanted data from DynamoDB
        else {
            var data = readDynamo(keywordToStorage);
            if  ( isFresh(data) ) {
              summary = data.summary;
              // set Score on Chart 3 to 'summary' score
              //
              // store 'summary' in Redis here?
              // redisClient.setex(
                //     redisKey,
                //     3600,
                //     JSON.stringify({ source: "Redis Cache", ...?summary and datetime? })
                // );
                // console.log("Successfully uploaded data to Redis " + redisKey);
            }
            // Get new data since there's no wanted data from the storages
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
        }
    });
    */
