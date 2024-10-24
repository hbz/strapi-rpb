module.exports = {
    saveToDisk: (event) => {
        const filename = `backup/${event.model.collectionName}.ndjson`;
        const content = JSON.stringify({ data: event.result });
        require("fs").appendFile(filename, content + "\n", function (error) {
            error && console.log(error + ` (while saving to: ${filename})`);
        });
    }
}