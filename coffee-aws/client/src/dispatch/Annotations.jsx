import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import textures from "textures";
import {
  annotation as d3annotation,
  annotationCalloutCircle as d3annotationCalloutCircle,
} from "d3-svg-annotation";
import { TweetsContext } from "./TweetsProvider";

import styles from "./annotations.module.scss";

const textureCurrent = textures
  .lines()
  .lighter()
  .size(8)
  .orientation("6/8")
  .stroke("#51aae8");
const texturePrevious = textures.lines().lighter().size(8).stroke("#51aae8");

export const Annotations = ({ rectWidth, scales, currentStart, clipPaths }) => {
  const calloutsRef = useRef(null);
  const regionsRef = useRef(null);
  const { annotations } = useContext(TweetsContext);
  const [regions, setRegions] = useState([]);

  d3.select(regionsRef.current).call(textureCurrent);
  d3.select(regionsRef.current).call(texturePrevious);

  useEffect(() => {
    console.log("ANN/scales:", scales);
    if (!scales.length) {
      return;
    }

    const regionFn = ({ start, end, offset }) => {
      if (!start || !end) {
        return undefined;
      }

      const [xScale, yScale] = scales;

      const isCurrent = offset === 0;
      const texture = isCurrent ? textureCurrent : texturePrevious;

      return {
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
      const isPrevious = timestamp < currentStart;
      const sideX = isPrevious ? -1 : 1;

      const x = value ? xScale(value) : rectWidth;
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
        callout.nx = sideX * (rectWidth + 10);
        callout.ny = y;
      } else {
        callout.dx = sideX * 10;
        callout.dy = sideY * 10;
      }
      return callout;
    };

    const calloutsFn = ({ start, end, offset }) => [
      calloutFn({ item: start, offset, scales }),
      end ? calloutFn({ item: end, offset, scales, isEnd: true }) : undefined,
    ];

    const calloutsSvgData = annotations.flatMap(calloutsFn).filter(Boolean);
    console.log("HISTORY/annotations", annotations);
    console.log("HISTORY/callouts", annotations.flatMap(calloutsFn));

    const callout = d3annotation()
      .annotations(calloutsSvgData)
      .type(d3annotationCalloutCircle);

    d3.select(calloutsRef.current).call(callout);

    const newRegions = annotations.map(regionFn).filter(Boolean);
    setRegions(newRegions);

    console.log("ANNOTATIONS/useEffect end");
  }, [annotations, currentStart, rectWidth, scales]);

  console.log("ANNOTATIONS/render");

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
      <g className={styles.annotations} ref={calloutsRef} />
    </>
  );
};
