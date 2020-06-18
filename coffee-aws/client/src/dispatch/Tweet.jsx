import React, { useContext, useEffect, useState } from "react";
import styles from "./tweet.module.scss";
import { UserContext, UserContextKeys } from "./UserProvider";
import { AreaAccessors, GroupByOptions } from "../groupingOptions";
import { TweetDetails } from "./TweetDetails";
import {
  toPacificStr,
  isActive,
  isAtLeastSev1,
  isAtLeastSev2,
} from "../clientUtils";
import { SvgDot } from "./SvgDot";

export const TweetModes = {
  Default: 0,
  Detailed: 1,
  GreyedOut: 2,
};

export const Tweet = ({ tweet, mode = TweetModes.Default }) => {
  const { user, setSelection } = useContext(UserContext);
  const selectedTweet = user[UserContextKeys.SelectedTweet];

  const handleClick = () => {
    const newSelectedTweet =
      selectedTweet && selectedTweet.id_str === tweet.id_str ? null : tweet;
    setSelection(UserContextKeys.SelectedTweet, newSelectedTweet);
  };
  const active = isActive(tweet);
  const sev1 = isAtLeastSev1(tweet);
  const sev2 = isAtLeastSev2(tweet);

  const accessor = AreaAccessors.AreaSecondary;
  const area = accessor(tweet);

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
          <SvgDot active={active} sev1={sev1} sev2={sev2} />
        </div>
        <div>
          {tweet.derived.description}
        </div>
      </div>
      {isDetailed && <TweetDetails tweet={tweet} />}
    </div>
  );
};
