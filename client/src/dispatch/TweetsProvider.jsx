import React, { createContext } from "react";
import { useState, useEffect } from "react";
import {
  getTweets,
  getTweetsForArea,
  getTweetsByArea,
  getTweetsByType,
  getTweetsByAreaByType,
  getMostRecentId,
} from "../api";
export const TweetsContext = createContext();

export const currentInterval = (dataset) => dataset[0].intervals[0];

const useMostRecent = () => {
  const interval = 15 * 1000;
  let intervalId;
  const [mostRecentId, setMostRecentId] = useState("");

  useEffect(() => {
    console.log(
      "useMostRecent/starting update checker (should only happen once!)"
    );

    const checkForUpdates = async () => {
      const newId = await getMostRecentId();
      if (newId !== mostRecentId)
        console.log(
          `useMostRecent[${intervalId}]/'${mostRecentId}' --> '${newId}'`
        );
      setMostRecentId(newId);
    };

    intervalId = setInterval(checkForUpdates, interval);
  }, []);

  return mostRecentId;
};

const useTweets = (filters = {}) => {
  const mostRecentId = useMostRecent();
  const [filteredByArea, setFilteredByArea] = useState([]);
  const [groupedByType, setGroupedByType] = useState([]);
  const [groupedByArea, setGroupedByArea] = useState([]);
  const [groupedByAreaByType, setGroupedByAreaByType] = useState([]);

  useEffect(() => {
    (async () => {
      const area = filters.area || "seattle";
      const filtered = await getTweetsForArea(area);
      setFilteredByArea(filtered);
    })();

    (async () => {
      const grouped = await getTweetsByArea();
      setGroupedByArea(grouped);
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
    filteredByArea,
    groupedByArea,
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
