const labelHelper = require('../../../labelHelper');
const backupHelper = require('../../../backupHelper');

module.exports = {
    beforeCreate(event) {
        const { data } = event.params;
        const { v4: uuidv4 } = require("uuid");
        data.rppdId = data.rppdId || uuidv4();
    },
    afterCreate(event) { backupHelper.saveToDisk(event); },
    afterUpdate(event) { backupHelper.saveToDisk(event); },
    async afterFindOne(event) {
        const lookupFields = ["gndSubjectCategory", "placeOfActivity", "professionOrOccupation", "publication", "relatedPerson", "source"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f))) {
            for (const component of labelHelper.componentsFor(field, result)) {
                component.label = await labelHelper.labelFor(component);
                component.label = component.label && labelHelper.trimmed(component.label);
            }
        }
    },
};
