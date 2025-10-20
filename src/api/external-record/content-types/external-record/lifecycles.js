const labelHelper = require('../../../labelHelper');
const backupHelper = require('../../../backupHelper');
const indexHelper = require('../../../indexHelper');
const type = "api::external-record.external-record";
const populateAll = {
    note: true,
    spatial: true,
    subject: true,
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
                data: { rpbId: `f${result.id}`, createdAt:new Date().toISOString() },
                populate: populateAll
            });
        } else {
            backupHelper.saveToDisk({ model: { collectionName: event.model.collectionName }, result: entriesWithRpbId[0] });
        }
    },
    async afterUpdate(event) {
        backupHelper.handleUpdate(event, type, populateAll);
    },
    async afterFindOne(event) {
        const lookupFields = ["spatial", "subject", "subjectComponentList.subjectComponent", "subjectComponentList"];
        const { result } = event;
        for (const field of lookupFields.filter((f) => result && result.hasOwnProperty(f.split(".")[0]))) {
            for (const component of labelHelper.componentsFor(field, result)) {
                component.label = await labelHelper.labelFor(component);
                component.label = component.label && labelHelper.trimmed(component.label);
            }
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
