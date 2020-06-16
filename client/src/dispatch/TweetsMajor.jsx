import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";

import { TweetList } from "./TweetList";

export function TweetsMajor() {
  const { major24 } = useContext(TweetsContext);

  return <TweetList tweets={major24} />;
}