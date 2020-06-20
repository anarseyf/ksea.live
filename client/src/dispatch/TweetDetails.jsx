import React from "react";
import styles from "./tweetdetails.module.scss";

export const TweetDetails = ({
  tweet: {
    derived: { timestamp, address, units, type, color, lat, long },
  },
}) => {
  const unitsList = units.split(" ");
  const unitsStr = `${unitsList.length} ${
    unitsList.length === 1 ? "unit" : "units"
  } dispatched:`;

  const format = (n) => Number.parseFloat(n).toFixed(3);
  const coordinates = `${format(lat)}°N ${format(-long)}°W`;
  return (
    <div className={styles.container}>
      <div>{address}</div>
      <div className={styles.latlong}>{coordinates}</div>
      <div>
        <span>{unitsStr}</span>
        {unitsList.map((unit) => (
          <span key={unit} className={styles.unit}>{unit}</span>
        ))}
      </div>
    </div>
  );
};
