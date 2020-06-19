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

  const neighborhoodsMap = useNeighborhoods();

  useEffect(() => {
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

  if (!groupedByArea.length) {
    return null;
  }

  return (
      <div className={styles.container}>
        {groupedByArea.map(({ key: area, intervals }) => (
          <div className={styles.itemContainer}>
            <Link to={`${encodeURIComponent(area)}`}>
              <div className={styles.vpadding}>
                <div className={styles.fullWidth}>
                  <div className={styles.item}>&nbsp;</div>
                  <div className={classnames(styles.item, styles.right)}>
                  <ErrorBoundary>
                    <Spark
                      intervals={intervals}
                      useCumulative={true}
                      showTotal={true}
                    />
                    </ErrorBoundary>
                  </div>
                </div>

                <div className={classnames(styles.item, styles.text)}>
                  <div>{area}</div>
                  {neighborhoodsMap[area] && <div className={styles.list}>
                    {neighborhoodsMap[area].map((v) => (
                      <div>• {v}</div>
                    ))}
                  </div>}
                </div>

                <div className={classnames(styles.item, styles.right)}>
                  <div>
                    <AreaShape area={area} />
                  </div>
                  {/* <Total total={intervals[0].total} /> */}
                  {totalsMap[area] && (
                    <div className={styles.major}>
                      {totalsMap[area].active > 0 && (
                        <span>
                          <span>{totalsMap[area].active} active</span>
                          <SvgDot active={true} />
                        </span>
                      )}
                      {totalsMap[area].sev2 > 0 && (
                        <span>
                          <span>{totalsMap[area].sev2} major</span>
                          <SvgDot sev2={true} />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
  );
};
