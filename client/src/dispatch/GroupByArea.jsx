import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "@reach/router";
import { TweetsContext } from "./TweetsProvider";
import { UserContext, UserContextKeys } from "./UserProvider";
import { MultiLine } from "./MultiLine";
import { AreaShape } from "./AreaShape";
import { featuresForArea } from "./geojson";
import { Total } from "./Total";
import styles from "./group.module.scss";

export function GroupByArea() {
  const { setSelection } = useContext(UserContext);
  const { groupedByArea } = useContext(TweetsContext);

  if (!groupedByArea.length) {
    return null;
  }

  const handleMouseEnter = (area) => {
    setSelection(UserContextKeys.HoverArea, area);
  };

  const handleMouseLeave = () => {
    setSelection(UserContextKeys.HoverArea, null);
  };

  const getNeighborhoods = () => {
    const map = {};
    groupedByArea
      .map(({ key }) => key)
      .forEach((key) => {
        map[key] = featuresForArea(key).map(
          ({ properties: { CRA_NAM } }) => CRA_NAM
        );
      });
    return map;
  };
  const neighborhoodsMap = getNeighborhoods();

  return (
    <div className={styles.container}>
      {groupedByArea.map(({ key: area, intervals }) => (
        <div
          className={styles.itemContainer}
          onMouseEnter={() => handleMouseEnter(area)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.itemHeader}>{area}</div>
          <div className={styles.text}>{neighborhoodsMap[area].join(", ")}</div>
          <Link to={`${encodeURIComponent(area)}`}>
            <div className={styles.item}>
              <AreaShape area={area} />

              <MultiLine intervals={intervals} useCumulative={true} />
              <Total total={intervals[0].total} />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
