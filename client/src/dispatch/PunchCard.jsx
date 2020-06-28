import React, { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "./DataProvider";
import { isPhone, getStyleProp } from "../clientUtils";

import {
  scaleLinear as d3scaleLinear,
  scaleOrdinal as d3scaleOrdinal,
} from "d3-scale";
import * as d3a from "d3-array";
import { select as d3select } from "d3-selection";
import { axisLeft as d3axisLeft, axisTop as d3axisTop } from "d3-axis";

import textures from "textures";
import styles from "./punchcard.module.scss";
import svgStyles from "./svg.module.scss";
import { PunchCardAnnotations } from "./PunchCardAnnotations";

const PunchCardElements = ({ elements }) => {
  if (!elements) {
    return null;
  }
  return (
    <>
      {elements.map(({ key, cx, cy, r, fill, stroke }) => (
        <circle
          key={key}
          className={styles.element}
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          stroke={stroke}
        />
      ))}
    </>
  );
};

export const PunchCard = () => {
  const { punchCard } = useContext(DataContext);
  const { week, dayAggregates, hourAggregates, annotations } = punchCard;
  const texturesRef = useRef();

  const [weekSpecs, setWeekSpecs] = useState([]);
  const [dayAggregateSpecs, setDayAggregateSpecs] = useState([]);
  const [hourAggregateSpecs, setHourAggregateSpecs] = useState([]);
  const [scales, setScales] = useState([]);

  const phone = isPhone() ? 360 : 450;
  const svgWidth = phone;
  const cellSize = svgWidth / 12;
  const width = cellSize * 7;
  const horizontal = svgWidth - width;
  const horizontalRight = cellSize * 3;
  const margin = {
    top: 40,
    bottom: 120,
    right: horizontalRight,
    left: horizontal - horizontalRight,
  };
  const gap = 4;
  const elementSize = cellSize - 2 * gap;
  const height = cellSize * 12;
  const svgHeight = height + margin.top + margin.bottom;

  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!week) {
      return;
    }

    const [min, max] = d3a.extent(week.flat(2).map(({ avg }) => avg));

    // TODO: d3-scale can accomplish most of this stuff
    // if you refactor the data a bit.
    const xDomain = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const xRange = xDomain.map((_, i) => i * cellSize);
    const xScale = d3scaleOrdinal(xDomain, xRange);
    const xAxis = d3axisTop().scale(xScale).ticks(12).tickSize(0);
    d3select(xAxisRef.current).call(xAxis);

    const yExtent = [0, 12];
    const yScale = d3scaleLinear().domain(yExtent).range([0, height]);
    const formatter = (d, i) => {
      const hour = 2 * d;
      if (hour === 0 || hour === 24) {
        return "12am";
      }
      if (hour === 12) {
        return "noon";
      }
      return `${hour % 12}${hour < 12 ? "am" : "pm"}`;
    };
    const yAxis = d3axisLeft()
      .scale(yScale)
      .tickValues([0, 3, 6, 9, 12])
      .tickFormat(formatter)
      .tickSize(phone ? 0 : 3);
    d3select(yAxisRef.current).call(yAxis);

    setScales([xScale, yScale]);

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
      const offsetValue = value - min;
      const offsetMax = max - min;

      const index =
        offsetValue >= 0.75 * offsetMax
          ? 0
          : offsetValue >= 0.5 * offsetMax
          ? 1
          : offsetValue >= 0.25 * offsetMax
          ? 2
          : 3;
      return appearance[index];
    };

    const maxRadius = elementSize / 2;

    const newWeekSpecs = data.map(({ hour, day, value }) => {
      const appearance = appearanceFn(value);
      return {
        key: `${day}-${hour}`,
        cx: day * cellSize,
        cy: yScale(hour),
        r: maxRadius * Math.sqrt(value / max),
        fill: appearance.texture.url(),
        stroke: appearance.color,
      };
    });

    setWeekSpecs(newWeekSpecs);

    const toAggregateElementSpec = (value, i) => {
      const appearance = appearanceFn(value);
      return {
        cx: 0,
        cy: 0,
        r: maxRadius * Math.sqrt(value / max),
        fill: appearance.texture.url(),
        stroke: appearance.color,
      };
    };

    const newDayAggregateSpecs = dayAggregates
      .map(toAggregateElementSpec)
      .map((spec, i) => ({
        ...spec,
        cx: i * cellSize,
        key: `day-${i}`,
      }));

    const newHourAggregateSpecs = hourAggregates
      .map(toAggregateElementSpec)
      .map((spec, i) => ({
        ...spec,
        cy: i * cellSize,
        key: `hour-${i}`,
      }));

    setDayAggregateSpecs(newDayAggregateSpecs);
    setHourAggregateSpecs(newHourAggregateSpecs);
  }, [
    week,
    height,
    width,
    elementSize,
    cellSize,
    dayAggregates,
    hourAggregates,
    phone,
  ]);

  if (!weekSpecs.length) {
    return null;
  }

  return (
    <svg className={styles.svg} width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g
          ref={xAxisRef}
          className={styles.axis}
          transform={`translate(${0.5 * cellSize},${12.9 * cellSize})`}
        />
        <g
          ref={yAxisRef}
          className={styles.axis}
          transform={`translate(${(phone ? 8.5 : 8) * cellSize},0)`}
        />
        <g
          ref={texturesRef}
          transform={`translate(${cellSize / 2},${cellSize / 2})`}
        >
          <g transform={`translate(${0},0)`}>
            <PunchCardElements elements={weekSpecs} />
          </g>
          <g transform={`translate(${(phone ? 8.5 : 8) * cellSize},0)`}>
            <PunchCardElements elements={hourAggregateSpecs} />
          </g>
          <g transform={`translate(0,${13.25 * cellSize})`}>
            <PunchCardElements elements={dayAggregateSpecs} />
          </g>
          <g transform={`translate(${0},${0})`}>
            <PunchCardAnnotations
              annotations={annotations}
              cellSize={cellSize}
              scales={scales}
              availableWidth={margin.left}
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
