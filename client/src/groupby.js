import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

export function byNothing(tweets) {
  return [
    {
      groupby: null,
      key: null,
      values: tweets,
    },
  ];
}

export function byType(tweets) {
  const options = ["fire", "medic", "mvi"];
  const defaultOption = "other";

  const mapper = ({ derived: { description } }) => {
    const desc = description.toLowerCase();
    const match = options.reduce((matchedOption, option) => {
      if (matchedOption) {
        return matchedOption;
      }
      return desc.includes(option) ? option : null;
    }, null);
    return match || defaultOption;
  };

  const grouped = by("type", tweets, mapper);

  const color = scaleOrdinal(schemeCategory10);
  color.domain([...options, defaultOption]);
  console.log("CHROMATIC:", options.map(color));

  return grouped.map((d) => ({ ...d, color: color(d.key) }));
}

export function byZip(tweets) {
  return by("zip", tweets, (t) => t.derived.zip);
}

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
