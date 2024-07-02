
const labelHelper = require('../../../labelHelper');
const backupHelper = require('../../../backupHelper');

module.exports = {
    //TODO: enable after last import (import triggers this)
    //afterCreate(event) { backupHelper.saveToDisk(event); },
    afterUpdate(event) { backupHelper.saveToDisk(event); },
    async afterFindOne(event) {
        const lookupFields = ["person", "corporateBody", "spatial", "subject",
            "subjectComponentList.subjectComponent", "subjectComponentList", "isPartOf", "bibliographicCitation"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f.split(".")[0]))) {
            for (const component of labelHelper.componentsFor(field, result)) {
                component.label = await labelHelper.labelFor(component);
                component.label = component.label && labelHelper.trimmed(component.label);
            }
        }
    },
};
