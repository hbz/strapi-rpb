const labelHelper = require('../../../labelHelper');
const backupHelper = require('../../../backupHelper');
const indexHelper = require('../../../indexHelper');
const type = "api::article.article";
const populateAll = {
    person: true,
    corporateBody: true,
    parallelTitle: true,
    alternativeTitle: true,
    isPartOf: true,
    note: true,
    spatial: true,
    subject: true,
    subjectComponentList: {
        populate: {
            subjectComponent: true,
        }
    },
    bibliographicCitation: true,
    url: true,
    item: true,
    updatedBy: true,
    createdBy: true
};
const updateLabels = async (result, lookupFields) => {
    for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f.split(".")[0]))) {
        for (const component of labelHelper.componentsFor(field, result)) {
            component.label = await labelHelper.labelFor(component);
            component.label = component.label && labelHelper.trimmed(component.label);
        }
    }
}
module.exports = {
    async afterCreate(event) {
        const { result } = event;
        const entriesWithRpbId = await strapi.entityService.findMany(type, {
            filters: { rpbId: result.rpbId },
            populate: populateAll
        });
        if (!result.rpbId || entriesWithRpbId.length > 1) { // new or cloned entries
            await strapi.entityService.update(type, result.id, {
                data: { rpbId: `a${result.id}`, created: null, createdAt:new Date().toISOString() },
                populate: populateAll
            });
        } else {
            backupHelper.saveToDisk({ model: { collectionName: event.model.collectionName }, result: entriesWithRpbId[0] });
        }
    },
    async afterUpdate(event) {
        backupHelper.saveToDisk(event);
        indexHelper.index(event);
    },
    async afterFindOne(event) {
        const lookupFields = ["person", "corporateBody", "spatial", "subject",
            "subjectComponentList.subjectComponent", "subjectComponentList", "isPartOf", "bibliographicCitation"];
        const { result } = event;
        await updateLabels(result, lookupFields);
    },
    async afterFindMany(event) {
        for (result of event.result) {
            await updateLabels(result, ["person", "corporateBody", "bibliographicCitation"]);
        }
    },
    async beforeDeleteMany(event) {
        for (id of event.params.where.$and[0].id.$in) {
            await strapi.entityService.delete(type, id);
        }
    },
    async afterDelete(event) {
        const deletionEvent = {
            model:{
                collectionName: event.model.collectionName
            },
            result: {
                rpbId: event.result.rpbId,
                inCollection: event.result.inCollection
            }
        };
        backupHelper.saveDeletionToDisk(deletionEvent);
        indexHelper.delete(deletionEvent);
    },
};
