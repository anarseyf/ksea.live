import React, { createContext, useState, useEffect } from "react";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { defaultCentroid } from "./geojson";
import { pacificMidnight } from "../clientUtils";

export const ThemeContext = createContext();

const useTheme = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const midnight = new Date(pacificMidnight());
    const nextMidnight = new Date(pacificMidnight(1));
    const sunrise = getSunrise(...defaultCentroid, midnight);
    const sunset = getSunset(...defaultCentroid, nextMidnight);

    const now = new Date();
    const threshold = 0.5 * 3600 * 1000;
    if (
      Math.abs(now - sunrise) < threshold ||
      Math.abs(now - sunset) < threshold
    ) {
      setTheme("dusk");
    } else if (now < sunrise || now > sunset) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    setTheme("light"); // TODO - remove
  }, []);

  return { theme, setTheme };
};

export const ThemeProvider = ({ children }) => {
  const value = useTheme();
  const { theme } = value;
  return (
    <ThemeContext.Provider value={value}>
      <div id="app" className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};
