import React, { useEffect, useState, useRef } from "react";
import { select as d3select } from "d3-selection";
import {
  annotation as d3annotation,
  annotationCalloutCircle as d3annotationCalloutCircle,
} from "d3-svg-annotation";
import { getStyleProp } from "../clientUtils";
import "./annotations.scss";

export const PunchCardAnnotations = ({ annotations, cellSize, scales }) => {
  const calloutsRef = useRef(null);

  useEffect(() => {
    if (!annotations) {
      return;
    }
    const [_, yScale] = scales;

    const annotationColor = getStyleProp("--annotation");

    const calloutFn = ({day, hour2, text: label}) => {

      const x = day * cellSize;
      const y = yScale(hour2);
      const callout = {
        note: {
          label,
        },
        x,
        y,
        subject: {
          radius: cellSize/2,
        },
        color: annotationColor,
      };

        callout.nx = -cellSize/2 - 20;
        callout.ny = yScale(hour2) + cellSize/2;
      return callout;
    };


    const calloutsSvgData = annotations.map(calloutFn);

    const callout = d3annotation()
      .annotations(calloutsSvgData)
      .type(d3annotationCalloutCircle);

    d3select(calloutsRef.current).call(callout);

  }, [annotations, cellSize, scales]);

  return (
    <g ref={calloutsRef} />
  );
};
