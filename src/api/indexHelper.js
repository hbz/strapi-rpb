const fetch = require("node-fetch");

module.exports = {
    index: async (event) => {
        const secret = strapi.config.get('admin.auth.secret', '');
        const url = `http://host.docker.internal:9000/${event.result.rpbId}?secret=${secret}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: event.result }),
        });
        if (!response.ok) {
            throw new Error(`Unexpected response; status ${response.status} for url ${url}`);
        }
        const json = await response.json();
        console.log(`Indexing response for ${event.result.rpbId}:`, JSON.stringify(json));
    }
}
