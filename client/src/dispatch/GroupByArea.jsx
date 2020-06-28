import React, { useContext, useState, useEffect } from "react";
import { Link } from "@reach/router";
import { DataContext } from "./DataProvider";
import { AreaShape } from "./AreaShape";

import {
  isActive,
  isExactlySev2,
  isExactlySev1,
  isPhone,
} from "../clientUtils";
import { SvgDot } from "./SvgDot";
import { Spark } from "./Spark";
import classnames from "classnames";
import styles from "./group.module.scss";
import { ErrorBoundary } from "./ErrorBoundary";

const Totals = ({ totals }) => {
  if (!totals) {
    return null;
  }
  return (
    <>
      {totals.active > 0 && (
        <span className={styles.active}>
          <SvgDot active={true} />
          <span>{totals.active} </span>
        </span>
      )}
      {totals.sev2 > 0 && (
        <span>
          <SvgDot sev2={true} />
          <span> {totals.sev2} </span>
        </span>
      )}
      {totals.sev1 > 0 && (
        <span>
          <SvgDot sev1={true} />
          <span> {totals.sev1} </span>
        </span>
      )}
    </>
  );
};

export const GroupByArea = () => {
  const { groupedByArea, activeOrMajorByArea } = useContext(DataContext);
  const [totalsMap, setTotalsMap] = useState({});
  const [data, setData] = useState([]);
  const phone = isPhone();

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
        activeB - activeA || sev2B - sev2A || sev1B - sev1A || totalB - totalA
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
        <div key={area} className={styles.item}>
          <div
            className={classnames(styles.text, {
              [styles.phone]: phone,
            })}
          >
            <div className={styles.area}>{area}</div>
            {/* {neighborhoodsMap[area] && (
                  <div className={classnames(styles.list)}>
                    {neighborhoodsMap[area].map((v) => (
                      <div key={v}>• {v}</div>
                    ))}
                  </div>
                )} */}
          </div>

          <Link to={`${encodeURIComponent(area)}`}>
            <AreaShape area={area} />
          </Link>
          <div>
            <span className={styles.mini}>
              <ErrorBoundary>
                <Spark
                  intervals={intervals}
                  useCumulative={true}
                  showTotal={true}
                />
              </ErrorBoundary>
              <Totals totals={totalsMap[area]} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
