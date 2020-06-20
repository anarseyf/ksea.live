import React from "react";
import { Paragraph } from "./Paragraph";
import { Header } from "./Header";
import { useNeighborhoods } from "./neighborhoods";

export const AreaPageHeader = ({ area }) => {
  const neighborhoodsMap = useNeighborhoods();
  const subareas = (
    <div>
      {(neighborhoodsMap[area] || []).map((subarea) => (
        <div key={subarea}>{subarea}</div>
      ))}
    </div>
  );

  // const [list, setList] = useState([]);
  // useEffect(() => {
  //   if (neighborhoodsMap[area]) {
  //     setList(neighborhoodsMap[area]);
  //   }
  // }, [area, neighborhoodsMap]);

  return (
    <>
      <Paragraph title={area} content={subareas} />
      <Header area={area} />
    </>
  );
};
