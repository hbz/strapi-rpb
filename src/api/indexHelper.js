const fetch = require("node-fetch");

module.exports = {
    index: async (event) => {
        const secret = strapi.config.get('admin.auth.secret', '');
        for(const url of urls(event.result.inCollection)) {
            const response = await fetch(`${url}/${event.result.rpbId}?secret=${secret}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event.result),
            });
            console.log(`Indexing response for ${event.result.rpbId} to ${url}:`,
                response.status, response.statusText, await response.text());
        }
    }
}

const urls = (inCollection) => {
    const result = [];
    if(inCollection.includes("RPB")) {
        result.push("http://test.rpb.lobid.org"); // http://host.docker.internal:9000
    }
    if(inCollection.includes("BiblioVino")) {
        result.push("http://test.wein.lobid.org"); // http://host.docker.internal:9000
    }
    return result;
}
