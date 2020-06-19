import { useState, useEffect, useContext } from 'react';
import { DataContext } from './DataProvider';
import { featuresForArea } from "./geojson";

export const useNeighborhoods = () => {
  const [map, setMap] = useState({});

  const { groupedByArea } = useContext(DataContext);

  useEffect(() => {
    const newMap = {};
    groupedByArea
      .map(({ key }) => key)
      .forEach((key) => {
        newMap[key] = featuresForArea(key)
          .map(({ properties: { CRA_NAM } }) => CRA_NAM)
          .sort();
      });

      setMap(newMap);
  }, [groupedByArea]);

  return map;
}