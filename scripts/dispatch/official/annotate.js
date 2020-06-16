const path = require("path");
const { getHistoryAsync } = require("../../../dispatchHelpers");

import * as d3 from "d3";
import { toPacificDateString, saveJSONAsync } from "../fileUtils";
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

  const maxDate = toPacificDateString(new Date(maxBin.x0 - offset));
  const minDate = toPacificDateString(new Date(minBin.x0 - offset));
  const annotationMax = {
    start: maxDate,
    textStart: `${year} high`,
    value: max,
  };
  const annotationMin = {
    start: minDate,
    textStart: `${year} low`,
    value: min,
  };
  return [annotationMax, annotationMin];
};

const main = async () => {
  const history = await getHistoryAsync();

  const history2020 = history[0].intervals[0];
  const history2019 = history[0].intervals[1];

  const annotations2019 = annotationsForYear(history2019);
  const annotations2020 = annotationsForYear(history2020);

  console.log("annotate > 2019: \n", annotations2019);
  console.log("annotate > 2020: \n", annotations2020);

  const file = path.join(datasetsPath, "../misc/generatedAnnotations.json");
  await saveJSONAsync(file, [...annotations2019, ...annotations2020]);
  // await saveJSONAsync(file, annotations2019);
};

main();
