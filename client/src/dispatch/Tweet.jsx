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

  const handleClick = () => {
    const newSelectedTweet =
      selectedTweet && selectedTweet.id_str === tweet.id_str ? null : tweet;
    setSelection(UserContextKeys.SelectedTweet, newSelectedTweet);
  };

  const accessor = AreaAccessors.AreaSecondary;
  const area = accessor(tweet);
  const units = tweet.derived.units.split(" ").length;
  const unitsStr = `${units} ${units === 1 ? "unit" : "units"}`;
  const size = 10,
    r = 5;
  const color = tweet.derived.color || "silver";

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <div className={styles.tweet}>
        <div className={styles.details}>
          <span className={styles.units}>{unitsStr}</span>
          <span className={styles.location}>{area}</span>
          <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={r} fill={color} />
          </svg>
        </div>
        <div>
          <a href={tweet.derived.tweetUrl} target="_blank">
            <img src={"../twitter.svg"} width={iconSize} height={iconSize} />
          </a>
          <span>{tweet.text}</span>
        </div>
      </div>
    </div>
  );
}
