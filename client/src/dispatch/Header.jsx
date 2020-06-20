import React, { useContext } from "react";
import { DataContext } from "./DataProvider";
import { MultiLine } from "./MultiLine";
import { ErrorBoundary } from "./ErrorBoundary";

export const Header = ({ area }) => {
  const { filteredByAreaMinWeek } = useContext(DataContext);

  if (!filteredByAreaMinWeek.length) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MultiLine
        intervals={filteredByAreaMinWeek[0].intervals}
        useCumulative={!!area}
      />
    </ErrorBoundary>
  );
};
