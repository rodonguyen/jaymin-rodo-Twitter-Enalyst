import React, { createContext, useState } from "react";

export const TweetContext = createContext();

const TweetProvider = ({ children }) => {
  const [keyword, setKeyword] = useState({});
  const [streamTime, setStreamTime] = useState({});
  console.log(keyword);
  return (
    <TweetContext.Provider
      value={{ keyword, setKeyword, streamTime, setStreamTime }}
    >
      {children}
    </TweetContext.Provider>
  );
};

export default TweetProvider;
