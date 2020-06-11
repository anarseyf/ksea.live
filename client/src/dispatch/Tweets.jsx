import React, { useContext } from "react";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import styles from "./tweets.module.scss";
import { Tweet, TweetModes } from "./Tweet";
import { UserContextKeys, UserContext } from "./UserProvider";
import { TweetDetails } from "./TweetDetails";

export function Tweets() {
  const { filteredByArea } = useContext(TweetsContext);
  const { user } = useContext(UserContext);
  const filter = user[UserContextKeys.TypeFilter];
  const selected = user[UserContextKeys.SelectedTweet];

  if (!filteredByArea.length) {
    return null;
  }
  const all = currentInterval(filteredByArea).values;
  const filtered = all.filter(
    ({ derived: { type } }) => !filter || filter === type
  );

  const mode = ({ id_str }) =>
    selected
      ? id_str === selected.id_str
        ? TweetModes.Detailed
        : TweetModes.GreyedOut
      : TweetModes.Default;

  return (
    <div className={styles.tweets}>
      {filtered.map((t) => (
        <Tweet tweet={t} mode={mode(t)} />
      ))}
    </div>
  );
}
