import React, { useEffect, useContext } from "react";
import io from "socket.io-client";

import { TweetContext } from "../Context/TweetContext";

const ENDPOINT = "http://localhost:3000/";
const socket = io(ENDPOINT, {});

export default function Tweets() {
  const { keyword, setKeyword } = useContext(TweetContext);

  useEffect(() => {
    console.log(keyword);
    if (keyword.input) {
      socket.emit("search", keyword.input);
      socket.on("sendTweet", (receivedTweet) => {
        console.log(receivedTweet);
      });
    }
  }, [keyword]);

  return <></>;
}
