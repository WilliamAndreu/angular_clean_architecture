const fs = require('fs');
const mustache = require('mustache');

function createDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function renderTemplateAndWriteFile(templatePath, outputPath, data) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const output = mustache.render(template, data);
  fs.writeFileSync(outputPath, output, 'utf8');
}

module.exports = { createDirectory, renderTemplateAndWriteFile };
