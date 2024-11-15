const fetch = require("node-fetch");

module.exports = {
    index: async (event) => {
        const secret = strapi.config.get('admin.auth.secret', '');
        const url = `http://test.rpb.lobid.org/${event.result.rpbId}?secret=${secret}`; // http://host.docker.internal:9000
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event.result),
        });
        console.log(`Indexing response for ${event.result.rpbId} to ${url}:`,
            response.status, response.statusText, await response.text());
    }
}
