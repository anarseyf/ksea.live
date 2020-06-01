import React from "react";
import styles from "./tweet.module.scss";
import { Mappers, GroupByOptions } from "../groupby";
import { useLegend } from "./useLegend";

const iconSize = 25;

export function Tweet({ tweet }) {
  const groupedby = GroupByOptions.IncidentType;
  const key = Mappers[groupedby](tweet);
  const legend = useLegend();
  let color = "purple";

  if (legend[groupedby]) {
    const item = legend[groupedby].find((d) => d.key === key);
    item && (color = item.color);
  }

  return (
    <div className={styles.container}>
      <div className={styles.tweet}>
        <a href={tweet.derived.tweetUrl} target="_blank">
          <img src={"../twitter.svg"} width={iconSize} height={iconSize} />
        </a>
        {tweet.text}
      </div>
      <div className={styles.location}>{tweet.derived.zip}</div>
      <div className={styles.type} style={{ color }}>
        {key}
      </div>
    </div>
  );
}
