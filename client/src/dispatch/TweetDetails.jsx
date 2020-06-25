import React from "react";
import styles from "./tweetdetails.module.scss";
import { isPhone } from "../clientUtils";
import { AreaAccessors } from "../groupingOptions";

export const TweetDetails = ({tweet}) => {
  const { address, units, lat, long } = tweet.derived;
  const { id_str } = tweet;
  // const url = `https://data.seattle.gov/resource/fire-911.json?incident_number=${id_str}`;
  const unitsList = units.split(" ");
  const unitsStr = `${unitsList.length} ${
    unitsList.length === 1 ? "unit" : "units"
  } dispatched:`;
  const area = AreaAccessors.AreaSecondary(tweet);
  const phone = isPhone();

  const format = (n) => Number.parseFloat(n).toFixed(3);
  const coordinates = lat ? `${format(lat)}°N ${format(-long)}°W` : "";
  // const incidentLink = <a className={styles.link} href={url}>{id_str}</a>;
  return (
    <div className={styles.container}>
      <div>{address}</div>
      {phone && <div className={styles.secondary}>{area}</div>}
      <div className={styles.secondary}>{coordinates}</div>
      <div>
        <span>{unitsStr}</span>
        {unitsList.map((unit) => (
          <span key={unit} className={styles.unit}>{unit}</span>
          ))}
      </div>
      <div className={styles.secondary}>Incident ID {id_str}</div>
    </div>
  );
};
