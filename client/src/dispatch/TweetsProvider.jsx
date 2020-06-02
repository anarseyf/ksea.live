import React, { createContext } from "react";
import { useState, useEffect } from "react";
import {
  getTweets,
  getTweetsForArea,
  getTweetsByType,
  getTweetsByAreaByType,
} from "../api";
export const TweetsContext = createContext();

const useTweets = (filters = {}) => {
  const [allTweets, setAllTweets] = useState([]);
  const [filteredByArea, setFilteredByArea] = useState([]);
  const [groupedByType, setGroupedByType] = useState([]);
  const [groupedByAreaByType, setGroupedByAreaByType] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const tweets = await getTweets();
      console.log("PROVIDER/all", tweets);
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
      const grouped = await getTweetsByType();
      setGroupedByType(grouped);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const grouped = await getTweetsByAreaByType();
      setGroupedByAreaByType(grouped);
    };
    fetch();
  }, []);

  return { allTweets, filteredByArea, groupedByType, groupedByAreaByType };
};

export const TweetsProvider = ({ filters, children }) => {
  const value = useTweets(filters);
  return (
    <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>
  );
};
