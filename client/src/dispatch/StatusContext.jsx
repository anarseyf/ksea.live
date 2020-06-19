import React, { createContext, useState, useEffect } from "react";
import { getStatus } from "../api";
const deepEqual = require("fast-deep-equal/es6/react");

export const StatusContext = createContext();

const useStatus = () => {
  const [status, setStatus] = useState({});
  const [previousStatus, setPreviousStatus] = useState({});

  useEffect(() => {
    const delay = 60 * 1000;

    console.log(
      `🟥 useStatus/starting checker @ every ${delay / 1000} seconds`
    );
    const checkForUpdates = async () => {
      const newStatus = await getStatus();
      console.log(
        `useStatus(${intervalId})/current status (next check in ${
          delay / 1000
        } sec)`,
        newStatus
      );

      if (!deepEqual(status, newStatus)) {
        console.log("useStatus/setting new status:", newStatus);
        setPreviousStatus(status);
        setStatus(newStatus);
      }

      if (status.env === "development") {
        document.title = "KSEA.live (dev)";
      }
    };

    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, delay);
    return () => clearInterval(intervalId);
  }, [status]);

  return { status, previousStatus };
};

export const StatusProvider = ({ children }) => {
  const value = useStatus();
  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
};
