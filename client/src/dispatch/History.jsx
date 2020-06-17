import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import classnames from "classnames";
import {
  annotation as d3annotation,
  annotationBadge as d3annotationBadge,
  annotationCalloutCircle as d3annotationCalloutCircle,
} from "d3-svg-annotation";
import textures from "textures";
import {
  TweetsContext,
  currentInterval,
  previousInterval,
} from "./TweetsProvider";
import { intervalExtent, isPhone } from "../clientUtils";
import historyStyles from "./history.module.scss";
import svgStyles from "./svg.module.scss";

export const History = () => {
  const { history, annotations } = useContext(TweetsContext);
  const [svgData, setSvgData] = useState([]);
  const [annotationRegions, setAnnotationRegions] = useState([]);

  const binHeight = 2;
  const svgWidth = isPhone ? 350 : 450,
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
  const calloutsRef = useRef(null);

  useEffect(() => {
    if (!history.length) {
      return;
    }

    const intervalCurrent = currentInterval(history);
    const intervalPrevious = previousInterval(history);
    const binsCurrent = intervalCurrent.binsLowRes;
    const binsPrevious = intervalPrevious.binsLowRes;
    const timeExtent = intervalExtent(intervalCurrent, 60);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(binsCurrent, (b) => b.length)])
      .range([0, maxBarWidth]);

    const yScale = d3.scaleTime().domain(timeExtent).range([0, height]);

    const dateFormatter = d3.timeFormat("%-m/%-d"); // https://github.com/d3/d3-time-format#locale_format

    const yAxis = d3
      .axisLeft()
      .tickFormat(dateFormatter)
      .scale(yScale)
      .ticks(d3.timeMonth.every(1))
      .tickSize(0);
    d3.select(yAxisRef.current).call(yAxis);

    const xAxis = d3.axisBottom().scale(xScale).ticks(2);
    d3.select(xAxisRef.current).call(xAxis);

    // let temp = 0;
    // if (binsCurrent.length) {
    //   const bin = binsCurrent[0];
    //   temp = Math.floor(xScale(bin.x1) - xScale(bin.x0));
    // }
    // const binHeight = Math.max(1, temp);

    const currentYear = binsCurrent.map(({ x0, length }) => ({
      x: yearWidth + xScale(0),
      width: xScale(length),
      y: yScale(x0),
      height: binHeight,
      rx: 1,
    }));
    const previousYear = binsPrevious.map(({ x0, length }) => ({
      x: yearWidth + xScale(0) - xScale(length),
      width: xScale(length),
      y: yScale(x0),
      height: binHeight,
      rx: 1,
    }));
    setSvgData([currentYear, previousYear]);

    const textureCurrent = textures
      .lines()
      .lighter()
      .size(8)
      .orientation("6/8")
      .stroke("#51aae8");
    const texturePrevious = textures.lines().lighter().size(8).stroke("silver");
    d3.select(svgRef.current).call(textureCurrent);
    d3.select(svgRef.current).call(texturePrevious);

    const calloutFn = ({ title, label, value, timestamp }, offset, isEnd = false) => {
      const isPrevious = timestamp < intervalCurrent.start;
      const sideX = isPrevious ? -1 : 1;

      const x = value ? xScale(value) : annotationRectWidth;
      const sideY = isEnd ? 1 : -1;
      const y = yScale(timestamp + offset);
      const callout = {
        note: {
          title,
          label,
        },
        x: sideX * x,
        y,
        color: "red",
        subject: {
          radius: 6,
        },
      };

      if (value) {
        callout.nx = sideX * (annotationRectWidth + 10);
        callout.ny = y;
      } else {
        callout.dx = sideX * 10;
        callout.dy = sideY * 10;
      }
      return callout;
    };

    const calloutsFn = ({ start, end, offset }) =>
      [calloutFn(start, offset), end ? calloutFn(end, offset, true) : undefined];

    const regionFn = ({ start, end, offset }) => {
      if (!start || !end) {
        return undefined;
      }

      const isCurrent = offset === 0;
      const texture = isCurrent ? textureCurrent : texturePrevious;

      return {
        x: xScale(0) - (isCurrent ? 0 : annotationRectWidth),
        y: yScale(start.timestamp + offset),
        width: annotationRectWidth,
        height:
          yScale(end.timestamp + offset) - yScale(start.timestamp + offset),
        fill: texture.url(),
      };
    };

    // TODO - move to separate components
    const calloutsSvgData = annotations.flatMap(calloutsFn).filter(Boolean);
    console.log("HISTORY/annotations",annotations);
    console.log("HISTORY/callouts",annotations.flatMap(calloutsFn));
    const regions = annotations.map(regionFn).filter(Boolean);

    console.log("HISTORY/regious",regions);

    const callout = d3annotation()
      .annotations(calloutsSvgData)
      .type(d3annotationCalloutCircle);
    d3.select(calloutsRef.current).call(callout);

    setAnnotationRegions(regions);
  }, [
    history,
    annotations,
    maxBarWidth,
    height,
    yearWidth,
    annotationRectWidth,
  ]);

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
          {annotationRegions.map((annotation) => (
            <rect {...annotation} />
          ))}
        </g>
        <g transform={`translate(${margin.left},${margin.top})`}>
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
        <g
          className={historyStyles.annotations}
          ref={calloutsRef}
          transform={`translate(${margin.left + yearWidth},${margin.top})`}
        />
      </svg>
    </div>
  );
};
