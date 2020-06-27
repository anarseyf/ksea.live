import React, { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "./DataProvider";
import { isPhone, getStyleProp } from "../clientUtils";

import {
  scaleLinear as d3scaleLinear,
  scaleOrdinal as d3scaleOrdinal,
} from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { axisLeft as d3axisLeft, axisTop as d3axisTop } from "d3-axis";

import textures from "textures";
import styles from "./punchcard.module.scss";
import svgStyles from "./svg.module.scss";

const PunchCardElements = ({ elements }) => {
  if (!elements) {
    return null;
  }
  return (
    <>
      {elements.map(({ key, x, y, w, h, rx, fill, stroke }) => (
        <rect
          key={key}
          className={styles.rect}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={rx}
          fill={fill}
          stroke={stroke}
        />
      ))}
    </>
  );
};

export const PunchCard = () => {
  const { punchCard } = useContext(DataContext);
  const { week, dayAggregates, hourAggregates } = punchCard;
  const texturesRef = useRef();

  const [weekSpecs, setWeekSpecs] = useState([]);
  const [dayAggregateSpecs, setDayAggregateSpecs] = useState([]);
  const [hourAggregateSpecs, setHourAggregateSpecs] = useState([]);

  const svgWidth = isPhone() ? 320 : 380;
  const margin = { top: 30, right: 90, bottom: 80, left: 40 };
  const width = svgWidth - margin.left - margin.right;
  const cellSize = width / 7;
  const gap = 2;
  const rectSize = cellSize - 2 * gap;
  const height = cellSize * 12;
  const svgHeight = height + margin.top + margin.bottom;

  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!week) {
      return;
    }

    const max = d3max(week.flat(2).map(({ avg }) => avg));

    const xDomain = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const xRange = xDomain.map((_, i) => i * cellSize);
    const xScale = d3scaleOrdinal(xDomain, xRange);
    const xAxis = d3axisTop().scale(xScale).ticks(12);
    d3select(xAxisRef.current).call(xAxis);

    const yExtent = [0, 12];
    const yScale = d3scaleLinear().domain(yExtent).range([0, height]);
    const yAxis = d3axisLeft().scale(yScale).tickValues([0, 6, 12]).tickSize(0);
    d3select(yAxisRef.current).call(yAxis);

    const data = week
      .map((day, iDay) =>
        day.map(({ avg }, iHour) => ({
          hour: iHour,
          day: iDay,
          value: avg,
        }))
      )
      .flat(2);

    const color1 = getStyleProp("--graph-primary1");
    const color2 = getStyleProp("--graph-primary2");
    const color3 = getStyleProp("--graph-primary3");
    const color4 = getStyleProp("--graph-primary4");

    const texture1 = textures.lines().size(7).strokeWidth(3).stroke(color1);
    const texture2 = textures.lines().size(6).strokeWidth(2).stroke(color2);
    const texture3 = textures.lines().size(5).strokeWidth(1).stroke(color3);
    const texture4 = textures.lines().size(5).strokeWidth(1).stroke(color4);

    d3select(texturesRef.current)
      .call(texture1)
      .call(texture2)
      .call(texture3)
      .call(texture4);

    const appearance = [
      { color: color1, texture: texture1 },
      { color: color2, texture: texture2 },
      { color: color3, texture: texture3 },
      { color: color4, texture: texture4 },
    ];
    const appearanceFn = (value) => {
      const index =
        value >= 0.8 * max
          ? 0
          : value >= 0.6 * max
          ? 1
          : value >= 0.4 * max
          ? 2
          : 3;
      return appearance[index];
    };

    const newRects = data.map(({ hour, day, value }) => {
      const appearance = appearanceFn(value);
      return {
        key: `${day}-${hour}`,
        x: day * cellSize,
        y: yScale(hour) + gap,
        w: rectSize,
        h: rectSize,
        rx: rectSize / 2,
        fill: appearance.texture.url(),
        stroke: appearance.color,
      };
    });

    setWeekSpecs(newRects);

    const toAggregateElementSpec = (value, i) => {
      const appearance = appearanceFn(value);
      return {
        x: 0,
        y: 0,
        w: rectSize,
        h: rectSize,
        rx: rectSize / 2,
        fill: appearance.texture.url(),
        stroke: appearance.color,
      };
    };

    const newDayAggregateRects = dayAggregates
      .map(toAggregateElementSpec)
      .map((spec, i) => ({
        ...spec,
        x: i * cellSize,
        key: `day-${i}`,
      }));

    const newHourAggregateRects = hourAggregates
      .map(toAggregateElementSpec)
      .map((spec, i) => ({
        ...spec,
        y: i * cellSize,
        key: `hour-${i}`,
      }));

    setDayAggregateSpecs(newDayAggregateRects);
    setHourAggregateSpecs(newHourAggregateRects);
  }, [week, height, width, rectSize, cellSize, dayAggregates, hourAggregates]);

  if (!weekSpecs.length) {
    return null;
  }

  return (
    <svg className={styles.svg} width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g
          ref={xAxisRef}
          className={styles.axis}
          transform={`translate(${rectSize / 2},0)`}
        />
        <g
          ref={yAxisRef}
          className={styles.axis}
          transform={`translate(0,${0})`}
        />
        <g ref={texturesRef}>
          <g transform={`translate(${gap},0)`}>
            <PunchCardElements elements={weekSpecs} />
          </g>
          <g transform={`translate(${8 * cellSize},0)`}>
            <PunchCardElements elements={hourAggregateSpecs} />
          </g>
          <g transform={`translate(0,${13 * cellSize})`}>
            <PunchCardElements elements={dayAggregateSpecs} />
          </g>
        </g>
      </g>
    </svg>
  );
};
