import React, { useEffect, useState, useContext } from "react";
import { useLegend } from "./useLegend";
import styles from "./legend.module.css";
import { GroupByOptions } from "../groupby";
const size = 10;

export function TypeLegend({ legend = {}, title }) {
  const sublegend = legend[GroupByOptions.IncidentType];

  if (!sublegend) {
    return null;
  }
  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}
      {sublegend.map((d) => (
        <div>
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2}
              fill={d.color || "white"}
            ></circle>
          </svg>
          <span>
            {d.key}: {d.total}
          </span>
        </div>
      ))}
    </div>
  );
}
