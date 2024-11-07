const labelHelper = require('../../../labelHelper');
const backupHelper = require('../../../backupHelper');
const type = "api::independent-work.independent-work";
const populateAll = {
    volumeIn: true,
    person: true,
    corporateBody: true,
    parallelTitle: true,
    alternativeTitle: true,
    inSeries: true,
    item: true,
    spatial: true,
    subject: true,
    note: true,
    url: true,
    isbn: true,
    subjectComponentList: {
        populate: {
            subjectComponent: true,
        }
    },
    updatedBy: true,
    createdBy: true
};

module.exports = {
    async afterCreate(event) {
        const { result } = event;
        const entriesWithRpbId = await strapi.entityService.findMany(type, {
            filters: { rpbId: result.rpbId },
            populate: populateAll
        });
        if (!result.rpbId || entriesWithRpbId.length > 1) { // new or cloned entries
            await strapi.entityService.update(type, result.id, {
                data: { rpbId: `s${result.id}` },
                populate: populateAll
            });
        } else {
            backupHelper.saveToDisk({ model: { collectionName: event.model.collectionName }, result: entriesWithRpbId[0] });
        }
    },
    afterUpdate(event) { backupHelper.saveToDisk(event); },
    async afterFindOne(event) {
        const lookupFields = ["person", "corporateBody", "spatial", "subject",
            "subjectComponentList.subjectComponent", "subjectComponentList", "inSeries"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f.split(".")[0]))) {
            for (const component of labelHelper.componentsFor(field, result)) {
                component.label = await labelHelper.labelFor(component);
                component.label = component.label && labelHelper.trimmed(component.label);
            }
        }
    },
};
