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

export async function getTweetsForArea(area) {
  return getByAPI(`dispatch/tweets/${area}`, { minimize: false });
}

export async function getTweetsByArea() {
  return getByAPI(`dispatch/tweets/byArea`);
}

export async function getTweetsByType(area = "seattle") {
  return getByAPI(`dispatch/tweets/byType/${area}`, { minimize: false });
}

export async function getTweetsMajor() {
  return getByAPI("dispatch/tweets/major", { minimize: false });
}

export async function getTweetsActive() {
  return getByAPI("dispatch/tweets/active", { minimize: false });
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

async function getByAPI(api = "", queryParams = { minimize: true }) {
  const query = queryString(queryParams);
  const response = await fetch(`/api/${api}${query}`, {
    headers: { Accept: "application-json" },
  });

  return response.json();
}
