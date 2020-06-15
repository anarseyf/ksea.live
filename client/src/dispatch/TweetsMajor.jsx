import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";

import { TweetList } from "./TweetList";

export function TweetsMajor() {
  const { major } = useContext(TweetsContext);

  return <TweetList tweets={major} />;
}
