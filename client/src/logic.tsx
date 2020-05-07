export async function getEnv() {
  return getByAPI("env");
}

async function getByAPI(api = "") {
  const response = await fetch(`/api/${api}`, {
    headers: { Accept: "application-json" },
  });

  return response.json();
}
