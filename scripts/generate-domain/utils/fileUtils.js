
const fs = require("fs");
const mustache = require("mustache");

function createDirectories(folderPath) {
    try {
        fs.mkdirSync(folderPath);
    } catch (err) {
        console.error("\x1b[31m Error creating directories:", err);
    }
}

function renderTemplateAndWriteFile(templatePath, outputPath, data) {
    try {
        const template = fs.readFileSync(templatePath, "utf8");
        const output = mustache.render(template, data);
        fs.writeFileSync(outputPath, output);
    } catch (err) {
        console.error("\x1b[31m Error creating file:", err);
    }
}

module.exports = {
    createDirectories,
    renderTemplateAndWriteFile
};
