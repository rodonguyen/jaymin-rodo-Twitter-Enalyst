import React, { createContext, useState, useRef } from "react";

export const TweetContext = createContext();

const TweetProvider = ({ children }) => {
  const [keyword, setKeyword] = useState({});
  const [streamTime, setStreamTime] = useState({});
  const [timeStamp, setTimeStamp] = useState({});
  const [Tweet, setTweet] = useState({});
  const [idTweet, setIdTweet] = useState([]);
  const dataRef = useRef([]);
  const scoreRef = useRef([]);
  // console.log(keyword);
  return (
    <TweetContext.Provider
      value={{
        keyword,
        setKeyword,
        streamTime,
        setStreamTime,
        scoreRef,
        timeStamp,
        setTimeStamp,
        Tweet,
        setTweet,
        idTweet,
        setIdTweet,
        dataRef,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};

export default TweetProvider;
