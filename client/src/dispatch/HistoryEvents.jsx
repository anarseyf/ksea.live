import React, { useContext, useEffect, useState } from "react";
import * as d3 from "d3";
import classnames from "classnames";
import styles from "./historyevents.module.scss";
import svgStyles from "./svg.module.scss";

import { DataContext, currentInterval, previousInterval } from "./DataProvider";

export const HistoryEvents = ({ scales }) => {
  const { history } = useContext(DataContext);
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    if (!history.length || !scales.length) {
      return;
    }
    const radius = 4,
      sev1Radius = radius + 2,
      sev2Radius = radius + 4;
    const intervalCurrent = currentInterval(history);
    const intervalPrevious = previousInterval(history);
    const binsCurrent = intervalCurrent.binsLowRes;
    const binsPrevious = intervalPrevious.binsLowRes;
    const [, yScale] = scales;

    const filter = ({ sev2 }) => sev2 > 0;
    const mapper = ({ x0, sev2 }) => ({ timestamp: x0, count: sev2 });
    const stack = ({ timestamp, count }) =>
      [...new Array(count)].map((_, index) => ({ timestamp, index }));
    const sev2Current = binsCurrent.filter(filter).map(mapper).flatMap(stack);
    const circlesCurrent = sev2Current.map(({ timestamp, index }) => ({
      key: `${timestamp}-${index}`,
      cx: (index + 0.75) * 2 * radius,
      cy: yScale(timestamp),
      r: radius,
    }));

    const newCircles = [...circlesCurrent];
    setCircles(newCircles);
  }, [history, scales]);

  return (
    <g>
      {circles.map(({ key, cx, cy, r }) => (
        <g key={key} className={classnames({ [svgStyles.current]: true })}>
          <circle cx={cx} cy={cy} r={r} />
        </g>
      ))}
    </g>
  );
};
