import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";
import { MultiLine } from "./MultiLine";
import { Paragraph } from "./Paragraph";

export const Header = ({ area }) => {
  const { filteredByArea } = useContext(TweetsContext);

  if (!filteredByArea.length) {
    return null;
  }

  return (
      <MultiLine
        intervals={filteredByArea[0].intervals}
        useCumulative={false}
        fullWidth={true}
      />
  );
};
