import React, { useContext, useState, useEffect } from "react";
import { Link } from "@reach/router";
import { DataContext } from "./DataProvider";
import { AreaShape } from "./AreaShape";

import {
  isActive,
  isExactlySev2,
  isExactlySev1,
  isPhone,
  getContentWidth,
} from "../clientUtils";
import { SvgDot } from "./SvgDot";
import { Spark } from "./Spark";
import classnames from "classnames";
import styles from "./group.module.scss";
import { ErrorBoundary } from "./ErrorBoundary";

const Totals = ({ totals }) => {
  const data = totals || { active: 0, sev1: 0, sev2: 0 };
  const sum = data.active + data.sev1 + data.sev2;
  return (
    <div className={styles.totals}>
      {data.active > 0 && (
        <span className={styles.active}>
          <SvgDot active={true} />
          <span>{data.active} </span>
        </span>
      )}
      {data.sev2 > 0 && (
        <span>
          <SvgDot sev2={true} />
          <span> {data.sev2} </span>
        </span>
      )}
      {data.sev1 > 0 && (
        <span>
          <SvgDot sev1={true} />
          <span> {data.sev1} </span>
        </span>
      )}
      {!sum && <span className={styles.empty}>0 active or major</span>}
    </div>
  );
};

export const GroupByArea = () => {
  const { groupedByArea, activeOrMajorByArea } = useContext(DataContext);
  const [totalsMap, setTotalsMap] = useState({});
  const [displayedAreas, setDisplayedAreas] = useState({});
  const [data, setData] = useState([]);
  const phone = isPhone();

  const [compact, setCompact] = useState(false);
  useEffect(() => {
    setCompact(getContentWidth() > 450);
  }, []);

  useEffect(() => {
    if (!activeOrMajorByArea.length) {
      return;
    }

    const map = {};
    activeOrMajorByArea.forEach(({ key: area, intervals }) => {
      const values = intervals[0].values;
      if (values.length) {
        map[area] = {
          active: values.filter(isActive).length,
          sev1: values.filter(isExactlySev1).length,
          sev2: values.filter(isExactlySev2).length,
        };
      }
    });
    setTotalsMap(map);

    const display = {};
    activeOrMajorByArea.forEach(({key: area}) => {
      display[area] = area.replace("/", "/ ");
    });
    setDisplayedAreas(display);
  }, [activeOrMajorByArea]);

  useEffect(() => {
    if (!groupedByArea.length || !totalsMap) {
      return;
    }

    const sortByImportance = (
      { key: areaA, intervals: intervalsA },
      { key: areaB, intervals: intervalsB }
    ) => {
      const { active: activeA, sev1: sev1A, sev2: sev2A } = totalsMap[
        areaA
      ] || { active: 0, sev1: 0, sev2: 0 };
      const { active: activeB, sev1: sev1B, sev2: sev2B } = totalsMap[
        areaB
      ] || { active: 0, sev1: 0, sev2: 0 };
      const totalA = intervalsA[0].total;
      const totalB = intervalsB[0].total;

      return (
        totalB - totalA || activeB - activeA || sev2B - sev2A || sev1B - sev1A
      );
    };
    const sortedData = groupedByArea.sort(sortByImportance);
    setData(sortedData);
  }, [groupedByArea, totalsMap]);

  if (!data.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      {data.map(({ key: area, intervals }) => (
        <div key={area} className={classnames(styles.item, {[styles.compact]: compact})}>
          <div className={classnames(styles.left, {
                [styles.phone]: phone,
              })}>
            <div className={styles.area}>{displayedAreas[area]}</div>
            <Link to={`${encodeURIComponent(area)}`}>
              <AreaShape area={area} />
            </Link>
          </div>
          <div>
              <ErrorBoundary>
                <span className={styles.mini}>
                <Spark
                  intervals={intervals}
                  useCumulative={true}
                  showTotal={true}
                />
                </span>
              </ErrorBoundary>
          </div>
          <Totals totals={totalsMap[area]} />
        </div>
      ))}
    </div>
  );
};
