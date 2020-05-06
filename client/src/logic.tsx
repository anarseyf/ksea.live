export async function getData() {
  const response = await fetch("/api/data", {
    headers: { Accept: "application-json" },
  });

  return response.json();
}
