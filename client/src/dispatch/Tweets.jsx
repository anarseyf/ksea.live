import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";
import styles from "./tweets.module.css";
import { Tweet } from "./Tweet";

export function Tweets() {
  const [_, tweets] = useContext(TweetsContext);
  if (!tweets.length) {
    return null;
  }
  const recentTweets = tweets; //.slice(0, 5);

  return (
    <div className={styles.tweets}>
      {recentTweets.map((t) => (
        <Tweet tweet={t} />
      ))}
    </div>
  );
}
