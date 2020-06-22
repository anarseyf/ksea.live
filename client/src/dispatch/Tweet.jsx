import React, { useContext } from "react";
import styles from "./tweet.module.scss";
import { UserContext, UserContextKeys } from "./UserProvider";
import { AreaAccessors } from "../groupingOptions";
import { TweetDetails } from "./TweetDetails";
import {
  timeFormatter,
  isActive,
  isAtLeastSev1,
  isAtLeastSev2,
  isPhone,
} from "../clientUtils";
import { SvgDot } from "./SvgDot";
import classnames from "classnames";

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

  const area = AreaAccessors.AreaSecondary(tweet);

  const isGreyedOut = mode === TweetModes.GreyedOut;
  const isDetailed = mode === TweetModes.Detailed;
  const time = timeFormatter(tweet.derived.timestamp);
  const phone = isPhone();

  return (
    <div
      className={classnames(styles.container, {
        [styles.detailed]: isDetailed,
        [styles.greyedOut]: isGreyedOut,
        [styles.phone]: phone,
      })}
      onClick={handleClick}
    >
      <div className={styles.tweet}>
        <div className={styles.details}>
          <span className={styles.location}>
            {!phone && (
              <span>
                {area}
                {tweet.created_at} @{" "}
              </span>
            )}
            {time}
          </span>
        </div>
        <div className={classnames({ [styles.active]: active })}>
          <SvgDot active={active} sev1={sev1} sev2={sev2} />
          <span> {tweet.derived.description}</span>
        </div>
      </div>
      {isDetailed && <TweetDetails tweet={tweet} />}
    </div>
  );
};
