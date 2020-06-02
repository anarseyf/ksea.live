import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

export const GroupByOptions = {
  Nothing: undefined,
  IncidentType: "type",
  ZipCode: "zip",
  TimeInterval: "time",
};

export const DefaultInterval = 12 * 3600 * 1000;

export const Mappers = {
  [GroupByOptions.TimeInterval]: ({ derived: { timestamp } }) => {
    const duration = DefaultInterval;
    const end = 1590448143000; // TODO lol
    const start = end - duration;

    const intervals = [
      [start, end],
      [start - duration, start],
    ];
    return intervals.reduce((matchedOption, [from, to]) => {
      if (matchedOption) {
        return matchedOption;
      }
      return timestamp >= from && timestamp < to ? from : undefined;
    }, undefined);
  },
};

export function groupBy(option = GroupByOptions.Nothing, tweets) {
  if (option === GroupByOptions.TimeInterval) {
    return byTimeInterval(tweets);
  }
  throw `Unrecognized groupby option: ${option}`;
}

const byTimeInterval = (tweets) => {
  return by(GroupByOptions.TimeInterval, tweets, []);
};

const by = (option, tweets, requiredKeys = []) => {
  const mapper = Mappers[option];
  const mapped = {};

  requiredKeys.forEach((key) => {
    mapped[key] = [];
  });

  tweets.forEach((t) => {
    const key = mapper(t);
    if (key === undefined) {
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

export const computeOffsets = ({ groups, ...rest }) => {
  // console.log("WITH OFFSETS/dataset", dataset);
  let offsetFn = (start) => 0;
  if (groups.length && groups[0].groupby === GroupByOptions.TimeInterval) {
    const start0 = +groups[0].key;
    offsetFn = (start) => start0 - start;
  }

  const offsetGroups = groups.map(({ key, ...group }) => ({
    key,
    ...group,
    offset: offsetFn(+key),
  }));

  const valueMapper = ({ derived: { timestamp }, ...restValue }, offset) => ({
    ...restValue,
    derived: {
      timestamp,
      offset,
    },
  });

  return {
    ...rest,
    groups: offsetGroups.map(({ offset, values, ...restGroup }) => ({
      offset,
      ...restGroup,
      values: values.map((v) => valueMapper(v, offset)),
    })),
  };
};
