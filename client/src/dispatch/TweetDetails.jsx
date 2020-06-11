import React from "react";
import styles from "./tweetdetails.module.scss";

export const TweetDetails = ({
  tweet: {
    derived: { resolvedAddress, time, units, type, color, lat, long },
  },
}) => {
  const unitsList = units.split(" ");
  const unitsStr = `${unitsList.length} ${
    unitsList.length === 1 ? "unit" : "units"
  } dispatched at ${time}`;

  const format = (n) => Number.parseFloat(n).toFixed(3);
  const coordinates = `${format(lat)}°N ${format(-long)}°W`;
  return (
    <div className={styles.container}>
      <div className={styles.explanation} style={{ color }}>
        {type}
      </div>
      <div>{resolvedAddress}</div>
      <div className={styles.latlong}>{coordinates}</div>
      <div className={styles.explanation}>{unitsStr}</div>
      <div>
        {unitsList.map((unit) => (
          <span className={styles.unit}>{unit}</span>
        ))}
      </div>
    </div>
  );
};
