import React, { useContext } from "react";
import { StatusContext } from './StatusContext';
import { timeFormatter, timeFormatterUserTimezone } from '../clientUtils';

export const Freshness = () => {
  const { status = {} } = useContext(StatusContext);

  if (!status.lastUpdated) {
    return <span>&nbsp;</span>;
  }

  const date = new Date(status.lastUpdated);
  const formatTimezone = "h:mma z";
  const formatNoTimezone = "h:mma";
  const seattle = timeFormatter(date, formatNoTimezone);
  const user = timeFormatterUserTimezone(date, formatNoTimezone);
  const userTZ = timeFormatterUserTimezone(date, formatTimezone);

  const same = seattle === user;
  const displayUser = (same) ? user : userTZ;
  const displaySeattle = (same) ? "" : ` (${seattle} in Seattle)`;

  return (
    <span>
      Data is current as of <strong>{displayUser}</strong>{displaySeattle}.
    </span>
  );
}