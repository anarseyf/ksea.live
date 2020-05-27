import { field } from "vega";
export function byNothing(tweets) {
    return [
        {
            groupby: null,
            key: null,
            values: tweets,
        },
    ];
}

export function byType(tweets) {}

export function byZip(tweets) {
    return by("zip", tweets);
}

const by = (field, tweets) => {
    const mapped = {};
    tweets.forEach((t) => {
        const key = t.derived[field];
        const list = mapped[key] || [];
        list.push(t);
        mapped[key] = list;
    });

    return Object.keys(mapped).map((key) => ({
        groupby: field,
        key,
        values: mapped[key],
    }));
};
