import React, { useContext, useEffect, useState } from "react";
import classnames from "classnames";
import svgStyles from "./svg.module.scss";

import { DataContext, currentInterval, previousInterval } from "./DataProvider";

export const HistoryEvents = ({ scales, dayHeight = 4 }) => {
  const { history } = useContext(DataContext);
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    if (!history.length || !scales.length) {
      return;
    }
    const intervalCurrent = currentInterval(history);
    const intervalPrevious = previousInterval(history);
    const binsCurrent = intervalCurrent.binsLowRes;
    const binsPrevious = intervalPrevious.binsLowRes;
    const [, yScale] = scales;

    const radius = dayHeight / 2 + 2;
    const filter = ({ sev2 }) => sev2 > 0;
    const mapper = ({ x0, sev2 }) => ({ timestamp: x0, count: sev2 });
    const stack = ({ timestamp, count }) =>
      [...new Array(count)].map((_, index) => ({ timestamp, index }));
    const sev2Current = binsCurrent.filter(filter).map(mapper).flatMap(stack);
    const sev2Previous = binsPrevious.filter(filter).map(mapper).flatMap(stack);

    const toCirclesGen = (side) => ({ timestamp, index }) => ({
      key: `${timestamp}-${index}-${side}`,
      cx: side * (index + 0.75) * 2 * radius,
      cy: yScale(timestamp),
      r: radius,
      isCurrent: side === 1,
    });
    const toCirclesCurrent = toCirclesGen(1);
    const toCirclesPrevious = toCirclesGen(-1);

    const circlesCurrent = sev2Current.map(toCirclesCurrent);
    const circlesPrevious = sev2Previous.map(toCirclesPrevious);

    const newCircles = [...circlesPrevious, ...circlesCurrent];
    setCircles(newCircles);
  }, [dayHeight, history, scales]);

  return (
    <g>
      {circles.map(({ key, cx, cy, r, isCurrent }) => (
        <g
          key={key}
          className={classnames({
            [svgStyles.current]: isCurrent,
            [svgStyles.previous]: !isCurrent,
          })}
        >
          <circle cx={cx} cy={cy} r={r} />
        </g>
      ))}
    </g>
  );
};
