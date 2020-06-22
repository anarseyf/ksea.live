import React, { useContext } from "react";
import { StatusContext } from "./StatusContext";
import { timeFormatter, timeFormatterUserTimezone } from "../clientUtils";
import styles from "./freshness.module.scss";

export const Freshness = () => {
  const { status = {} } = useContext(StatusContext);

  if (!status.lastUpdated) {
    return <span>&nbsp;</span>;
  }

  const date = new Date(status.lastUpdated);
  const formatTimezone = "h:mma z";
  const formatNoTimezone = "h:mma";
  const seattle = timeFormatter(date, formatNoTimezone);
  const seattleTZ = timeFormatter(date, formatTimezone);
  const user = timeFormatterUserTimezone(date, formatNoTimezone);
  const userTZ = timeFormatterUserTimezone(date, formatTimezone);

  const same = seattle === user;
  const displayUser = same ? "" : ` (${userTZ})`;
  const displaySeattle = same ? seattle : seattleTZ;

  return (
    <span>
      Data is current as of{" "}
      <span className={styles.time}>{displaySeattle}</span>
      {displayUser}.
    </span>
  );
};
