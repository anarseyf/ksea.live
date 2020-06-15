export async function getEnv() {
  return getByAPI("env");
}

export async function getMostRecentId() {
  const result = await fetch(`/api/dispatch/mostRecentId`, {
    headers: { Accept: "text/plain" },
  });
  return await result.text();
}

export async function getAnnotations() {
  return getByAPI(`dispatch/history/annotations`);
}

export async function getHistoryForArea(area) {
  return getByAPI(`dispatch/history/${area}`);
}

export async function getTweetsForArea(
  area,
  queryParams = { activeOrMajor: false, minimize: false }
) {
  return getByAPI(`dispatch/tweets/${area}`, queryParams);
}

export async function getTweetsByArea(queryParams = { activeOrMajor: false }) {
  return getByAPI(`dispatch/tweets/byArea`, queryParams);
}

export async function getTweetsByType(area = "seattle") {
  return getByAPI(`dispatch/tweets/byType/${area}`, { minimize: false });
}

export async function getTweetsMajor24() {
  return getByAPI("dispatch/tweets/major24", { minimize: false });
}

export async function getTweetsActive24() {
  return getByAPI("dispatch/tweets/active24", { minimize: false });
}

export async function getTweetsStatic() {
  return getByAPI("dispatch/static");
}

export async function getTweetsSeattleGov() {
  return getByAPI("dispatch/seattle-gov");
}

const queryString = (query = {}) => {
  const list = Object.keys(query).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
  );
  return `?${list.join("&")}`;
};

async function getByAPI(api = "", queryParams = {}) {
  const allQueryParams = {
    minimize: true,
    ...queryParams,
  };
  const query = queryString(allQueryParams);
  const response = await fetch(`/api/${api}${query}`, {
    headers: { Accept: "application-json" },
  });

  return response.json();
}
