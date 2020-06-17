import React, { createContext } from "react";
import { useState, useEffect } from "react";
import {
  getTweetsForArea,
  getTweetsByArea,
  getTweetsByType,
  getHistory,
  getAnnotations,
  getTweetsActive24,
  getTweetsMajor24,
  getStatus,
} from "../api";
const deepEqual = require("fast-deep-equal/es6/react");
export const TweetsContext = createContext();

export const currentInterval = (dataset) => dataset[0].intervals[0];
export const previousInterval = (dataset) => dataset[0].intervals[1];

const useStatus = () => {
  const [status, setStatus] = useState({});
  const [previousStatus, setPreviousStatus] = useState({});

  useEffect(() => {
    const delay = 10 * 1000;

    console.log("🔺useStatus/starting checker (should only happen once!)");

    const checkForUpdates = async () => {
      const newStatus = await getStatus();
      console.log(
        `useStatus(${intervalId})/new status (next check in ${
          delay / 1000
        } sec)`,
        newStatus
      );

      if (!deepEqual(newStatus, status)) {
        console.log("useStatus/setting new status:", newStatus);
        setPreviousStatus({ ...status });
        setStatus(newStatus);
      }
    };

    const intervalId = setInterval(checkForUpdates, delay);
    return () => clearInterval(intervalId);
    //   XXXXXX   eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { status, previousStatus };
};

const useTweets = (filters = {}) => {
  const initialValue = {
    filteredByArea: [],
    activeOrMajorForArea: [],
    activeOrMajorByArea: [],
    byTypeForArea: [],
    groupedByArea: [],
    history: [],
    active24: [],
    major24: [],
    annotations: [],
  };
  const [value, setValue] = useState(initialValue);
  const { status, previousStatus } = useStatus();
  console.log(
    `useTweets/most recent:${status.mostRecentId}, previous:${previousStatus.mostRecentId}`
  );
  const mostRecentId = previousStatus.mostRecentId
    ? status.mostRecentId
    : undefined;

  const [filteredByArea, setFilteredByArea] = useState([]);
  const [activeOrMajorForArea, setActiveOrMajorForArea] = useState([]);
  const [activeOrMajorByArea, setActiveOrMajorByArea] = useState([]);
  const [byTypeForArea, setByTypeForArea] = useState([]);
  const [groupedByArea, setGroupedByArea] = useState([]);
  const [history, setHistory] = useState([]);
  const [active24, setActive24] = useState([]);
  const [major24, setMajor24] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    console.log("🟢 PROVIDER/fetching all data");

    (async () => {
      const area = filters.area || "seattle";
      setFilteredByArea(await getTweetsForArea(area));
    })();

    (async () => {
      const area = filters.area || "seattle";
      setActiveOrMajorForArea(
        await getTweetsForArea(area, { activeOrMajor: true })
      );
    })();

    (async () => {
      setByTypeForArea(await getTweetsByType(filters.area || "seattle"));
    })();

    (async () => {
      setGroupedByArea(await getTweetsByArea());
    })();

    (async () => {
      setActiveOrMajorByArea(
        await getTweetsByArea({ activeOrMajor: true, minimize: false })
      );
    })();

    (async () => {
      const area = filters.area || "seattle";
      setHistory(await getHistory(area));
    })();

    (async () => {
      setAnnotations(await getAnnotations());
    })();

    (async () => {
      const response = await getTweetsActive24();
      setActive24(response[0].intervals[0].values);
    })();

    (async () => {
      const response = await getTweetsMajor24();
      setMajor24(response[0].intervals[0].values);
    })();
  }, [filters.area, mostRecentId]);

  useEffect(() => {
    setValue({
      filteredByArea,
      byTypeForArea,
      groupedByArea,
      history,
      annotations,
      active24,
      major24,
      activeOrMajorForArea,
      activeOrMajorByArea,
    });
  }, [
    active24,
    activeOrMajorByArea,
    activeOrMajorForArea,
    annotations,
    byTypeForArea,
    filteredByArea,
    groupedByArea,
    history,
    major24,
  ]);

  return value;
};

export const TweetsProvider = ({ filters, children }) => {
  const value = useTweets(filters);
  return (
    <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>
  );
};
