import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getTweetsForArea,
  getTweetsByArea,
  getHistory,
  getAnnotations,
  getTweetsActive24,
  getTweetsMajor,
  getTweetsForAreaMin,
  getTweetsForAreaMinWeek,
} from "../api";

import { StatusContext } from "./StatusContext";
const deepEqual = require("fast-deep-equal/es6/react");

export const DataContext = createContext();

export const currentInterval = (dataset) => dataset[0].intervals[0];
export const previousInterval = (dataset) => dataset[0].intervals[1];

const useTweets = (filters = {}) => {
  const initialValue = {
    filteredByArea: [],
    filteredByAreaMin: [],
    filteredByAreaMinWeek: [],
    activeOrMajorForArea: [],
    activeOrMajorByArea: [],
    groupedByArea: [],
    history: [],
    active24: [],
    major24: [],
    annotations: [],
    status: {},
  };
  const [value, setValue] = useState(initialValue);
  const { status, previousStatus } = useContext(StatusContext);
  const mostRecentId = previousStatus.mostRecentId
    ? status.mostRecentId
    : undefined;

  if (mostRecentId) {
    console.log(`useTweets/mostRecentId: ${mostRecentId}`);
  }

  const [filteredByArea, setFilteredByArea] = useState([]);
  const [filteredByAreaMin, setFilteredByAreaMin] = useState([]);
  const [filteredByAreaMinWeek, setFilteredByAreaMinWeek] = useState([]);
  const [activeOrMajorForArea, setActiveOrMajorForArea] = useState([]);
  const [activeOrMajorByArea, setActiveOrMajorByArea] = useState([]);
  const [groupedByArea, setGroupedByArea] = useState([]);
  const [history, setHistory] = useState([]);
  const [active24, setActive24] = useState([]);
  const [major24, setMajor24] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    if (!deepEqual(status, previousStatus)) {
      setShouldFetch(true);
    }
  }, [status, previousStatus]);

  useEffect(() => {
    if (!shouldFetch) {
      console.log("PROVIDER/not fetching");
      return;
    }
    console.log("🟢 PROVIDER/fetching all data");
    setShouldFetch(false);

    const area = filters.area || "seattle";

    console.log("PROVIDER/filters.area=", area);
    if (area === "seattle") {
      (async () => {
        setFilteredByAreaMin(await getTweetsForAreaMin(area));
        setFilteredByAreaMinWeek(await getTweetsForAreaMinWeek(area));
      })();
    }

    (async () => {
      setFilteredByArea(await getTweetsForArea(area));
    })();

    (async () => {
      setActiveOrMajorForArea(
        await getTweetsForArea(area, { activeOrMajor: true })
      );
    })();

    (async () => {
      const response = await getTweetsActive24();
      setActive24(response[0].intervals[0].values);
    })();

    (async () => {
      const response = await getTweetsMajor();
      setMajor24(response[0].intervals[0].values);
    })();

    (async () => {
      setGroupedByArea(await getTweetsByArea());
    })();

    (async () => {
      setActiveOrMajorByArea(await getTweetsByArea({ activeOrMajor: true }));
    })();

    (async () => {
      setAnnotations(await getAnnotations());
    })();

    if (!history.length) {
      (async () => {
        setHistory(await getHistory(area));
      })();
    }
  }, [filters.area, history.length, mostRecentId, shouldFetch]);

  useEffect(() => {
    setValue({
      filteredByArea,
      filteredByAreaMin,
      filteredByAreaMinWeek,
      groupedByArea,
      history,
      annotations,
      active24,
      major24,
      activeOrMajorForArea,
      activeOrMajorByArea,
      status,
    });
  }, [
    active24,
    activeOrMajorByArea,
    activeOrMajorForArea,
    annotations,
    filteredByArea,
    filteredByAreaMin,
    filteredByAreaMinWeek,
    groupedByArea,
    history,
    major24,
    status,
  ]);

  return value;
};

export const DataProvider = ({ filters, children }) => {
  const value = useTweets(filters);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
