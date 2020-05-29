import React from "react";
import styles from "./tweet.module.scss";
import { Mappers, GroupByOptions } from "../groupby";
import { useLegend } from "./useLegend";

const iconSize = 25;

export function Tweet({ tweet }) {
  console.log(tweet.derived);
  const groupby = GroupByOptions.IncidentType;
  const key = Mappers[groupby](tweet);
  const [legend] = useLegend();
  console.log("TWEET/legend", legend);
  let color = "purple";
  if (legend[groupby]) {
    const item = legend[groupby].find((d) => d.key === key);
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
