module.exports = {
    beforeCreate(event) {
        const { data } = event.params;
        const { v4: uuidv4 } = require("uuid");
        data.rppdId = data.rppdId || uuidv4();
    },
    async afterFindOne(event) {
        const helper = require('../../../labelHelper');
        const lookupFields = ["gndSubjectCategory", "placeOfActivity", "professionOrOccupation", "publication", "relatedPerson", "source"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f))) {
            for (const component of result[field]) {
                component.label = await helper.labelFor(component.value);
                component.label = component.label && helper.trimmed(component.label);
            }
        }
    },
};
