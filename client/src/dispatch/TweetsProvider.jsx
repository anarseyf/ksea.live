import React, { createContext } from "react";
import { useState, useEffect } from "react";
import { getTweets, getTweetsForArea, getTweetsByType } from "../api";
export const TweetsContext = createContext();

const useTweets = (filters = {}) => {
  const [allTweets, setAllTweets] = useState([]);
  const [filteredByArea, setFilteredByArea] = useState([]);
  const [groupedByType, setGroupedByType] = useState([]);

  console.log("useTweets/filters", filters);

  useEffect(() => {
    const fetch = async () => {
      const tweets = await getTweets();
      setAllTweets(tweets);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const area = filters.area || "seattle";
      const filtered = await getTweetsForArea(area);
      setFilteredByArea(filtered);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const area = filters.area || "seattle";
      const filtered = await getTweetsForArea(area);
      setFilteredByArea(filtered);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const grouped = await getTweetsByType();
      setGroupedByType(grouped);
    };
    fetch();
  }, []);

  return [allTweets, filteredByArea, groupedByType];
};

export const TweetsProvider = ({ filters, children }) => {
  const value = useTweets(filters);
  return (
    <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>
  );
};
