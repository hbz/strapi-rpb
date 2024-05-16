module.exports = {
    async afterFindOne(event) {
        const helper = require('../../../labelHelper');
        const lookupFields = ["person", "spatial", "subject"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f))) {
            for (const component of result[field]) {
                component.label = await helper.labelFor(component.value);
                component.label = component.label && component.label.length > 250 ? component.label.substring(0, 249) + "..." : component.label;
            }
        }
    },
};
