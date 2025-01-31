module.exports = {
    saveToDisk: (event) => {
        writeData("data", event);
    },
    saveDeletionToDisk: (event) => {
        writeData("delete", event);
    }
}

function writeData(key, event) {
    const filename = `backup/${event.model.collectionName}.ndjson`;
    const content = JSON.stringify({ [key]: event.result });
    require("fs").appendFile(filename, content + "\n", function (error) {
        error && console.log(error + ` (while saving to: ${filename})`);
    });
}
