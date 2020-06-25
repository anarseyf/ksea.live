import React from "react";
import classnames from "classnames";
import svgStyles from "./svg.module.scss";

export const SvgDot = ({ radius = 0, active = false, sev1 = false, sev2 = false }) => {
  const size = 20,
    sev1Radius = 6.5,
    sev2Radius = 9;
  const baseRadius = radius || (4);

  return (
    <svg
      className={classnames(svgStyles.container, { [svgStyles.live]: active })}
      width={size}
      height={size}
    >
      <circle className={svgStyles.event} cx={size / 2} cy={size / 2} r={baseRadius} />
      {(sev1 || sev2) && (
        <circle className={svgStyles.outer}
          cx={size / 2}
          cy={size / 2}
          r={sev1Radius}
          fill="none"
        />
      )}
      {sev2 && (
        <circle className={svgStyles.outer}
          cx={size / 2}
          cy={size / 2}
          r={sev2Radius}
          fill="none"
        />
      )}
    </svg>
  );
};
