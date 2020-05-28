import React, { useEffect, useState, useRef, useContext } from "react";
import { Topline } from "./Topline";
import { Legend } from "./Legend";
import { TweetsContext } from "./TweetsProvider";

export function Header() {
  const tweets = useContext(TweetsContext);

  return (
    <div>
      <Topline number={tweets.length} text="Seattle" />
      <Legend />
    </div>
  );
}
