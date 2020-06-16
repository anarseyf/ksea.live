const { getHistoryAsync } = require("../../../dispatchHelpers");

import * as d3 from "d3";

const annotationsForYear = (history) => {
  console.log(Object.keys(history));
  const bins = history.binsLowRes;
  const lengths = bins.map(({ length }) => length);
  const [min, max] = d3.extent(lengths);
  const minBin = bins.find(({ length }) => length === min);
  const maxBin = bins.find(({ length }) => length === max);

  console.log("MAX BIN", maxBin);
};

const main = async () => {
  const history = await getHistoryAsync();

  const history2019 = history[0].intervals[0];
  const history2020 = history[0].intervals[1];

  const annotations2019 = annotationsForYear(history2019);
  const annotations2020 = annotationsForYear(history2020);

  console.log("annotate > 2019: \n", annotations2019);
};

main();
