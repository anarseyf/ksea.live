import React, { createContext } from "react";
import { useState, useEffect } from "react";
import { getTweets, getTweetsArea } from "../api";
import { groupBy, GroupByOptions } from "../groupby";
export const TweetsContext = createContext();

const useTweets = (filters = {}) => {
  const [tweets, setTweets] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);

  console.log("useTweets/filters", filters);

  useEffect(() => {
    const fetch = async () => {
      const tweets = await getTweets();
      setTweets(tweets);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const area = filters.area || "seattle";
      const filtered = await getTweetsArea(area);
      setFilteredTweets(filtered);
    };
    fetch();
  }, []);

  return [tweets, filteredTweets];
};

export const TweetsProvider = ({ filters, children }) => {
  const [tweets, filteredTweets] = useTweets(filters);
  return (
    <TweetsContext.Provider value={[tweets, filteredTweets]}>
      {children}
    </TweetsContext.Provider>
  );
};
