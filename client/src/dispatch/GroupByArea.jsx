import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "@reach/router";
import { TweetsContext } from "./TweetsProvider";
import { UserContext, UserContextKeys } from "./UserProvider";
import { GroupByOptions } from "../groupingOptions";
import { TypeLegend } from "./TypeLegend";
import { MultiLine } from "./MultiLine";
import { useLegend } from "./useLegend";
import styles from "./group.module.scss";
import { AreaShape } from "./AreaShape";
import { featuresForArea } from "./geojson";

export function GroupByArea() {
  const [_, legends] = useLegend();
  const { setSelection } = useContext(UserContext);
  const { groupedByArea } = useContext(TweetsContext);

  if (!groupedByArea.length || !legends) {
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

  const groupTitle = `> Group by Area`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>{groupTitle}</div>

      {groupedByArea.map(({ key: area, intervals }) => (
        <div
          className={styles.itemContainer}
          onMouseEnter={() => handleMouseEnter(area)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.itemHeader}>{area}</div>
          <div className={styles.text}>{neighborhoodsMap[area].join(", ")}</div>
          <Link to={`${area}`}>
            <div className={styles.item}>
              <AreaShape area={area} />

              <MultiLine intervals={intervals} useCumulative={true} />
              {legends[area] && (
                <TypeLegend
                  legend={legends[area][GroupByOptions.IncidentType]}
                  showTotal={true}
                />
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
