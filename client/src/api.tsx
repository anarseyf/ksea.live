export async function getEnv() {
    return getByAPI("env");
}

export async function getTweets() {
    return getByAPI("seattle911/tweets");
}

export async function getSeattle911() {
    return getByAPI("seattle911/static");
}

async function getByAPI(api = "") {
    const response = await fetch(`/api/${api}`, {
        headers: { Accept: "application-json" },
    });

    return response.json();
}
