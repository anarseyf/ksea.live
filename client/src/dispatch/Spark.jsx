import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import * as d3 from "d3";
import chartStyles from "./chart.module.scss";
import svgStyles from "./svg.module.scss";
import { intervalExtent, isPhone } from "../clientUtils";

