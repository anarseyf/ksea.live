import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "@reach/router";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions, groupBy } from "../groupby";
import styles from "./chart.module.scss";
import { TypeLegend } from "./TypeLegend";
import { legendByType } from "./useLegend";
import * as d3 from "d3";
import { UserContext, UserContextKeys } from "./UserProvider";

export function GroupByArea() {
  const groupedby = GroupByOptions.ZipCode;
  const [tweets] = useContext(TweetsContext);
  const [_, setSelection] = useContext(UserContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    const tweetsBy = groupBy(groupedby, tweets);

    const newData = tweetsBy
      .map(({ values, ...rest }) => ({
        ...rest,
        values,
        total: values.length,
        legend: legendByType(values),
      }))
      .sort((a, b) => d3.descending(a.total, b.total));

    setData(newData);
  }, [tweets]);

  const handleMouseEnter = (zipcode) => {
    setSelection(UserContextKeys.HoverArea, zipcode);
  };

  const handleMouseLeave = (zipcode) => {
    setSelection(UserContextKeys.HoverArea, null);
  };
  if (!data.length) {
    return null;
  }

  const groupTitle = `> Group by ${groupedby}`;

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {data.map(({ legend, key, total }) => (
        <Link
          to={`${key}`}
          onMouseEnter={() => handleMouseEnter(key)}
          onMouseLeave={handleMouseLeave}
        >
          <TypeLegend legend={legend} title={key} total={total} />
        </Link>
      ))}
    </div>
  );
}
