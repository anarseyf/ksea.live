import React, { useContext, useState, useEffect } from "react";
import { Link } from "@reach/router";
import { TweetsContext } from "./TweetsProvider";
import { MultiLine } from "./MultiLine";
import { AreaShape } from "./AreaShape";
import { featuresForArea } from "./geojson";
import { Total } from "./Total";
import { isActive, isAtLeastSev2, isAtLeastSev1 } from "../clientUtils";
import { SvgDot } from "./SvgDot";
import classnames from "classnames";
import styles from "./group.module.scss";

export function GroupByArea() {
  const { groupedByArea, activeOrMajorByArea } = useContext(TweetsContext);
  const [totalsMap, setTotalsMap] = useState({});

  useEffect(() => {
    const map = {};
    groupedByArea.forEach(({ key: area }) => {
      map[area] = { active: 0, sev1: 0, sev2: 0 };
    });
    activeOrMajorByArea.forEach(({ key: area, intervals }) => {
      const values = intervals[0].values;
      map[area] = {
        active: values.filter(isActive).length,
        sev1: values.filter(isAtLeastSev1).length,
        sev2: values.filter(isAtLeastSev2).length,
      };
    });
    setTotalsMap(map);
  }, [groupedByArea, activeOrMajorByArea]);

  if (!groupedByArea.length) {
    return null;
  }

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
        <div className={styles.itemContainer}>
          <Link to={`${encodeURIComponent(area)}`}>
            <div className={classnames(styles.item, styles.text)}>
              <div>{area}</div>
              <div className={styles.list}>
                {neighborhoodsMap[area].join(", ")}
              </div>
            </div>
            <div className={styles.item}>
              <MultiLine intervals={intervals} useCumulative={true} />
              <Total total={intervals[0].total} />
              {totalsMap[area] && (
                <div>
                  <span>{totalsMap[area].active} active</span>
                  <SvgDot active={true} />
                  <span>{totalsMap[area].sev2} major</span>
                  <SvgDot sev2={true} />
                </div>
              )}
            </div>
            <div className={styles.item}>
              <AreaShape area={area} />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
