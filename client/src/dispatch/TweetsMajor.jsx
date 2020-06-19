import React, { useContext } from "react";
import { DataContext } from "./DataProvider";

import { TweetList } from "./TweetList";

export const TweetsMajor = () => {
  const { major24 } = useContext(DataContext);

  return <TweetList tweets={major24} />;
}
