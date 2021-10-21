import React, { useEffect, useContext } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./tweetStyles";
import { TweetContext } from "../../Context/TweetContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TweetEmbed from "react-tweet-embed";
import LocationOn from "@material-ui/icons/LocationOn";
import "./TweetGrid/_plugin-react-slick.scss";

import GridContainer from "./TweetGrid/TweetGridContainer";
import GridItem from "./TweetGrid/TweetGridItem";
import Card from "./TweetGrid/TweetCard";

import image1 from "../../assets/img/bg.jpg";
import image2 from "../../assets/img/bg2.jpg";
import image3 from "../../assets/img/bg3.jpg";

const ENDPOINT = "http://localhost:3000/";
const socket = io(ENDPOINT, {});

const useStyles = makeStyles(styles);

export default function Tweets() {
  const {
    keyword,
    streamTime,
    setStreamTime,
    trendingKeyword,
    Tweet,
    setTweet,
    idTweet,
    setIdTweet,
    dataRef,
    scoreTweet,
    setScoreTweet,
  } = useContext(TweetContext);

  const path = { keyword: keyword.input, timer: streamTime.timerStream };

  console.log("id", idTweet);
  console.log("id", scoreTweet);
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
        5000
      );
    }
  }, [keyword]);

  useEffect(() => {
    socket.on("trending", (trendingKeyword) => {
      console.log("trend", trendingKeyword);
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
