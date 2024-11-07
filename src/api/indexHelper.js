const fetch = require("node-fetch");

module.exports = {
    index: async (event) => {
        const secret = strapi.config.get('admin.auth.secret', '');
        const url = `http://host.docker.internal:9000/${event.result.rpbId}?secret=${secret}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event.result),
        });
        console.log(`Indexing response for ${event.result.rpbId}:`,
            response.status, response.statusText, await response.text());
    }
}
