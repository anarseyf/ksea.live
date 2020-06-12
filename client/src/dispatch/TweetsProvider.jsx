import React, { createContext } from "react";
import { useState, useEffect } from "react";
import {
  getTweetsForArea,
  getTweetsByArea,
  getTweetsByType,
  getHistoryForArea,
  getMostRecentId,
} from "../api";
export const TweetsContext = createContext();

export const currentInterval = (dataset) => dataset[0].intervals[0];
export const previousInterval = (dataset) => dataset[0].intervals[1];

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
  const [byTypeForArea, setByTypeForArea] = useState([]);
  const [historyForArea, setHistoryForArea] = useState([]);
  const [groupedByArea, setGroupedByArea] = useState([]);

  useEffect(() => {
    (async () => {
      const area = filters.area || "seattle";
      const filtered = await getTweetsForArea(area);
      setFilteredByArea(filtered);
    })();

    (async () => {
      const grouped = await getTweetsByType(filters.area || "seattle");
      setByTypeForArea(grouped);
    })();

    (async () => {
      const grouped = await getTweetsByArea();
      setGroupedByArea(grouped);
    })();

    (async () => {
      const area = filters.area || "seattle";
      const filtered = await getHistoryForArea(area);
      setHistoryForArea(filtered);
    })();
  }, [mostRecentId]);

  return {
    filteredByArea,
    byTypeForArea,
    groupedByArea,
    historyForArea,
  };
};

export const TweetsProvider = ({ filters, children }) => {
  const value = useTweets(filters);
  return (
    <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>
  );
};
