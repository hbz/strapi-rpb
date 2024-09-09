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
    beforeCreate(event) {
        const { data } = event.params;
        const { v4: uuidv4 } = require("uuid");
        data.rpbId = data.rpbId || uuidv4();
    },
    async afterFindOne(event) {
        await setLabels([event.result]);
    },
    async afterFindMany(event) {
        await setLabels(event.result);
    },
};
