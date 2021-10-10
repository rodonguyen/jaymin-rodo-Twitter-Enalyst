import React, { createContext, useEffect, useState } from "react";

export const TweetContext = createContext();

const TweetProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  console.log(keyword);
  return (
    <TweetContext.Provider value={{ keyword, setKeyword }}>
      {children}
    </TweetContext.Provider>
  );
};

export default TweetProvider;
