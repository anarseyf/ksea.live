import React, { useContext } from "react";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import styles from "./tweets.module.scss";
import { Tweet } from "./Tweet";

export function Tweets() {
  const { filteredByArea } = useContext(TweetsContext);
  if (!filteredByArea.length) {
    return null;
  }
  const recentTweets = currentInterval(filteredByArea).values;

  return (
    <div className={styles.tweets}>
      {recentTweets.map((t) => (
        <Tweet tweet={t} />
      ))}
    </div>
  );
}
