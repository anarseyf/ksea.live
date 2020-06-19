import React, { useContext, useState, useEffect } from "react";
import { Link } from "@reach/router";
import { DataContext } from "./DataProvider";
import { AreaShape } from "./AreaShape";

import { isActive, isAtLeastSev2, isAtLeastSev1 } from "../clientUtils";
import { SvgDot } from "./SvgDot";
import { Spark } from "./Spark";
import classnames from "classnames";
import styles from "./group.module.scss";
import { ErrorBoundary } from "./ErrorBoundary";
import { useNeighborhoods } from "./neighborhoods";

export const GroupByArea = () => {
  const { groupedByArea, activeOrMajorByArea } = useContext(DataContext);
  const [totalsMap, setTotalsMap] = useState({});
  const [data, setData] = useState([]);

  const neighborhoodsMap = useNeighborhoods();

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
          sev1: values.filter(isAtLeastSev1).length,
          sev2: values.filter(isAtLeastSev2).length,
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

    console.log(
      "GROUP/sorted",
      sortedData.map(({ key }) => key)
    );
    console.log("GROUP/map", totalsMap);
  }, [groupedByArea, totalsMap]);

  if (!data.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      {data.map(({ key: area, intervals }) => (
        <div className={styles.itemContainer}>
          <Link to={`${encodeURIComponent(area)}`}>
            <div className={styles.vpadding}>
              <div className={styles.fullWidth}>
                <div className={styles.item}>&nbsp;</div>
                <div className={classnames(styles.item, styles.right)}>
                  {totalsMap[area] && (
                    <div className={styles.major}>
                      {totalsMap[area].active > 0 && (
                        <span className={styles.active}>
                          <SvgDot active={true} />
                          <span>{totalsMap[area].active} active </span>
                        </span>
                      )}
                      {totalsMap[area].sev2 > 0 && (
                        <>
                          <SvgDot sev2={true} />
                          <span> {totalsMap[area].sev2} major </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={classnames(styles.item, styles.text)}>
                <div>{area}</div>
                {neighborhoodsMap[area] && (
                  <div className={styles.list}>
                    {neighborhoodsMap[area].map((v) => (
                      <div>• {v}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className={classnames(styles.item, styles.right)}>
                <div>
                  <AreaShape area={area} />
                </div>
                {/* <Total total={intervals[0].total} /> */}

                <ErrorBoundary>
                  <Spark
                    className={styles.spark}
                    intervals={intervals}
                    useCumulative={true}
                    showTotal={true}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
