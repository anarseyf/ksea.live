import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import * as d3 from "d3";
import sparkStyles from "./spark.module.scss";
import svgStyles from "./svg.module.scss";
import { intervalExtent, isPhone } from "../clientUtils";

export const Spark = ({  intervals = [],
  title,
  showTotal,
  useCumulative,
  showPrevious
}) => {
  const [svgData, setSvgData] = useState([]);
  const [nowDot, setNowDot] = useState(null);

  const svgWidth = isPhone ? 100 : 150;
  const svgHeight = 0.2 * svgWidth,
    margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!intervals.length) {
      return;
    }

    const data = (showPrevious ? intervals : intervals.slice(0,1));

    const accessor = ({ length, cumulative }) =>
      useCumulative ? cumulative : length;

    const xExtent = intervalExtent(data[0]);

    const yExtent = [
      0,
      d3.max([1.0, ...data.flatMap(({ bins }) => bins).map(accessor)]),
    ];

    const xScale = d3.scaleTime().domain(xExtent).range([0, width]);
    const yScale = d3.scaleLinear().domain(yExtent).range([height, 0]);
    
    const line = d3
      .line()
      .curve(d3.curveCardinal.tension(0.3))
      .x((d) => xScale(d.x0))
      .y((d) => yScale(accessor(d)));

    const paths = data.map((d) => d.bins).map(line);

    let newSvgData = paths.map((path) => ({ path })).reverse(); // render highlight after all others

    setSvgData(newSvgData);

    const bins = data[0].bins;
    const lastBin = bins[bins.length - 1];
    setNowDot({
      cx: xScale(lastBin.x0),
      cy: yScale(accessor(lastBin)),
      r: 3,
    });
  }, [width, height, intervals, showPrevious, useCumulative]);

  if (!intervals.length) {
    return null;
  }

  const total = intervals[0].total;
  const lastIndex = svgData.length - 1;

  return (
    <div className={sparkStyles.container}>
      
      <svg className={sparkStyles.svg} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {svgData.map((d, i) => (
              <path
                className={classnames(svgStyles.path, {
                  [svgStyles.current]: i === lastIndex,
                })}
                d={d.path}
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
      {showTotal && <span className={sparkStyles.total}>{total}</span>}
    </div>
  );
}
