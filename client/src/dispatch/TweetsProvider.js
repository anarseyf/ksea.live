import React, { createContext } from "react";
import { useState, useEffect } from "react";
import { getTweets } from "../api";
export const TweetsContext = createContext();

const useTweets = () => {
  let [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      tweets = await getTweets();
      setTweets(tweets);
    };
    fetch();
  }, []);

  return [tweets];
};

export const TweetsProvider = ({ children }) => {
  const [tweets] = useTweets();
  return (
    <TweetsContext.Provider value={tweets}>{children}</TweetsContext.Provider>
  );
};
