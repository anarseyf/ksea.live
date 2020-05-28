import React, { useEffect, useState, useRef } from "react";
import { Topline } from "./Topline";
import { Legend } from "./Legend";

export function Header() {
  const legend = [
    { label: "fire", color: "orangered" },
    { label: "medic", color: "dodgerblue" },
    { label: "other", color: "white" },
  ];
  return (
    <div>
      <Topline number={42} text="Seattle" />
      <Legend legend={legend} />
    </div>
  );
}
