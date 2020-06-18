import React, { useContext } from "react";
import styles from "./tweets.module.scss";
import { Tweet, TweetModes } from "./Tweet";
import { UserContext, UserContextKeys } from "./UserProvider";

export const TweetList = ({ tweets = [] }) => {
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
        <Tweet tweet={t} mode={mode(t)} />
      ))}
    </div>
  );
};
