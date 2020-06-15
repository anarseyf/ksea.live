import React, { useContext, useEffect, useState } from "react";
import styles from "./tweet.module.scss";
import { UserContext, UserContextKeys } from "./UserProvider";
import { AreaAccessors, GroupByOptions } from "../groupingOptions";
import { TweetDetails } from "./TweetDetails";
import { toPacificStr } from "../clientUtils";

export const TweetModes = {
  Default: 0,
  Detailed: 1,
  GreyedOut: 2,
};

const iconSize = 25;

export const Tweet = ({ tweet, mode = TweetModes.Default }) => {
  const { user, setSelection } = useContext(UserContext);
  const selectedTweet = user[UserContextKeys.SelectedTweet];

  const handleClick = () => {
    const newSelectedTweet =
      selectedTweet && selectedTweet.id_str === tweet.id_str ? null : tweet;
    setSelection(UserContextKeys.SelectedTweet, newSelectedTweet);
  };
  const active = tweet.derived.active;
  const sev1 = tweet.derived.severity >= 1;
  const sev2 = tweet.derived.severity >= 2;
  const color = active ? "red" : "white";

  const accessor = AreaAccessors.AreaSecondary;
  const area = accessor(tweet);
  const size = 15,
    innerRadius = 2,
    sev1Radius = 5,
    sev2Radius = 8;
  const isGreyedOut = mode === TweetModes.GreyedOut;
  const isDetailed = mode === TweetModes.Detailed;
  const time = toPacificStr(tweet.derived.timestamp);

  return (
    <div
      className={`${styles.container} ${isDetailed ? styles.detailed : ""} ${
        isGreyedOut ? styles.greyedOut : ""
      }`}
      onClick={handleClick}
    >
      <div className={styles.tweet}>
        <div className={styles.details}>
          <span className={styles.location}>
            {area} @ {time}
          </span>
          <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={innerRadius} fill={color} />
            {sev1 && (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={sev1Radius}
                fill="none"
                stroke={color}
              />
            )}
            {sev2 && (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={sev2Radius}
                fill="none"
                stroke={color}
              />
            )}
          </svg>
        </div>
        <div>
          <span>{tweet.derived.description}</span>
        </div>
      </div>
      {isDetailed && <TweetDetails tweet={tweet} />}
    </div>
  );
};
