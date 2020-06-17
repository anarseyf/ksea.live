import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";
import { MultiLine } from "./MultiLine";
import { Paragraph } from "./Paragraph";

export const Header = ({ area }) => {
  const { filteredByArea } = useContext(TweetsContext);

  const text = `Cumulative number of dispatches for ${area} today, compared to the previous N days`;

  if (!filteredByArea.length) {
    return null;
  }

  return (
    <>
      <Paragraph text={text} />
      <MultiLine
        intervals={filteredByArea[0].intervals}
        useCumulative={false}
        fullWidth={true}
      />
    </>
  );
};
