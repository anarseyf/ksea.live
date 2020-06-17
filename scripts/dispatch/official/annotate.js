const path = require("path");
const { getHistoryAsync } = require("../../../dispatchHelpers");

import * as d3 from "d3";
import {
  toPacificDateString,
  toPacificStringMMMD,
  saveJSONAsync,
} from "../fileUtils";
import { datasetsPath } from "../serverUtils";

const annotationsForYear = ({ binsLowRes, offset, start: yearStart }) => {
  let bins = binsLowRes;
  if (offset === 0) {
    // Current year — ignore today's bin as it's incomplete
    bins = binsLowRes.slice(0, -1);
  }
  const year = new Date(yearStart).getFullYear();
  const lengths = bins.map(({ length }) => length);
  const [min, max] = d3.extent(lengths);
  const minBin = bins.find(({ length }) => length === min);
  const maxBin = bins.find(({ length }) => length === max);

  const minDate = new Date(minBin.x0 - offset);
  const maxDate = new Date(maxBin.x0 - offset);
  const minDateStr = toPacificDateString(minDate);
  const maxDateStr = toPacificDateString(maxDate);
  const annotationMin = {
    start: {
      date: minDateStr,
      title: `${year} low`,
      label: `${toPacificStringMMMD(minDate)}: ${min}`,
      value: min,
    },
  };
  const annotationMax = {
    start: {
      date: maxDateStr,
      title: `${year} low`,
      label: `${toPacificStringMMMD(maxDate)}: ${max}`,
      value: max,
    },
  };
  return [annotationMin, annotationMax];
};

const main = async () => {
  const history = await getHistoryAsync();

  const history2020 = history[0].intervals[0];
  const history2019 = history[0].intervals[1];

  const annotations2019 = annotationsForYear(history2019);
  const annotations2020 = annotationsForYear(history2020);

  const file = path.join(datasetsPath, "../misc/generatedAnnotations.json");
  await saveJSONAsync(file, [...annotations2019, ...annotations2020]);
  // await saveJSONAsync(file, annotations2019);
};

main();
