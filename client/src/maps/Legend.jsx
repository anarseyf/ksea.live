import React, { useEffect, useState } from "react";
import { useTweets } from "./useTweets";
import { byType } from "../groupby";

const size = 12;

export function Legend() {
  const [tweets] = useTweets();
  const [legend, setLegend] = useState({});
  const subLegend = legend.type;

  useEffect(() => {
    if (!tweets.length) {
      return;
    }
    const tweetsByType = byType(tweets);
    console.log("LEGEND/tweetsByType", tweetsByType);
    const legendByType = tweetsByType.map(({ key, color, values }) => ({
      key,
      color,
      total: values.length,
    }));
    const groupby = tweetsByType[0].groupby;
    const newSubLegend = { [groupby]: legendByType };
    setLegend({ ...legend, ...newSubLegend });
  }, [tweets]);

  if (!subLegend) {
    return null;
  }
  return subLegend.map((d) => (
    <div>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill={d.color || "white"}
        ></circle>
      </svg>
      <span>
        {d.key}: {d.total}
      </span>
    </div>
  ));
}
