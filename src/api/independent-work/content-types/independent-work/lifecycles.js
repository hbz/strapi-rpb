module.exports = {
    async afterFindOne(event) {
        const helper = require('../../../labelHelper');
        const lookupFields = ["person", "corporateBody", "spatial", "subject", "subjectComponentList", "isPartOf"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f))) {
            for (const component of helper.componentsFor(field, result)) {
                component.label = await helper.labelFor(component.value);
                component.label = component.label && helper.trimmed(component.label);
            }
        }
    },
};
