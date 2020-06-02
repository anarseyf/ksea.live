export async function getEnv() {
  return getByAPI("env");
}

export async function getTweets() {
  return getByAPI("dispatch/tweets");
}

export async function getTweetsForArea(area: string) {
  return getByAPI(`dispatch/tweets/${area}`);
}

export async function getTweetsByType() {
  return getByAPI(`dispatch/tweets/byType`);
}

export async function getTweetsByArea() {
  return getByAPI(`dispatch/tweets/byArea`);
}

export async function getTweetsStatic() {
  return getByAPI("dispatch/static");
}

export async function getTweetsSeattleGov() {
  return getByAPI("dispatch/seattle-gov");
}

async function getByAPI(api = "") {
  const response = await fetch(`/api/${api}`, {
    headers: { Accept: "application-json" },
  });

  return response.json();
}
