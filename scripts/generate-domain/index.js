const prompt = require("prompt-sync")({ sigint: true });
const fs = require("fs");
const {generateDataFiles } = require("./data");
const {generateDomainFiles } = require("./domain");
const {showImportsDomainModule } = require("./utils/consoleUtils");




async function main() {
  const name = prompt("Please enter your domain name: ").trim().toLowerCase();
  const dataPath = `./src/data/datasource/${name}`;

  try {
      if (!fs.existsSync(dataPath) && !(!name || name.length === 0)) {
        await generateDataFiles({ name, className: name.charAt(0).toUpperCase() + name.slice(1) });
        await generateDomainFiles({ name, className: name.charAt(0).toUpperCase() + name.slice(1) });
        await  showImportsDomainModule({ name, className: name.charAt(0).toUpperCase() + name.slice(1) });
      } else {
        if(!name || name.length === 0) {
          console.log("\x1b[31m Invalid domain name");
        }else {
          if(fs.existsSync(dataPath)) {
          console.log("\x1b[31m Domain already exists:", name);
        }
        }    
      }
  } catch (err) {
      console.error("Error:", err);
  }
}

main();




