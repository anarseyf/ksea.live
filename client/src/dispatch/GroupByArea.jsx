import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "@reach/router";
import { TweetsContext } from "./TweetsProvider";
import { GroupByOptions, groupBy } from "../groupby";
import styles from "./chart.module.scss";
import { TypeLegend } from "./TypeLegend";
import * as d3 from "d3";
import { UserContext, UserContextKeys } from "./UserProvider";
import { useLegend } from "./useLegend";

export function GroupByArea() {
  const [_, legendsByArea] = useLegend(TweetsContext);
  const [_2, setSelection] = useContext(UserContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!Object.keys(legendsByArea).length) {
      return;
    }

    console.log("GROUP AREA/legends", legendsByArea);

    // const newData = tweetsByArea
    //   .map(({ values, ...rest }) => ({
    //     ...rest,
    //     values,
    //     total: values.length,
    //     legend: legendsByArea[values],
    //   }))
    //   .sort((a, b) => d3.descending(a.total, b.total));

    // setData(newData);
  }, [legendsByArea]);

  const handleMouseEnter = (zipcode) => {
    setSelection(UserContextKeys.HoverArea, zipcode);
  };

  const handleMouseLeave = () => {
    setSelection(UserContextKeys.HoverArea, null);
  };

  const groupTitle = `> Group by ${GroupByOptions.ZipCode}`;

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
