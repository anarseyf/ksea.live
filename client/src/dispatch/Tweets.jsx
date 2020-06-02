import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";
import styles from "./tweets.module.scss";
import { Tweet } from "./Tweet";

export function Tweets() {
  const { filteredByArea } = useContext(TweetsContext);
  if (!filteredByArea.length) {
    return null;
  }
  const recentTweets = filteredByArea; //.slice(0, 5);

  return (
    <div className={styles.tweets}>
      {recentTweets.map((t) => (
        <Tweet tweet={t} />
      ))}
    </div>
  );
}
