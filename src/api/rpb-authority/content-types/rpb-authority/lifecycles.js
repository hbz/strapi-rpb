const setLabels = async (results) => {
    const helper = require('../../../labelHelper');
    const lookupFields = ["relatedEntity"];
    for (const result of results) {
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f))) {
            for (const component of helper.componentsFor(field, result)) {
                component.label = await helper.labelFor(component);
                component.label = component.label && helper.trimmed(component.label);
            }
        }
    }
}

module.exports = {
    async afterCreate(event) {
        const { result } = event;
        const type = "api::rpb-authority.rpb-authority";
        const entriesWithRpbId = await strapi.entityService.findMany(type, {
            filters: { rpbId: result.rpbId }
        });
        if (!result.rpbId || entriesWithRpbId.length > 1) { // new or cloned entries
            await strapi.entityService.update(type, result.id, {
                data: { rpbId: `n${result.id}`, createdAt:new Date().toISOString() }
            });
        }
    },
    async afterFindOne(event) {
        await setLabels([event.result]);
    },
    async afterFindMany(event) {
        await setLabels(event.result);
    },
};
