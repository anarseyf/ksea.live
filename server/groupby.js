import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";
import { toPacificMidnight } from "../scripts/dispatch/fileUtils";

export const GroupByOptions = {
  Nothing: null,
  IncidentType: "type",
  ZipCode: "zip",
  Neighborhood: "nhood",
  TimeInterval: "time",
};

export const DefaultInterval = 24 * 3600 * 1000;

export const intervalsReducer = (timestamp) => (matchedOption, [from, to]) => {
  if (matchedOption) {
    return matchedOption;
  }
  return timestamp >= from && timestamp < to ? from : null;
};

export const generateIntervals = () => {
  const currentStart = toPacificMidnight(+new Date());
  const previousStart = currentStart - DefaultInterval;

  return [
    [currentStart, currentStart + DefaultInterval], // TODO — offset by 1ms to make it [start, end) ?
    [previousStart, previousStart + DefaultInterval],
  ];
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
      return desc.includes(option) ? option : null;
    }, null);
    return match || IncidentTypes.Default;
  },
  [GroupByOptions.ZipCode]: () => (t) => t.derived.zip,
  [GroupByOptions.Neighborhood]: () => (t) => t.derived.nhood,
  [GroupByOptions.TimeInterval]: (intervals) => ({ derived: { timestamp } }) =>
    intervals.reduce(intervalsReducer(timestamp), null),
};

export function groupBy(option = GroupByOptions.Nothing, tweets) {
  if (option === GroupByOptions.Nothing) {
    return byNothing(tweets);
  }
  if (option === GroupByOptions.IncidentType) {
    return byIncidentType(tweets);
  }
  if (option === GroupByOptions.ZipCode) {
    return byZip(tweets);
  }
  if (option === GroupByOptions.Neighborhood) {
    return byNeighborhood(tweets);
  }
  if (option === GroupByOptions.TimeInterval) {
    return byTimeInterval(tweets);
  }
  throw `Unrecognized groupby option: ${option}`;
}

const byNothing = (tweets) => {
  return [
    {
      groupby: null,
      key: null,
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

  const color = scaleOrdinal(schemeCategory10);
  const { Fire, Medic, Aid } = IncidentTypes.Known;
  color.domain([Medic, IncidentTypes.Default, Aid, Fire]); // https://github.com/d3/d3-scale-chromatic#schemeCategory10

  return grouped.map((d) => ({ ...d, color: color(d.key) }));
};

const byZip = (tweets) => {
  const option = GroupByOptions.ZipCode;
  return by(option, tweets, [], Mappers[option]());
};

const byNeighborhood = (tweets) => {
  const option = GroupByOptions.Neighborhood;
  return by(option, tweets, [], Mappers[option]());
};

const byTimeInterval = (tweets) => {
  const intervals = generateIntervals();
  const requiredKeys = intervals.map(([start]) => String(start));
  const option = GroupByOptions.TimeInterval;
  return by(option, tweets, requiredKeys, Mappers[option](intervals));
};

const by = (option, tweets, requiredKeys = [], mapper) => {
  const mapped = {};

  requiredKeys.forEach((key) => {
    mapped[key] = [];
  });

  tweets.forEach((t) => {
    const key = mapper(t);
    if (key === null) {
      return;
    }
    const list = mapped[key] || [];
    list.push(t);
    mapped[key] = list;
  });

  return Object.keys(mapped).map((key) => ({
    groupby: option,
    key,
    values: mapped[key],
  }));
};
