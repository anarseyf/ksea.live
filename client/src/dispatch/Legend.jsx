import React from "react";
import styles from "./legend.module.scss";
import { SvgDot } from "./SvgDot";

export const Legend = () => (
  <div className={styles.legend}>
    <div>
      <span>Active incident </span>
      <SvgDot active={true} radius={5} />
    </div>
    <div>
      <span>10 or more units dispatched </span>
      <SvgDot sev2={true} />
    </div>
    <div>
      <span>5 or more units dispatched </span>
      <SvgDot sev1={true} />
    </div>
    <div>
      <span>Fewer than 5 units dispatched </span>
      <SvgDot />
    </div>
  </div>
);
