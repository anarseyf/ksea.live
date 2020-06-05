import React, { createContext } from "react";
import { useState, useEffect } from "react";
import {
  getTweets,
  getTweetsForArea,
  getTweetsByType,
  getTweetsByAreaByType,
  getMostRecentId,
} from "../api";
export const TweetsContext = createContext();

export const currentInterval = (dataset) => dataset[0].intervals[0];

const useMostRecent = () => {
  let intervalId;
  const [mostRecentId, setMostRecentId] = useState("");

  useEffect(() => {
    console.log(
      "useMostRecent/starting update checker (should only happen once!)"
    );

    const checkForUpdates = async () => {
      const newId = await getMostRecentId();
      console.log(`useMostRecent[${intervalId}]/most recent: '${newId}'`);
      setMostRecentId(newId);
    };

    intervalId = setInterval(checkForUpdates, 5000);
  }, []);

  return mostRecentId;
};

const useTweets = (filters = {}) => {
  const mostRecentId = useMostRecent();
  const [allTweets, setAllTweets] = useState([]);
  const [filteredByArea, setFilteredByArea] = useState([]);
  const [groupedByType, setGroupedByType] = useState([]);
  const [groupedByAreaByType, setGroupedByAreaByType] = useState([]);

  useEffect(() => {
    (async () => {
      console.log("useTweets/fetching all");
      const tweets = await getTweets();
      setAllTweets(currentInterval(tweets).values);
    })();

    (async () => {
      const area = filters.area || "seattle";
      const filtered = await getTweetsForArea(area);
      setFilteredByArea(filtered);
    })();

    (async () => {
      const grouped = await getTweetsByType();
      setGroupedByType(grouped);
    })();

    (async () => {
      const grouped = await getTweetsByAreaByType();
      setGroupedByAreaByType(grouped);
    })();
  }, [mostRecentId]);

  return {
    allTweets,
    filteredByArea,
    groupedByType,
    groupedByAreaByType,
  };
};

export const TweetsProvider = ({ filters, children }) => {
  const value = useTweets(filters);
  return (
    <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>
  );
};
