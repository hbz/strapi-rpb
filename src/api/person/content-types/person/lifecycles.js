module.exports = {
    beforeCreate(event) {
        const { data } = event.params;
        const { v4: uuidv4 } = require("uuid");
        data.rppdId = data.rppdId || uuidv4();
    },
    // TODO: only look up if label is missing and we're saving, see https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks
    async afterFindOne(event) {

        const fetch = require("node-fetch");

        const lastSegment = (uri) => uri && uri.substring(uri.lastIndexOf("/") + 1);
        const uriFragment = (uri) => uri && uri.substring(uri.lastIndexOf("#") + 1);

        // TODO: move to config, reuse from plugin, see https://docs.strapi.io/dev-docs/configurations/guides/access-configuration-values
        const supportedIdPrefixes = (value) => ({
            "https://d-nb.info/gnd/": { url: `https://lobid.org/gnd/search?format=json&q=id:"${value}"`, test: (r) => r.member.length > 0, process: (r) => r.member[0].preferredName },
            "http://rppd.lobid.org/": { url: `https://rppd.lobid.org/search?format=json&q=rppdId:"${lastSegment(value)}"+OR+gndIdentifier:"${lastSegment(value)}"`, test: (r) => r.member.length > 0, process: (r) => r.member[0].preferredName },
            "http://lobid.org/resources": { url: `https://lobid.org/resources/${lastSegment(value)}.json`, test: (r) => r, process: (r) => r.title },
            "http://rpb.lobid.org": { url: `https://rpb.lobid.org/${lastSegment(value)}?format=json`, test: (r) => r.member.length > 0, process: (r) => r.member[0].title },
            "http://rpb.lobid.org/sw/": { url: `https://rpb-cms.lobid.org/api/rpb-authorities?pagination[limit]=1&filters[f00_][$eq]=${lastSegment(value)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.f3na },
            "http://purl.org/lobid/rpb": { url: `https://rpb-cms.lobid.org/api/rpb-notations?pagination[limit]=1&filters[uri][$endsWith]=${uriFragment(value)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel },
            "https://rpb.lobid.org/spatial": { url: `https://rpb-cms.lobid.org/api/rpb-spatials?pagination[limit]=1&filters[uri][$endsWith]=${uriFragment(value)}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel },
            "https://w3id.org/lobid/rpb-fachgebiete/": { url: `https://rpb-cms.lobid.org/api/fachgebiete?pagination[limit]=1&filters[uri][$eq]=${value}`, test: (r) => r.data.length > 0, process: (r) => r.data[0].attributes.prefLabel }
        });

        const { result } = event;

        const lookupFields = ["gndSubjectCategory", "placeOfActivity", "professionOrOccupation", "publication", "relatedPerson", "source"];

        for (const field of lookupFields.filter((f) => result.hasOwnProperty(f))) {
            for (const component of result[field]) {
                component.label = await labelFor(component.value);
            }
        }

        function labelFor(value) {
            const prefixMapping = supportedIdPrefixes(value);
            for (const key in prefixMapping) {
                if (value && value.startsWith(key)) {
                    return fetchLabel(prefixMapping[key]);
                }
            }
            return value;
        }

        async function fetchLabel(source) {
            const response = await fetch(source.url);
            if (!response.ok) {
                throw new Error(`Unexpected response; status ${response.status} for url ${source.url}`);
            }
            const json = await response.json();
            return source.test(json) ? source.process(json) : source.url;
        }

    },
};
