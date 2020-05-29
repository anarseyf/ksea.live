import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

export const GroupByOptions = {
  Nothing: null,
  IncidentType: "type",
  ZipCode: "zip",
};

const IncidentTypes = {
  Known: { Fire: "fire", Medic: "medic", MVI: "mvi" },
  Default: "other",
};

export const Mappers = {
  [GroupByOptions.IncidentType]: ({ derived: { description } }) => {
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
  [GroupByOptions.ZipCode]: (t) => t.derived.zip,
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
  const grouped = by("type", tweets, Mappers[GroupByOptions.IncidentType]);

  const color = scaleOrdinal(schemeCategory10);
  const { Fire, Medic, MVI } = IncidentTypes.Known;
  color.domain([Medic, IncidentTypes.Default, MVI, Fire]); // https://github.com/d3/d3-scale-chromatic#schemeCategory10

  return grouped.map((d) => ({ ...d, color: color(d.key) }));
};

const byZip = (tweets) => {
  return by("zip", tweets, Mappers[GroupByOptions.ZipCode]);
};

const by = (groupby, tweets, mapper) => {
  const mapped = {};
  tweets.forEach((t) => {
    const key = mapper(t);
    const list = mapped[key] || [];
    list.push(t);
    mapped[key] = list;
  });

  return Object.keys(mapped).map((key) => ({
    groupby,
    key,
    values: mapped[key],
  }));
};
