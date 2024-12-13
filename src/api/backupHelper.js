module.exports = {
    saveToDisk: (event) => {
        writeData(event, `backup/${event.model.collectionName}.ndjson`);
    },
    saveDeletionToDisk: (event) => {
        writeData(event, `backup/deleted_${event.model.collectionName}.ndjson`);
    }
}

function writeData(event, filename) {
    const content = JSON.stringify({ data: event.result });
    require("fs").appendFile(filename, content + "\n", function (error) {
        error && console.log(error + ` (while saving to: ${filename})`);
    });
}
