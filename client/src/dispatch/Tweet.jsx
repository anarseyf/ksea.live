import React, { useContext, useEffect, useState } from "react";
import styles from "./tweet.module.scss";
import { Mappers, GroupByOptions } from "../groupby";
import { useLegend } from "./useLegend";
import { UserContext, UserContextKeys } from "./UserProvider";

const iconSize = 25;

export function Tweet({ tweet }) {
  const [user, setSelection] = useContext(UserContext);
  const selectedTweet = user[UserContextKeys.SelectedTweet];
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedTweet && selectedTweet.id_str === tweet.id_str);
  }, [selectedTweet]);

  const groupedby = GroupByOptions.IncidentType;
  const key = Mappers[groupedby](tweet);
  const legend = useLegend();
  let color = "purple";

  if (legend[groupedby]) {
    const item = legend[groupedby].find((d) => d.key === key);
    item && (color = item.color);
  }

  const handleClick = () => {
    const newSelectedTweet =
      selectedTweet && selectedTweet.id_str === tweet.id_str ? null : tweet;
    setSelection(UserContextKeys.SelectedTweet, newSelectedTweet);
  };

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <div className={styles.tweet}>
        <a href={tweet.derived.tweetUrl} target="_blank">
          <img src={"../twitter.svg"} width={iconSize} height={iconSize} />
        </a>
        {tweet.text}
      </div>
      <div className={styles.location}>{tweet.derived.zip}</div>
      <div className={styles.type} style={{ color }}>
        {key}
      </div>
    </div>
  );
}
