import React, { useContext } from "react";
import { DataContext, currentInterval } from "./DataProvider";

import { UserContextKeys, UserContext } from "./UserProvider";
import { TweetList } from "./TweetList";

export const TweetsForArea = () => {
  const { filteredByArea } = useContext(DataContext);
  const { user } = useContext(UserContext);
  const filter = user[UserContextKeys.TypeFilter];

  if (!filteredByArea.length) {
    return null;
  }
  const all = currentInterval(filteredByArea).values;
  const filtered = all.filter(
    ({ derived: { type } }) => !filter || filter === type
  );

  return <TweetList tweets={filtered} />;
}
