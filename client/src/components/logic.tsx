export async function getEnv() {
    return getByAPI("env");
}

export async function getSeattle911() {
    return getByAPI("seattle911");
}

async function getByAPI(api = "") {
    const response = await fetch(`/api/${api}`, {
        headers: { Accept: "application-json" },
    });

    return response.json();
}
