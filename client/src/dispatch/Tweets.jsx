import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";
import styles from "./tweets.module.css";
import { Tweet } from "./Tweet";

export function Tweets() {
  const allTweets = useContext(TweetsContext);
  if (!allTweets.length) {
    return null;
  }
  const tweets = allTweets.slice(0, 5);

  return (
    <div className={styles.tweets}>
      {tweets.map((t) => (
        <Tweet tweet={t} />
      ))}
    </div>
  );
}
