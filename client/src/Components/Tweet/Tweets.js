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
import { getSearchTwitter } from '../../Services/GetSearchTwitter'
import { getTrendingKeyword } from '../../Services/GetTrendingKeyword'
import { getUserTrendingKeyword } from '../../Services/GetUserTrend'

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
    setScoreSearchTweet,
    achirveScore,
    setGoogleTrends,
    setSummary100PostScore,
    setUserTrend,
    setTweetAlert,
  } = useContext(TweetContext);

  const path = { keyword: keyword.input, timer: streamTime.timerStream };
  console.log("id", idTweet)
  useEffect(() => {
    if (keyword.input) {
      getSearchTwitter(keyword.input, streamTime.timerStream)
        .then((res) => {
          const data = res.data.data;
          console.log(data);
          res.data.data.forEach(tweet => setIdTweet((idTweet) => [...idTweet, tweet.id_str]))
          res.data.data.forEach(tweet => setScoreSearchTweet((scoreTweet) => [...scoreTweet, tweet.num_score]))
        })
        .catch((err) => console.log(err));
    }
  }, [keyword])
  useEffect(() => {
    getTrendingKeyword().then(res => {
      setGoogleTrends(res)
      console.log(res);
    })
    getUserTrendingKeyword().then(res => {
      setUserTrend(res);
      console.log(res);
    })
  }, [])
  // useEffect(() => {
  //   const tweet = Tweet;
  //   if (tweet.num_score !== undefined) {
  //     const now = Date.now();
  //     dataRef.current.push({ x: now, y: tweet.num_score });
  //     setTimeout(() => {
  //       setIdTweet((idTweet) => [...idTweet, tweet.id_str]);
  //       setScoreTweet((scoreTweet) => [...scoreTweet, tweet.num_score]);
  //     }, 3000);
  //   } else {
  //     setTweetAlert(true);
  //   }
  // }, [Tweet]);
  // useEffect(() => {
  //   if (keyword.input) {
  //     socket.emit("search", path);
  //     setTimeout(
  //       () =>
  //         socket.on("sendTweet", (receivedTweet) => {
  //           setTweet(receivedTweet.tweet);
  //         }),
  //       1000
  //     );

  //     socket.on("searchTweet", (tweets) => {
  //       setScoreSearchTweet((ScoreSearchTweet) => [
  //         ...ScoreSearchTweet,
  //         tweets.tweet.num_score,
  //       ])
  //     });

  //     socket.on("DBscore", (score) => {
  //       setSummary100PostScore(score)
  //     })
  //   }
  // }, [keyword]);

  // useEffect(() => {
  //   socket.emit("achirveScore", achirveScore);
  // }, [achirveScore]);

  // useEffect(() => {
  //   socket.on("trending", (trendingKeyword) => {
  //     setGoogleTrends((googleTrends) => [...googleTrends, trendingKeyword]);
  //   });
  // }, [trendingKeyword]);
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8} className={classes.marginAuto}>
            {idTweet.length ? (
              idTweet.map((id, key) => {
                if (key < 20) {
                  return (
                    <TweetEmbed
                      id={id}
                      placeholder={"loading"}
                      className={classes.tweet}
                    />
                  );
                }
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
