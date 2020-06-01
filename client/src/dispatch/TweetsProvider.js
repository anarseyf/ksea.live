import React, { createContext } from "react";
import { useState, useEffect } from "react";
import { getTweets } from "../api";
import { groupBy, GroupByOptions } from "../groupby";
export const TweetsContext = createContext();

const useTweets = (filters = {}) => {
  const [tweets, setTweets] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const allTweets = await getTweets();
      setTweets(allTweets);
    };
    fetch();
  }, []);

  useEffect(() => {
    let filtered = tweets;
    if (tweets.length && filters.area) {
      const grouped = groupBy(GroupByOptions.ZipCode, tweets);
      const group = grouped.find((g) => g.key === filters.area) || {};
      filtered = group.values || [];
      console.log("FILTERED", filtered);
    }
    setFilteredTweets(filtered);
  }, [tweets]);

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
