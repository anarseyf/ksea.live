import React, { useEffect, useState, useContext } from "react";
import { useLegend } from "./useLegend";
import styles from "./legend.module.css";
import { GroupByOptions } from "../groupby";
const size = 10;

export function TypeLegend({ legend = {}, title, total }) {
  const sublegend = legend[GroupByOptions.IncidentType];

  if (!sublegend) {
    return null;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {typeof total === "number" && (
          <div className={styles.total}>{total}</div>
        )}
        {title && <div className={styles.title}>{title}</div>}
      </div>
      <div className={styles.body}>
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
    </div>
  );
}
