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
  let result = [];
  if (offset === 0) {
    // TODO - make sure this works as intended past 2020
    const lastBin = binsLowRes[binsLowRes.length - 1];
    const annotationToday = {
      end: {
        date: toPacificDateString(new Date(lastBin.x0)),
        title: "Today",
        value: lastBin.length,
      },
    };
    result.push(annotationToday);

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
      title: `${year} high`,
      label: `${toPacificStringMMMD(maxDate)}: ${max}`,
      value: max,
    },
  };

  result = result.concat(annotationMin, annotationMax);
  return result;
};

const main = async () => {
  // TODO - run as a low-frequency loop
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
