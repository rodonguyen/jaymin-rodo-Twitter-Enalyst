import React, { useEffect, useContext, useCallback, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

import { TweetContext } from "../Context/TweetContext";

const ENDPOINT = "http://localhost:3000/";
const socket = io(ENDPOINT, {});

export default function Tweets() {
  const { keyword, setKeyword } = useContext(TweetContext);

  useEffect(() => {
    console.log(keyword);
    if (keyword.input) {
      socket.emit("search", keyword.input);
    }
  }, [keyword]);

  return <></>;
}
