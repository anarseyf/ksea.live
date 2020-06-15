import React, { createContext } from "react";
import { useState, useEffect } from "react";
import {
  getTweetsForArea,
  getTweetsByArea,
  getTweetsByType,
  getHistoryForArea,
  getAnnotations,
  getMostRecentId,
  getTweetsActive,
  getTweetsMajor,
} from "../api";
export const TweetsContext = createContext();

export const currentInterval = (dataset) => dataset[0].intervals[0];
export const previousInterval = (dataset) => dataset[0].intervals[1];

const useMostRecent = () => {
  const interval = 60 * 1000;
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
  const [groupedByArea, setGroupedByArea] = useState([]);
  const [historyForArea, setHistoryForArea] = useState([]);
  const [active, setActive] = useState([]);
  const [major, setMajor] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    (async () => {
      const area = filters.area || "seattle";
      setFilteredByArea(await getTweetsForArea(area));
    })();

    (async () => {
      setByTypeForArea(await getTweetsByType(filters.area || "seattle"));
    })();

    (async () => {
      setGroupedByArea(await getTweetsByArea());
    })();

    (async () => {
      const area = filters.area || "seattle";
      setHistoryForArea(await getHistoryForArea(area));
    })();

    (async () => {
      setAnnotations(await getAnnotations());
    })();

    (async () => {
      const response = await getTweetsActive();
      setActive(response[0].intervals[0].values);
    })();

    (async () => {
      const response = await getTweetsMajor();
      setMajor(response[0].intervals[0].values);
    })();
  }, [mostRecentId]);

  return {
    filteredByArea,
    byTypeForArea,
    groupedByArea,
    historyForArea,
    annotations,
    active,
    major,
  };
};

export const TweetsProvider = ({ filters, children }) => {
  const value = useTweets(filters);
  return (
    <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>
  );
};
