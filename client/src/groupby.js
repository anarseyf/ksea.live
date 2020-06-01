import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

export const GroupByOptions = {
  Nothing: undefined,
  IncidentType: "type",
  ZipCode: "zip",
  TimeInterval: "time",
};

export const DefaultInterval = 12 * 3600 * 1000;

const IncidentTypes = {
  Known: { Fire: "fire", Medic: "medic", Aid: "aid" },
  Default: "other",
};

const RequiredKeys = {
  [GroupByOptions.IncidentType]: [
    IncidentTypes.Known.Fire,
    IncidentTypes.Known.Medic,
    IncidentTypes.Known.Aid,
    IncidentTypes.Default,
  ],
};

export const Mappers = {
  [GroupByOptions.IncidentType]: ({ derived: { description } }) => {
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
  [GroupByOptions.ZipCode]: (t) => t.derived.zip,
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
  if (option === GroupByOptions.Nothing) {
    return byNothing(tweets);
  }
  if (option === GroupByOptions.IncidentType) {
    return byIncidentType(tweets);
  }
  if (option === GroupByOptions.ZipCode) {
    return byZip(tweets);
  }
  if (option === GroupByOptions.TimeInterval) {
    return byTimeInterval(tweets);
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
  const grouped = by(GroupByOptions.IncidentType, tweets, RequiredKeys[option]);

  const color = scaleOrdinal(schemeCategory10);
  const { Fire, Medic, Aid } = IncidentTypes.Known;
  color.domain([Medic, IncidentTypes.Default, Aid, Fire]); // https://github.com/d3/d3-scale-chromatic#schemeCategory10

  return grouped.map((d) => ({ ...d, color: color(d.key) }));
};

const byZip = (tweets) => {
  return by(GroupByOptions.ZipCode, tweets);
};

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
