export function getData() {
  return fetch("/api/data", { accept: "application/json" })
    .then((response) => response.json())
    .catch((error) => console.log("Error:", error));
}
