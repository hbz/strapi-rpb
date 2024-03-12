module.exports = {
    beforeCreate(event) {
        const { data } = event.params;
        const { v4: uuidv4 } = require("uuid");
        data.rppdId = data.rppdId || uuidv4();
    },
};
