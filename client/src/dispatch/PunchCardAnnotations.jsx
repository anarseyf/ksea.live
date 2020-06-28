import React, { useEffect, useState, useRef } from "react";
import { select as d3select } from "d3-selection";
import {
  annotation as d3annotation,
  annotationCalloutCircle as d3annotationCalloutCircle,
} from "d3-svg-annotation";
import { getStyleProp } from "../clientUtils";
import "./annotations.scss";

export const PunchCardAnnotations = ({ annotations, scales, cellSize, availableWidth }) => {
  const calloutsRef = useRef(null);

  useEffect(() => {
    if (!annotations) {
      return;
    }
    const [_, yScale] = scales;

    const annotationColor = getStyleProp("--annotation");

    const offsetX = -20;
    const calloutFn = ({day, hour2, title, label}) => {

      const x = day * cellSize;
      const y = yScale(hour2);
      const callout = {
        note: {
          title,
          label,
          wrap: availableWidth + offsetX,
          align: "right"
        },
        x,
        y,
        subject: {
          radius: cellSize/2,
        },
        color: annotationColor,
      };
      callout.nx = offsetX;
      callout.ny = yScale(hour2) + cellSize/2;

      return callout;
    };


    const calloutsSvgData = annotations.map(calloutFn);

    const callout = d3annotation()
      .annotations(calloutsSvgData)
      .type(d3annotationCalloutCircle);

    d3select(calloutsRef.current).call(callout);

  }, [annotations, availableWidth, cellSize, scales]);

  return (
    <g ref={calloutsRef} />
  );
};
