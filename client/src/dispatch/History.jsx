import React, { useContext, useEffect, useState, useRef } from "react";
import {
  DataContext,
  currentInterval as getCurrentInterval,
  previousInterval as getPreviousInterval,
} from "./DataProvider";
import {
  intervalExtent as getIntervalExtent,
  timeFormatterMonth,
  everyMonth,
  getContentWidth,
} from "../clientUtils";
import { Annotations } from "./Annotations";
import { HistoryEvents } from "./HistoryEvents";
import classnames from "classnames";
import moment from "moment";

import {
  scaleLinear as d3scaleLinear,
  scaleTime as d3scaleTime,
} from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { line as d3line, curveCardinal as d3curveCardinal } from "d3-shape";
import { axisLeft as d3axisLeft, axisBottom as d3axisBottom } from "d3-axis";

import historyStyles from "./history.module.scss";
import svgStyles from "./svg.module.scss";

const closedPath = (bins, line, offset) => {
  if (!bins.length) {
    return "";
  }

  let data = bins.map(({ x0, length }) => ({
    timestamp: x0,
    value: length + offset,
  }));

  const first = data[0],
    last = data[data.length - 1];
  const extraBottom = { timestamp: last.timestamp, value: 10000 };
  const extraTop = { timestamp: first.timestamp, value: 10000 };

  data = [...data, extraBottom, extraTop, first];
  return line(data);
};

export const History = () => {
  const { history } = useContext(DataContext);
  // const [svgData, setSvgData] = useState([]);
  const [scales, setScales] = useState([]);
  const [currentStart, setCurrentStart] = useState([]);
  const [paths, setPaths] = useState([]);
  const [clipPaths, setClipPaths] = useState({});

  const dayHeight = 3;

  const [contentWidth, setContentWidth] = useState(0);
  useEffect(() => {
    setContentWidth(getContentWidth());
  }, []);

  const svgWidth = contentWidth;
    const margin = { top: 20, right: 0, bottom: 20, left: 0 },
    height = 365 * dayHeight,
    svgHeight = height + margin.top + margin.bottom,
    width = svgWidth - margin.left - margin.right;
  const yearWidth = width / 2;
  const maxBarWidth = yearWidth * 0.45;
  const annotationRectWidth = yearWidth * 0.48;
  const calloutWidth = Math.max(40, yearWidth - annotationRectWidth);

  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    if (!history.length) {
      return;
    }

    const intervalCurrent = getCurrentInterval(history);
    setCurrentStart(intervalCurrent.start);
    const intervalPrevious = getPreviousInterval(history);
    const binsCurrent = intervalCurrent.binsLowRes;
    const binsPrevious = intervalPrevious.binsLowRes;
    const timeExtent = getIntervalExtent(intervalCurrent);

    const xScale = d3scaleLinear()
      .domain([0, d3max([...binsCurrent, ...binsPrevious], (b) => b.length)])
      .range([0, maxBarWidth]);

    const yScale = d3scaleTime().domain(timeExtent).range([0, height]);

    setScales([xScale, yScale]);

    const yAxis = d3axisLeft()
      .scale(yScale)
      .tickValues(everyMonth(intervalCurrent.start))
      .tickFormat(timeFormatterMonth)
      .tickSize(0);
    d3select(yAxisRef.current).call(yAxis);

    const xAxis = d3axisBottom().scale(xScale).ticks(2);
    d3select(xAxisRef.current).call(xAxis);

    // const currentYear = binsCurrent.map(({ x0, length }) => ({
    //   x: xScale(0),
    //   width: xScale(length),
    //   y: yScale(x0),
    //   height: binHeight,
    //   rx: 1,
    // }));
    // const previousYear = binsPrevious.map(({ x0, length }) => ({
    //   x: xScale(0) - xScale(length),
    //   width: xScale(length),
    //   y: yScale(x0),
    //   height: binHeight,
    //   rx: 1,
    // }));
    // setSvgData([currentYear, previousYear]);

    const lineCurrent = d3line()
      .curve(d3curveCardinal.tension(0.3))
      .x((d) => xScale(d.length))
      .y((d) => yScale(d.x0));
    const linePrevious = d3line()
      .curve(d3curveCardinal.tension(0.3))
      .x((d) => xScale(-d.length))
      .y((d) => yScale(d.x0));

    const pathCurrent = lineCurrent(binsCurrent);
    const pathPrevious = linePrevious(binsPrevious);
    setPaths([
      { path: pathCurrent, key: "current" },
      { path: pathPrevious, key: "previous" },
    ]);

    const clipLineCurrent = d3line()
      .x((d) => xScale(d.value))
      .y((d) => yScale(d.timestamp));

    const clipLinePrevious = d3line()
      .x((d) => xScale(-d.value))
      .y((d) => yScale(d.timestamp));

    const pixelOffset = xScale.invert(2) - xScale.invert(0);
    const clipPathCurrent = closedPath(
      binsCurrent,
      clipLineCurrent,
      pixelOffset
    );
    const clipPathPrevious = closedPath(
      binsPrevious,
      clipLinePrevious,
      pixelOffset
    );

    setClipPaths({ current: clipPathCurrent, previous: clipPathPrevious });
  }, [history, height, maxBarWidth]);

  // console.log("HISTORY/render");

  const thisYear = moment().year(),
  lastYear = thisYear-1;

  return (
    <div className={historyStyles.container}>
      <div className={historyStyles.years}>
        <div className={historyStyles.left}>{lastYear}</div>
        <div className={historyStyles.right}>{thisYear}</div>
      </div>
      <svg
        className={historyStyles.svg}
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
      >
        <g transform={`translate(${margin.left + yearWidth},${margin.top})`}>
          {/* <g>
            {svgData.map((dataset, iDataset) =>
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
            )}
          </g> */}
          <g>
            {paths.map(({ path, key }, i) => (
              <path
                key={key}
                className={classnames(svgStyles.path, {
                  [svgStyles.current]: !i,
                  [svgStyles.previous]: i,
                })}
                d={path}
              />
            ))}
          </g>
          <g>
            <HistoryEvents scales={scales} dayHeight={dayHeight} />
          </g>
          <g>
            <Annotations
              currentStart={currentStart}
              rectWidth={annotationRectWidth}
              calloutWidth={calloutWidth}
              scales={scales}
              clipPaths={clipPaths}
            />
          </g>
          {/* <g
            className={classnames(svgStyles.axis, historyStyles.axis)}
            ref={xAxisRef}
            transform={`translate(0,${height})`}
          /> */}
          <g
            className={classnames(svgStyles.axis, historyStyles.axis)}
            ref={yAxisRef}
          />
        </g>
      </svg>
    </div>
  );
};
