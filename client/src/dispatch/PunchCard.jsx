import React, { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "./DataProvider";
import { isPhone, getStyleProp } from "../clientUtils";

import {
  scaleLinear as d3scaleLinear,
  scaleOrdinal as d3scaleOrdinal,
} from "d3-scale";
import { max as d3max } from "d3-array";
import { select as d3select } from "d3-selection";
import { axisLeft as d3axisLeft, axisBottom as d3axisBottom } from "d3-axis";

import textures from "textures";
import styles from "./punchcard.module.scss";
import svgStyles from "./svg.module.scss";

export const PunchCard = () => {
  const { punchCard } = useContext(DataContext);
  const texturesRef = useRef();
  const [rects, setRects] = useState([]);

  const svgWidth = isPhone() ? 350 : 500;
  const margin = { top: 20, right: 30, bottom: 20, left: 30 };
  const width = svgWidth - margin.left - margin.right;
  const daySize = width / 24;
  const gap = 1;
  const rectSize = daySize - 2 * gap;
  const height = daySize * 7;
  const svgHeight = height + margin.top + margin.bottom;

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    // TODO - no need for useEffect?
    if (!punchCard.length) {
      return;
    }

    const xExtent = [0, 24];

    const max = d3max(punchCard.flat(2).map(({ avg }) => avg));

    const xScale = d3scaleLinear().domain(xExtent).range([0, width]);
    const xAxis = d3axisBottom().scale(xScale).tickSize(3);
    d3select(xAxisRef.current).call(xAxis);

    const yDomain = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const yRange = yDomain.map((_, i) => i * daySize);
    const yScale = d3scaleOrdinal(yDomain, yRange);
    const yAxis = d3axisLeft().scale(yScale).ticks(7);
    d3select(yAxisRef.current).call(yAxis);

    const data = punchCard
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
    const texture4 = textures.lines().size(4).strokeWidth(1).stroke(color4);

    d3select(texturesRef.current)
      .call(texture1)
      .call(texture2)
      .call(texture3)
      .call(texture4);

    const newRects = data.map(({ hour, day, value }) => {
      const texture =
        value >= 0.8 * max
          ? texture1
          : value >= 0.6 * max
          ? texture2
          : value >= 0.4 * max
          ? texture3
          : texture4;
      return {
        key: `${day}-${hour}`,
        x: xScale(hour) + gap,
        y: day * daySize,
        width: rectSize - gap,
        height: rectSize - gap,
        fill: texture.url(),
      };
    });

    setRects(newRects);
  }, [punchCard, height, width, rectSize, daySize]);

  if (!punchCard.length) {
    return null;
  }

  return (
    <svg className={styles.svg} width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g
          className={svgStyles.axis}
          ref={xAxisRef}
          transform={`translate(0,${height})`}
        />
        <g className={svgStyles.axis} ref={yAxisRef} />
        <g ref={texturesRef} transform={`translate(0,${-rectSize / 2})`}>
          {rects.map(({ key, x, y, width, height, fill }) => (
            <rect
              key={key}
              className={styles.rect}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={fill}
              rx={6}
            />
          ))}
        </g>
      </g>
    </svg>
  );
};
