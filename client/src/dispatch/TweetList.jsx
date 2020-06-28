import React, { useContext } from "react";
import styles from "./tweets.module.scss";
import { Tweet, TweetModes } from "./Tweet";
import { UserContext, UserContextKeys } from "./UserProvider";

export const TweetList = ({ tweets = [], placeholder }) => {
  const { user } = useContext(UserContext);
  const selected = user[UserContextKeys.SelectedTweet];

  const mode = ({ id_str }) =>
    selected
      ? id_str === selected.id_str
        ? TweetModes.Detailed
        : TweetModes.GreyedOut
      : TweetModes.Default; // TODO - remove modes
  
      return (
    <div className={styles.tweets}>
      {tweets.map((t) => (
        <Tweet key={t.id_str} tweet={t} mode={mode(t)} />
      ))}
      {!tweets.length && <div className={styles.placeholder}>{placeholder}</div>}
    </div>
  );
};
