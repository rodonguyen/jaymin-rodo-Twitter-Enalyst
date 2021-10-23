import React, { useEffect, useContext } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./tweetStyles";
import { TweetContext } from "../../Context/TweetContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TweetEmbed from "react-tweet-embed";
import "./TweetGrid/_plugin-react-slick.scss";

import GridContainer from "./TweetGrid/TweetGridContainer";
import GridItem from "./TweetGrid/TweetGridItem";
import Card from "./TweetGrid/TweetCard";

const ENDPOINT = "http://localhost:3000/";
const socket = io(ENDPOINT, {});

const useStyles = makeStyles(styles);

export default function Tweets() {
  const {
    keyword,
    streamTime,
    trendingKeyword,
    Tweet,
    setTweet,
    idTweet,
    setIdTweet,
    dataRef,
    setScoreTweet,
    scoreSearchTweet,
    setScoreSearchTweet,
    achirveScore,
  } = useContext(TweetContext);

  const path = { keyword: keyword.input, timer: streamTime.timerStream };
  console.log(achirveScore);
  console.log("id", scoreSearchTweet);
  useEffect(() => {
    const tweet = Tweet;
    if (tweet.num_score !== undefined) {
      const now = Date.now();
      dataRef.current.push({ x: now, y: tweet.num_score });
      setTimeout(() => {
        setIdTweet((idTweet) => [...idTweet, tweet.id_str]);
        setScoreTweet((scoreTweet) => [...scoreTweet, tweet.num_score]);
      }, 7000);
    }
  }, [Tweet]);
  useEffect(() => {
    if (keyword.input) {
      socket.emit("search", path);
      setTimeout(
        () =>
          socket.on("sendTweet", (receivedTweet) => {
            setTweet(receivedTweet.tweet);
          }),
        3000
      );

      socket.on("searchTweet", (tweets) => {
        setTimeout(
          () =>
            setScoreSearchTweet((ScoreSearchTweet) => [
              ...ScoreSearchTweet,
              tweets.tweet.num_score,
            ]),
          3000
        );
      });
    }
  }, [keyword]);

  useEffect(() => {
    socket.emit("achirveScore", achirveScore.averageScore);
  }, [achirveScore]);

  useEffect(() => {
    socket.on("trending", (trendingKeyword) => {
      // console.log("trend", trendingKeyword);
    });
  }, [trendingKeyword]);
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8} className={classes.marginAuto}>
            {idTweet.length ? (
              idTweet.map((id) => {
                return <TweetEmbed id={id} placeholder={"loading"} />;
              })
            ) : (
              <div className="tweet-header">
                <h1>search to display twitter post</h1>
              </div>
            )}
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
