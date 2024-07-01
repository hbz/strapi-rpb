module.exports = {
    saveToDisk: (event) => {
        const filename = `backup/${event.result.updatedAt}_${event.model.singularName}_${event.result.id}.json`;
        const content = JSON.stringify({ data: event.result });
        require("fs").writeFile(filename, content, function (error) {
            console.log(error ? error : "Saved to: " + filename);
        });
    }
}