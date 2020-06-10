import React, { useContext } from "react";
import { TweetsContext, currentInterval } from "./TweetsProvider";
import styles from "./tweets.module.scss";
import { Tweet } from "./Tweet";
import { UserContextKeys, UserContext } from "./UserProvider";

export function Tweets() {
  const { filteredByArea } = useContext(TweetsContext);
  const { user } = useContext(UserContext);
  const filter = user[UserContextKeys.TypeFilter];

  if (!filteredByArea.length) {
    return null;
  }
  const all = currentInterval(filteredByArea).values;
  const filtered = all.filter(
    ({ derived: { type } }) => !filter || filter === type
  );

  return (
    <div className={styles.tweets}>
      {filtered.map((t) => (
        <Tweet tweet={t} />
      ))}
    </div>
  );
}
