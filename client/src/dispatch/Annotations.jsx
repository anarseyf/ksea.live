import React, { useContext, useEffect, useState, useRef } from "react";
import { select as d3select } from "d3-selection";
import textures from "textures";
import {
  annotation as d3annotation,
  annotationCalloutCircle as d3annotationCalloutCircle,
} from "d3-svg-annotation";
import { DataContext } from "./DataProvider";

import "./annotations.scss";
import { getStyleProp } from "../clientUtils";

let textureCurrent;
let texturePrevious;

export const Annotations = ({
  currentStart,
  rectWidth,
  calloutWidth,
  scales,
  clipPaths,
}) => {
  const calloutsRef = useRef(null);
  const regionsRef = useRef(null);
  const { annotations } = useContext(DataContext);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (!scales.length) {
      return;
    }

    const [xScale, yScale] = scales;
    const annotationColor = getStyleProp("--annotation");
    const textureColor = getStyleProp("--texture");
    texturePrevious = textures.lines().lighter().size(6).stroke(textureColor);
    textureCurrent = textures
      .lines()
      .lighter()
      .size(6)
      .orientation("6/8")
      .stroke(textureColor);

    d3select(regionsRef.current).call(textureCurrent);
    d3select(regionsRef.current).call(texturePrevious);

    const regionFn = ({ start, end, offset }, i) => {
      if (!start || !end) {
        return undefined;
      }
      const isCurrent = offset === 0;
      const texture = isCurrent ? textureCurrent : texturePrevious;

      return {
        key: `${start}-${end}-${i}`,
        x: xScale(0) - (isCurrent ? 0 : rectWidth),
        y: yScale(start.timestamp + offset),
        width: rectWidth,
        height:
          yScale(end.timestamp + offset) - yScale(start.timestamp + offset),
        fill: texture.url(),
      };
    };

    const calloutFn = ({
      item: { title, label, value, timestamp },
      offset,
      scales: [xScale, yScale],
      isEnd = false,
    }) => {
      if (!title && !label) {
        return undefined;
      }
      const margin = 10;
      const isPrevious = timestamp < currentStart;
      const sideX = isPrevious ? -1 : 1;

      const x = value ? xScale(value) : rectWidth;
      const sideY = isEnd ? 1 : -1;
      const y = yScale(timestamp + offset);
      const callout = {
        note: {
          title,
          label,
          wrap: calloutWidth - margin - 10,
        },
        x: sideX * x,
        y,
        subject: {
          radius: 6,
        },
        color: annotationColor,
      };

      if (value) {
        callout.nx = sideX * (rectWidth + margin);
        callout.ny = y;
      } else {
        callout.dx = sideX * margin;
        callout.dy = sideY * margin;
      }
      return callout;
    };

    const calloutsFn = ({ start, end, offset }) => [
      start ? calloutFn({ item: start, offset, scales }) : undefined,
      end ? calloutFn({ item: end, offset, scales, isEnd: true }) : undefined,
    ];

    const calloutsSvgData = annotations.flatMap(calloutsFn).filter(Boolean);

    const callout = d3annotation()
      .annotations(calloutsSvgData)
      .type(d3annotationCalloutCircle);

    d3select(calloutsRef.current).call(callout);

    const newRegions = annotations.map(regionFn).filter(Boolean);
    setRegions(newRegions);
  }, [annotations, calloutWidth, currentStart, rectWidth, scales]);

  return (
    <>
      <defs>
        <clipPath id="clippath">
          <path d={clipPaths.current} />
          <path d={clipPaths.previous} />
        </clipPath>
      </defs>
      <g ref={regionsRef}>
        {regions.map((annotation) => (
          <rect {...annotation} clipPath="url(#clippath)" />
        ))}
      </g>
      <g ref={calloutsRef} />
    </>
  );
};
