const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const { generateDataFiles } = require('./data');
const { generateDomainFiles } = require('./domain');
const { showSuccess } = require('./utils/consoleUtils');

function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function main() {
  const name = prompt('Domain name (e.g. products): ').trim().toLowerCase();

  if (!name) {
    console.error('\x1b[31mError: domain name cannot be empty\x1b[0m');
    process.exit(1);
  }

  const domainExists = fs.existsSync(`./src/data/datasource/${name}`);
  if (domainExists) {
    console.error(`\x1b[31mError: domain '${name}' already exists\x1b[0m`);
    process.exit(1);
  }

  const domain = { name, className: toPascalCase(name) };

  try {
    await generateDomainFiles(domain);
    await generateDataFiles(domain);
    showSuccess(domain);
  } catch (err) {
    console.error('\x1b[31mError generating domain:\x1b[0m', err);
    process.exit(1);
  }
}

main();
