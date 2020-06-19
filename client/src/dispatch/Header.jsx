import React, { useContext } from "react";
import { DataContext } from "./DataProvider";
import { MultiLine } from "./MultiLine";
import { ErrorBoundary } from "./ErrorBoundary";

export const Header = ({ area }) => {
  const { filteredByArea } = useContext(DataContext);

  if (!filteredByArea.length) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MultiLine
        intervals={filteredByArea[0].intervals}
        useCumulative={!!area}
      />
    </ErrorBoundary>
  );
};
