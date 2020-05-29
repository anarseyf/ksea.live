import React from "react";
import styles from "./tweet.module.css";

const iconSize = 30;

export function Tweet({ tweet }) {
  console.log(tweet.derived);
  return (
    <div className={styles.tweet}>
      <a href={tweet.derived.tweetUrl} target="_blank">
        <img src={"../twitter.svg"} width={iconSize} height={iconSize} />
      </a>
      {tweet.text}
    </div>
  );
}
