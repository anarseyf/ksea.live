import React from "react";
import { Paragraph } from "./Paragraph";
import { Header } from "./Header";
import { useNeighborhoods } from "./neighborhoods";

export const AreaPageHeader = ({ area }) => {
  const neighborhoodsMap = useNeighborhoods();
  const decodedArea = decodeURIComponent(area);
  const subareas = (
    <div>
      {(neighborhoodsMap[decodedArea] || []).map((subarea) => (
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
      <Paragraph title={decodedArea} content={subareas} />
      <Header area={area} />
    </>
  );
};
