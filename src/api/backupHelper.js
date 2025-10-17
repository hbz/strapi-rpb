const indexHelper = require('./indexHelper');

module.exports = {
    saveToDisk: (event) => {
        writeData("data", event);
    },
    saveDeletionToDisk: (event) => {
        writeData("delete", event);
    },
    handleUpdate: async (event, type, populateAll) => {
        if (event.result.updatedBy) {
            // Update via UI, complete data. Save and index:
            writeData("data", event);
            indexHelper.index(event);
        } else { 
            // Update via API, partial data. Get full result and save, don't index:
            event.result = await strapi.entityService.findOne(type, event.result.id, { populate: populateAll });
            writeData("data", event);
        }
    }
}

function writeData(key, event) {
    const filename = `backup/${event.model.collectionName}.ndjson`;
    const content = JSON.stringify({ [key]: event.result });
    require("fs").appendFile(filename, content + "\n", function (error) {
        error && console.log(error + ` (while saving to: ${filename})`);
    });
}
