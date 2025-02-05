import React, { useContext } from "react";
import styles from "./typelegend.module.scss";
import { max as d3max, sum as d3sum } from "d3-array";
import { UserContext, UserContextKeys } from "./UserProvider";
import classnames from "classnames";

export const TypeLegend = ({ legend = [], title, showTotal, showLabels }) => {
  const { user, setSelection } = useContext(UserContext);
  const contextKey = UserContextKeys.TypeFilter;

  if (!legend) {
    return null;
  }

  const counts = legend.map(({ total }) => total);
  const max = d3max(counts);
  const total = d3sum(counts);
  const maxWidth = 50;
  const size = 10;

  const widthFn = ({ total }) => d3max([2, maxWidth * (total / max)]);

  const handleClick = ({ key: type }) => {
    const filter = user[contextKey];
    setSelection(contextKey, filter === type ? undefined : type);
  };

  const filter = user[contextKey];

  return (
    <div className={styles.container}>
      {title ||
        (showTotal && (
          <div className={styles.header}>
            {showTotal && <div className={styles.total}>{total}</div>}
            {title && <div className={styles.title}>{title}</div>}
          </div>
        ))}
      <div className={styles.body}>
        {legend.map((d) => (
          <div
            className={classnames(styles.item, {
              [styles.selected]: d.key === filter,
            })}
            onClick={() => handleClick(d)}
          >
            {showLabels && (
              <div className={styles.label}>
                {d.key}: {d.total}
              </div>
            )}
            <svg className={styles.svg} width={widthFn(d)} height={size}>
              <rect
                x={0}
                y={0}
                width={widthFn(d)}
                height={size}
                rx={3}
                fill={d.color}
              ></rect>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
