const path = require("path");
const { getHistoryAsync } = require("../../../dispatchCompute");

import * as d3 from "d3";
import {
  toPacificDateString,
  toPacificStringMMMD,
  saveJSONAsync,
} from "../../../fileUtils";
import { datasetsPath } from "../../../server/serverUtils";

const annotationsForYear = ({ binsLowRes, offset, start: yearStart }) => {
  let data = binsLowRes;
  let result = [];

  // TODO - make sure this works as intended past 2020
  if (offset === 0) {
    // Current year — ignore today's bin as it's incomplete
    data = binsLowRes.slice(0, -1);

    const lastBin = data[data.length - 1];
    const date = new Date(lastBin.x0);
    const annotationToday = {
      end: {
        date: toPacificDateString(date),
        title: toPacificStringMMMD(date),
        value: lastBin.length,
      },
    };
    result.push(annotationToday);
  }
  const year = new Date(yearStart).getFullYear();
  const lengths = data.map(({ length }) => length);
  const [min, max] = d3.extent(lengths);
  const minBin = data.find(({ length }) => length === min);
  const maxBin = data.find(({ length }) => length === max);

  const minDate = new Date(minBin.x0 - offset);
  const maxDate = new Date(maxBin.x0 - offset);
  const minDateStr = toPacificDateString(minDate);
  const maxDateStr = toPacificDateString(maxDate);
  const annotationMin = {
    start: {
      date: minDateStr,
      title: `${year} low`,
      label: `${min} (${toPacificStringMMMD(minDate)})`,
      value: min,
    },
  };
  const annotationMax = {
    start: {
      date: maxDateStr,
      title: `${year} high`,
      label: `${max} (${toPacificStringMMMD(maxDate)})`,
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
