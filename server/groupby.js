import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";
import { toPacificMidnight } from "../scripts/dispatch/fileUtils";
import { histogram } from "./histogram";

export const GroupByOptions = {
  Nothing: undefined,
  IncidentType: "type",
  ZipCode: "zip",
  Area: "area",
  TimeInterval: "time",
};

const TwentyFourHours = 24 * 3600 * 1000;
const HistoryBinSizeMinutes = TwentyFourHours / (60 * 1000);
const HistoryInterval = 30 * TwentyFourHours;

const isHistory = (start, end) => end - start > TwentyFourHours;

export const intervalsReducer = (timestamp) => (matchedOption, [from, to]) => {
  if (matchedOption) {
    return matchedOption;
  }
  return timestamp >= from && timestamp < to ? from : undefined;
};

export const generateHistoryIntervals = () => {
  const currentStart = toPacificMidnight(+new Date());
  const end = currentStart + TwentyFourHours;
  const start = end - HistoryInterval;
  return [[start, end]];
};

export const generateIntervals = () => {
  const currentStart = toPacificMidnight(+new Date());

  const intervalFn = (iOffset) => [
    currentStart + iOffset * TwentyFourHours,
    currentStart + (iOffset + 1) * TwentyFourHours,
  ];

  return [0, -1].map(intervalFn); // TODO — offset by 1ms to make it [start, end) ?
};

const IncidentTypes = {
  Known: { Fire: "fire", Medic: "medic", Aid: "aid" },
  Default: "other",
};

const Mappers = {
  [GroupByOptions.IncidentType]: () => ({ derived: { description } }) => {
    const options = Object.values(IncidentTypes.Known);
    const desc = description.toLowerCase();
    const match = options.reduce((matchedOption, option) => {
      if (matchedOption) {
        return matchedOption;
      }
      return desc.includes(option) ? option : undefined;
    }, undefined);
    return match || IncidentTypes.Default;
  },
  [GroupByOptions.ZipCode]: () => (t) => t.derived.zip,
  [GroupByOptions.Area]: () => (t) => t.derived.neighborhoodGroup,
  [GroupByOptions.TimeInterval]: (intervals) => ({ derived: { timestamp } }) =>
    intervals.reduce(intervalsReducer(timestamp), undefined),
};

export function groupBy(option = GroupByOptions.Nothing, tweets, intervals) {
  if (option === GroupByOptions.Nothing) {
    return byNothing(tweets);
  }
  if (option === GroupByOptions.IncidentType) {
    return byIncidentType(tweets);
  }
  if (option === GroupByOptions.ZipCode) {
    return byZip(tweets);
  }
  if (option === GroupByOptions.Area) {
    return byArea(tweets);
  }
  if (option === GroupByOptions.TimeInterval) {
    return byTimeInterval(tweets, intervals);
  }
  throw `Unrecognized groupby option: ${option}`;
}

const byNothing = (tweets) => {
  return [
    {
      groupby: undefined,
      key: undefined,
      values: tweets,
    },
  ];
};

const byIncidentType = (tweets) => {
  const option = GroupByOptions.IncidentType;
  const requiredKeys = [
    IncidentTypes.Known.Fire,
    IncidentTypes.Known.Medic,
    IncidentTypes.Known.Aid,
    IncidentTypes.Default,
  ];
  const grouped = by(option, tweets, requiredKeys, Mappers[option]());

  return grouped.map(addColors);
};

const addColors = ({ key, ...rest }) => {
  const color = scaleOrdinal(schemeCategory10);
  const { Fire, Medic, Aid } = IncidentTypes.Known;
  color.domain([Medic, IncidentTypes.Default, Aid, Fire]); // https://github.com/d3/d3-scale-chromatic#schemeCategory10

  return {
    key,
    color: color(key),
    ...rest,
  };
};

const byZip = (tweets) => {
  const option = GroupByOptions.ZipCode;
  return by(option, tweets, [], Mappers[option]());
};

const byArea = (tweets) => {
  const option = GroupByOptions.Area;
  return by(option, tweets, [], Mappers[option]());
};

const byTimeInterval = (tweets, intervals) => {
  const requiredKeys = intervals.map(([start]) => String(start));
  const option = GroupByOptions.TimeInterval;
  let byInterval = by(option, tweets, requiredKeys, Mappers[option](intervals));
  byInterval.forEach((v, i) => {
    v.start = intervals[i][0];
    v.end = intervals[i][1];
  });
  const result = addOffsets(byInterval).map(addTotals).map(addHistograms);
  return result;
};

const by = (option, tweets, requiredKeys = [], mapper) => {
  const map = {};

  requiredKeys.forEach((key) => {
    map[key] = [];
  });

  tweets.forEach((t) => {
    const key = mapper(t);
    if (key === undefined) {
      return;
    }
    const list = map[key] || [];
    list.push(t);
    map[key] = list;
  });

  return Object.keys(map).map((key) => ({
    groupby: option,
    key,
    values: map[key],
  }));
};

const addOffsets = (intervals) => {
  const valueMapper = (
    { derived: { timestamp, ...restDerived }, ...restValue },
    offset
  ) => ({
    ...restValue,
    derived: {
      timestamp,
      offset,
      ...restDerived,
    },
  });

  const start0 = intervals[0].start;

  const withOffsets = intervals.map(({ start, ...rest }) => ({
    start,
    offset: start0 - start,
    ...rest,
  }));

  const result = withOffsets.map(({ offset, values, ...rest }) => ({
    offset,
    values: values.map((v) => valueMapper(v, offset)),
    ...rest,
  }));

  return result;
};

const addTotals = ({ values, ...rest }) => ({
  values,
  total: values.length,
  ...rest,
});

const addHistograms = ({ start, end, offset, values, ...rest }) => {
  const extent = [start + offset, end + offset];
  const result = {
    start,
    end,
    offset,
    values,
    ...rest,
    bins: [],
    binsHiRes: [],
    binsLowRes: histogram(values, {
      extent,
      thresholdMinutes: HistoryBinSizeMinutes,
    }),
  };
  if (!isHistory(start, end)) {
    result.bins = histogram(values, { extent });
    result.binsHiRes = histogram(values, { extent, thresholdMinutes: 15 });
  }
  return result;
};
