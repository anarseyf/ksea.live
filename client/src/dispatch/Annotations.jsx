import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import {
  annotation as d3annotation,
  annotationCalloutCircle as d3annotationCalloutCircle,
} from "d3-svg-annotation";
import { TweetsContext } from "./TweetsProvider";

import styles from './annotations.module.scss';

export const Annotations = ({rectWidth, scales, currentStart}) => {
  const calloutsRef = useRef(null);
  const {  annotations } = useContext(TweetsContext);

  const calloutFn = ({
    item: { title, label, value, timestamp },
    offset,
    scales:[xScale,yScale],
    isEnd = false
  }
  ) => {
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
    calloutFn({item:start, offset,scales}),
    end ? calloutFn({item:end,offset,scales, isEnd:true}) : undefined,
  ];

  useEffect(() => {
    const calloutsSvgData = annotations.flatMap(calloutsFn).filter(Boolean);
    console.log("HISTORY/annotations", annotations);
    console.log("HISTORY/callouts", annotations.flatMap(calloutsFn));

    const callout = d3annotation()
      .annotations(calloutsSvgData)
      .type(d3annotationCalloutCircle);

    d3.select(calloutsRef.current).call(callout);
  });

  return (
    <g
      className={styles.annotations}
      ref={calloutsRef}
      
    />
  );
};
