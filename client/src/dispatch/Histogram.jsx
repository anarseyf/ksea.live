import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext } from "./TweetsProvider";
import styles from "./chart.module.scss";
import { histogram, expand, getExtent } from "../histogram";
import { GroupByOptions, groupBy } from "../groupby";

export function Histogram() {
  const [tweets] = useContext(TweetsContext);

  const [svgData, setSvgData] = useState([]);

  const svgWidth = 200,
    svgHeight = 80,
    margin = { top: 10, right: 10, bottom: 20, left: 30 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.bottom - margin.top;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!tweets.length) {
      return;
    }

    const data = groupBy(GroupByOptions.Nothing, tweets);
    const bins = histogram(data[0].values);
    const extent = expand(getExtent(tweets));
    const xScale = d3.scaleTime().domain(extent).range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (b) => b.length)])
      .range([height, 0]);

    const dateFormatter = d3.timeFormat("%I%p"); // https://github.com/d3/d3-time-format#locale_format

    const xAxis = d3
      .axisBottom()
      .tickFormat(dateFormatter)
      .scale(xScale)
      .ticks(d3.timeHour.every(3));
    d3.select(xAxisRef.current).call(xAxis);

    const yAxis = d3.axisLeft().scale(yScale).ticks(2);
    d3.select(yAxisRef.current).call(yAxis);

    const firstRealBin = bins[1];
    const binWidth = Math.max(
      1,
      Math.floor(xScale(firstRealBin.x1) - xScale(firstRealBin.x0))
    );

    const newSvgData = bins.map(({ x0, x1, length }) => ({
      x: xScale(x0) - binWidth / 2,
      width: binWidth,
      y: yScale(length),
      height: yScale(0) - yScale(length),
      rx: binWidth / 4,
    }));

    setSvgData(newSvgData);
  }, [tweets]);

  return (
    <div className={styles.container}>
      <svg className={styles.smallchart} width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {svgData.map((d) => (
            <rect
              x={d.x}
              y={d.y}
              width={d.width}
              height={d.height}
              rx={d.rx}
              fill="orangered"
            ></rect>
          ))}
        </g>
        <g
          ref={xAxisRef}
          transform={`translate(${margin.left},${margin.top + height})`}
        />
        <g
          ref={yAxisRef}
          transform={`translate(${margin.left},${margin.top})`}
        />
      </svg>
    </div>
  );
}
