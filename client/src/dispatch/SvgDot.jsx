import React from "react";
import classnames from "classnames";
import svgStyles from "./svg.module.scss";

export const SvgDot = ({ active = false, sev1 = false, sev2 = false }) => {
  const color = active ? "red" : "white";
  const size = 18,
    innerRadius = 3,
    sev1Radius = 5,
    sev2Radius = 8;

  return (
    <svg
      className={classnames({ [svgStyles.live]: active })}
      width={size}
      height={size}
    >
      <circle cx={size / 2} cy={size / 2} r={innerRadius} fill={color} />
      {(sev1 || sev2) && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={sev1Radius}
          fill="none"
          stroke={color}
        />
      )}
      {sev2 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={sev2Radius}
          fill="none"
          stroke={color}
        />
      )}
    </svg>
  );
};
