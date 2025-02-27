const config = require("../settings.js");
const fs = require("node:fs");
const sampah = "../tmp";

const storage = { 
    save: (filename, data) => { 
        const filePath = `${sampah}/${filename}`; 
        fs.writeFileSync(filePath, data); 
        return `file saved at ${filePath}`; 
    },

    delete: (filename) => {
        const filePath = `${sampah}/${filename}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return `file ${filename} deleted`;
        }
        return `file ${filename} not found`;
    },

    update: (filename, newData) => {
        const filePath = `${sampah}/${filename}`;
        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, newData);
            return `file ${filename} updated`;
        }
        return `file ${filename} not found`;
    }

};

module.exports = storage;