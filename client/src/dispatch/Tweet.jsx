import React, { useContext, useEffect, useState } from "react";
import styles from "./tweet.module.scss";
import { useLegend } from "./useLegend";
import { UserContext, UserContextKeys } from "./UserProvider";
import { AreaAccessors, GroupByOptions } from "../groupingOptions";

const iconSize = 25;

export function Tweet({ tweet }) {
  const { user, setSelection } = useContext(UserContext);
  const selectedTweet = user[UserContextKeys.SelectedTweet];
  const [isSelected, setIsSelected] = useState(false);
  const [legend] = useLegend();

  useEffect(() => {
    setIsSelected(selectedTweet && selectedTweet.id_str === tweet.id_str);
  }, [selectedTweet]);

  let color = "purple";

  const handleClick = () => {
    const newSelectedTweet =
      selectedTweet && selectedTweet.id_str === tweet.id_str ? null : tweet;
    setSelection(UserContextKeys.SelectedTweet, newSelectedTweet);
  };

  const accessor = AreaAccessors.Default;
  const area = accessor(tweet);

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <div className={styles.tweet}>
        <div className={styles.location}>{area}</div>
        <a href={tweet.derived.tweetUrl} target="_blank">
          <img src={"../twitter.svg"} width={iconSize} height={iconSize} />
        </a>
        {tweet.text}
      </div>
    </div>
  );
}
