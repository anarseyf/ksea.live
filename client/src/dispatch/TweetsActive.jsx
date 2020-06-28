import React, { useContext } from "react";
import { DataContext } from "./DataProvider";

import { TweetList } from "./TweetList";

export const TweetsActive = () => {
  const { active24 } = useContext(DataContext);

  return <TweetList tweets={active24} placeholder={"No active incidents"} />;
}
