var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var http = require("http");
var socketio = require("socket.io");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var clientTwitter = require("./module/twitter");
var sentiment = require("./module/sentiment");
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
process.setMaxListeners(0);
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

  var prevSearch = false;

  socket.on("search", (payload) => {
    console.log("Keyword: %s", payload);

    // if (prevSearch) {
    //   clientStream.destroy();
    //   console.log(prevSearch);
    //   console.log("stop stream");
    // } else {
    //   prevSearch = true;
    // }

    console.log("New Twitter Stream!");

    // Start the stream with tracking the keyword
    stream = clientTwitter.stream("statuses/filter", {
      track: payload,
      language: "en",
    });

    var lastTimestamp = Date.now(),
      speedLimiter = 800; //800ms
    console.log(lastTimestamp, speedLimiter);
    stream.on("data", (tweet) => {
      console.log("streamed");
      // if (tweet.timestamp_ms - lastTimestamp > speedLimiter) {
      lastTimestamp = Date.now();
      // console.log("tweet", tweet);
      //Send Tweet Object to Client

      socket.emit("sendTweet", {
        tweet: sentiment.getSentiment(tweet),
      });
      console.log("Tweet sent");

      clientStream = stream;

      socket.on("disconnect", () => {
        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        clientStream.destroy();
        console.log(
          "Socket disconnected: %s sockets remaining",
          connections.length
        );
      });

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
    });
  });
}); //END io.sockets.on

module.exports = { app: app, server: server };
