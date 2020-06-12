import React, { useContext, useEffect, useState } from "react";
import styles from "./tweet.module.scss";
import { UserContext, UserContextKeys } from "./UserProvider";
import { AreaAccessors, GroupByOptions } from "../groupingOptions";
import { TweetDetails } from "./TweetDetails";

export const TweetModes = {
  Default: 0,
  Detailed: 1,
  GreyedOut: 2,
};

const iconSize = 25;

export function Tweet({ tweet, mode = TweetModes.Default }) {
  const { user, setSelection } = useContext(UserContext);
  const selectedTweet = user[UserContextKeys.SelectedTweet];

  const handleClick = () => {
    const newSelectedTweet =
      selectedTweet && selectedTweet.id_str === tweet.id_str ? null : tweet;
    setSelection(UserContextKeys.SelectedTweet, newSelectedTweet);
  };

  const accessor = AreaAccessors.AreaSecondary;
  const area = accessor(tweet);
  const size = 10,
    r = 5;
  const color = tweet.derived.color || "silver";
  const isGreyedOut = mode === TweetModes.GreyedOut;
  const isDetailed = mode === TweetModes.Detailed;

  return (
    <div
      className={`${styles.container} ${isDetailed ? styles.detailed : ""} ${
        isGreyedOut ? styles.greyedOut : ""
      }`}
      onClick={handleClick}
    >
      <div className={styles.tweet}>
        <div className={styles.details}>
          <span className={styles.location}>{area}</span>
          <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={r} fill={color} />
          </svg>
        </div>
        <div>
          <span>{tweet.derived.description}</span>
        </div>
      </div>
      {isDetailed && <TweetDetails tweet={tweet} />}
    </div>
  );
}
