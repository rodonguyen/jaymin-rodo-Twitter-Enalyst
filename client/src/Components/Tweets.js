import React, { useEffect, useContext } from "react";
import io from "socket.io-client";

import { TweetContext } from "../Context/TweetContext";

const ENDPOINT = "http://localhost:3000/";
const socket = io(ENDPOINT, {});

export default function Tweets() {
  const { keyword, streamTime } = useContext(TweetContext);
  const path = { keyword: keyword.input, timer: streamTime.timerStream };
  console.log(path);
  useEffect(() => {
    console.log(keyword);
    if (keyword.input) {
      socket.emit("search", path);
      socket.on("sendTweet", (receivedTweet) => {
        console.log(receivedTweet);
      });
    }
  }, [keyword]);

  return <></>;
}
