import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import classnames from "classnames";

import {
  TweetsContext,
  currentInterval,
  previousInterval,
} from "./TweetsProvider";
import { intervalExtent, isPhone } from "../clientUtils";
import historyStyles from "./history.module.scss";
import svgStyles from "./svg.module.scss";
import { Annotations } from "./Annotations";

const closedPath = (bins, line) => {
  const first = bins[0],
    last = bins[bins.length - 1];
  const extraBottom = { x0: last.x0, length: 10000 };
  const extraTop = { x0: first.x0, length: 10000 };

  const data = [...bins, extraBottom, extraTop, first];
  return line(data);
};

export const History = () => {
  const { history } = useContext(TweetsContext);
  const [svgData, setSvgData] = useState([]);
  const [scales, setScales] = useState([]);
  const [currentStart, setCurrentStart] = useState([]);
  const [paths, setPaths] = useState([]);
  const [clipPaths, setClipPaths] = useState([]);
  const clipPathRef = useRef(null);

  const binHeight = 2;
  const svgWidth = isPhone ? 350 : 500,
    margin = { top: 10, right: 30, bottom: 30, left: 30 },
    svgHeight = 366 * (binHeight + 1) + margin.top + margin.bottom,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;
  const yearWidth = width / 2;
  const maxBarWidth = yearWidth * 0.45;
  const annotationRectWidth = yearWidth * 0.55;

  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!history.length) {
      return;
    }

    const intervalCurrent = currentInterval(history);
    setCurrentStart(intervalCurrent.start);
    const intervalPrevious = previousInterval(history);
    const binsCurrent = intervalCurrent.binsLowRes;
    const binsPrevious = intervalPrevious.binsLowRes;
    const timeExtent = intervalExtent(intervalCurrent, 60);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(binsCurrent, (b) => b.length)])
      .range([0, maxBarWidth]);

    const yScale = d3.scaleTime().domain(timeExtent).range([0, height]);

    setScales([xScale, yScale]);

    const dateFormatter = d3.timeFormat("%b"); // https://github.com/d3/d3-time-format#locale_format

    const yAxis = d3
      .axisLeft()
      .tickFormat(dateFormatter)
      .scale(yScale)
      .ticks(d3.timeMonth.every(1))
      .tickSize(0);
    d3.select(yAxisRef.current).call(yAxis);

    const xAxis = d3.axisBottom().scale(xScale).ticks(2);
    d3.select(xAxisRef.current).call(xAxis);

    const currentYear = binsCurrent.map(({ x0, length }) => ({
      x: xScale(0),
      width: xScale(length),
      y: yScale(x0),
      height: binHeight,
      rx: 1,
    }));
    const previousYear = binsPrevious.map(({ x0, length }) => ({
      x: xScale(0) - xScale(length),
      width: xScale(length),
      y: yScale(x0),
      height: binHeight,
      rx: 1,
    }));
    setSvgData([currentYear, previousYear]);

    const lineCurrent = d3
      .line()
      .curve(d3.curveCardinal.tension(0.3))
      .x((d) => xScale(d.length))
      .y((d) => yScale(d.x0));
    const linePrevious = d3
      .line()
      .curve(d3.curveCardinal.tension(0.3))
      .x((d) => xScale(-d.length))
      .y((d) => yScale(d.x0));

    const clipLineCurrent = d3
      .line()
      .x((d) => xScale(d.length))
      .y((d) => yScale(d.x0));

    const pathCurrent = lineCurrent(binsCurrent);
    const pathPrevious = linePrevious(binsPrevious);
    setPaths([pathCurrent, pathPrevious]);

    const clipPathCurrent = closedPath(binsCurrent, clipLineCurrent);

    setClipPaths([clipPathCurrent]);

    console.log("HISTORY/useEffect end");
  }, [height, history, maxBarWidth]);

  console.log("HISTORY/render");

  return (
    <div className={historyStyles.container}>
      <div className={historyStyles.years}>
        <div className={historyStyles.left}>2019</div>
        <div className={historyStyles.right}>2020</div>
      </div>
      <svg
        className={historyStyles.svg}
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
      >
        <g transform={`translate(${margin.left + yearWidth},${margin.top})`}>
          <g>
            {/* {svgData.map((dataset, iDataset) =>
              dataset.map((d) => (
                <rect
                  className={classnames({
                    [historyStyles.previous]: iDataset,
                    [historyStyles.current]: !iDataset,
                  })}
                  x={d.x}
                  y={d.y}
                  width={d.width}
                  height={d.height}
                  rx={d.rx}
                ></rect>
              ))
            )} */}
          </g>
          <defs>
            <clipPath id="clippath" ref={clipPathRef}>
              <path d={clipPaths[0]} />
            </clipPath>
          </defs>
          <rect
            x={0}
            y={100}
            width={100}
            height={200}
            fill="#00FF0088"
            clipPath="url(#clippath)"
          ></rect>
          <g>
            {paths.map((path) => (
              <path
                className={classnames(svgStyles.path, svgStyles.highlight)}
                d={path}
              />
            ))}
          </g>
        </g>
        <g
          className={`${svgStyles.axis} ${historyStyles.axis}`}
          ref={xAxisRef}
          transform={`translate(${margin.left + yearWidth},${
            margin.top + height
          })`}
        />
        <g
          className={`${svgStyles.axis} ${historyStyles.axis}`}
          ref={yAxisRef}
          transform={`translate(${margin.left + yearWidth},${margin.top})`}
        />
        <g transform={`translate(${margin.left + yearWidth},${margin.top})`}>
          <Annotations
            rectWidth={annotationRectWidth}
            currentStart={currentStart}
            scales={scales}
          />
        </g>
      </svg>
    </div>
  );
};
