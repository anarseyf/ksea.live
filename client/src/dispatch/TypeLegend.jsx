import React, { useEffect, useState, useContext } from "react";
import styles from "./legend.module.scss";
import { GroupByOptions } from "../groupby";
import * as d3 from "d3";

export function TypeLegend({ legend = {}, title, total, showLabels }) {
  const sublegend = legend[GroupByOptions.IncidentType];
  if (!sublegend) {
    return null;
  }

  const max = d3.max(sublegend.map(({ total }) => total));
  const maxWidth = 50;
  const size = 8;

  const widthFn = ({ total }) => d3.max([1, maxWidth * (total / max)]);

  return (
    <div
      className={`${styles.container} ${showLabels ? styles.withLabels : ""}`}
    >
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
          <div className={styles.item}>
            {showLabels && (
              <div className={styles.label}>
                {d.key}: {d.total}
              </div>
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
