module.exports = {
    async afterFindOne(event) {
        const helper = require('../../../labelHelper');
        const lookupFields = ["person", "corporateBody", "spatial", "subject",
            "subjectComponentList.subjectComponent", "subjectComponentList", "inSeries"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f.split(".")[0]))) {
            for (const component of helper.componentsFor(field, result)) {
                component.label = await helper.labelFor(component);
                component.label = component.label && helper.trimmed(component.label);
            }
        }
    },
};
