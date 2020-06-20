import React, { useContext } from "react";
import { DataContext } from "./DataProvider";
import { MultiLine } from "./MultiLine";
import { ErrorBoundary } from "./ErrorBoundary";

export const Header = ({ area }) => {
  const { filteredByAreaMin } = useContext(DataContext);

  if (!filteredByAreaMin.length) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MultiLine
        intervals={filteredByAreaMin[0].intervals}
        useCumulative={!!area}
      />
    </ErrorBoundary>
  );
};
