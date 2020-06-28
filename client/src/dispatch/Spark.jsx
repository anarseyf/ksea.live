import React, { useEffect, useState, useRef } from "react";
import { isPhone, trimmedExtent, timeFormatterHourAM } from "../clientUtils";
import classnames from "classnames";

import {
  scaleLinear as d3scaleLinear,
  scaleTime as d3scaleTime,
} from "d3-scale";
import { max as d3max } from "d3-array";
import { line as d3line, curveCardinal as d3curveCardinal } from "d3-shape";
import { select as d3select } from "d3-selection";
import { axisBottom as d3axisBottom } from "d3-axis";

import styles from "./spark.module.scss";
import svgStyles from "./svg.module.scss";

export const Spark = ({
  intervals = [],
  showTotal,
  useCumulative,
  showPrevious,
}) => {
  const [svgData, setSvgData] = useState([]);
  const [nowDot, setNowDot] = useState(null);
  const xAxisRef = useRef(null);

  const radius = 3;
  const width = isPhone() ? 40 : 60;
  const height = 0.4 * width;
  const margin = {
    top: radius + 1,
    bottom: 20,
    left: 20,
    right: 20,
  };
  const svgWidth = width + margin.left + margin.right,
    svgHeight = height + margin.bottom + margin.top;

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!intervals.length) {
      return;
    }

    const data = showPrevious ? intervals : intervals.slice(0, 1);

    const accessor = ({ length, cumulative }) =>
      useCumulative ? cumulative : length;

    const xExtent = trimmedExtent(data[0]);

    const yExtent = [
      0,
      d3max([1.0, ...data.flatMap(({ bins }) => bins).map(accessor)]),
    ];

    const xScale = d3scaleTime().domain(xExtent).range([0, width]);
    const xAxis = d3axisBottom()
      .scale(xScale)
      .tickValues(xExtent)
      .tickFormat(timeFormatterHourAM)
      .tickSize(0);
    d3select(xAxisRef.current).call(xAxis);

    const yScale = d3scaleLinear().domain(yExtent).range([height, 0]);

    const line = d3line()
      .curve(d3curveCardinal.tension(0.3))
      .x((d) => xScale(d.x0))
      .y((d) => yScale(accessor(d)));

    const paths = data.map((d) => d.bins).map(line);

    let newSvgData = paths.map((path, i) => ({ path, key: i })).reverse(); // render highlight after all others

    setSvgData(newSvgData);

    const bins = data[0].bins;
    if (bins.length) {
      const lastBin = bins[bins.length - 1];
      setNowDot({
        cx: xScale(lastBin.x0),
        cy: yScale(accessor(lastBin)),
        r: radius,
      });
    }
  }, [width, height, intervals, showPrevious, useCumulative]);

  if (!intervals.length) {
    return null;
  }

  const total = intervals[0].total;
  const lastIndex = svgData.length - 1;

  return (
    <div className={styles.container}>
      <svg width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className={styles.axis}
            ref={xAxisRef}
            transform={`translate(0,${height})`}
          />
          <g>
            {svgData.map(({ path, key }, i) => (
              <path
                key={key}
                className={classnames(svgStyles.path, {
                  [svgStyles.current]: i === lastIndex,
                })}
                d={path}
              />
            ))}
          </g>
          {nowDot && (
            <g className={svgStyles.now}>
              <circle {...nowDot} />
            </g>
          )}
        </g>
      </svg>
      {showTotal && <span className={styles.total}>{total}</span>}
    </div>
  );
};
