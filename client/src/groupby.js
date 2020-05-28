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

  return by("type", tweets, mapper);
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
