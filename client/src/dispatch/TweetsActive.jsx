import React, { useContext } from "react";
import { TweetsContext } from "./TweetsProvider";

import { TweetList } from "./TweetList";

export function TweetsActive() {
  const { active24 } = useContext(TweetsContext);

  return <TweetList tweets={active24} />;
}
