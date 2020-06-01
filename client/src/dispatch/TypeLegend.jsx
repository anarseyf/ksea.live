import React, { useEffect, useState, useContext } from "react";
import styles from "./legend.module.scss";
import { GroupByOptions } from "../groupby";
import * as d3 from "d3";

export function TypeLegend({ legend = {}, title, total, showLabels }) {
  const sublegend = legend[GroupByOptions.IncidentType];
  if (!sublegend) {
    return null;
  }

  console.log("sublegend", sublegend);
  const max = d3.max(sublegend.map(({ total }) => total));
  const maxWidth = 50;
  const size = 10;

  const widthFn = ({ total }) => d3.max([1, maxWidth * (total / max)]);

  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.header}>
          {typeof total === "number" && (
            <div className={styles.total}>{total}</div>
          )}
          <div className={styles.title}>{title}</div>
        </div>
      )}
      <div className={styles.body}>
        {sublegend.map((d) => (
          <div className={styles.labels}>
            {showLabels && (
              <span>
                {d.key}: {d.total}
              </span>
            )}
            <svg className={styles.svg} width={maxWidth} height={size}>
              <rect
                x={0}
                y={0}
                width={widthFn(d)}
                height={size}
                rx={4}
                fill={d.color || "white"}
              ></rect>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
