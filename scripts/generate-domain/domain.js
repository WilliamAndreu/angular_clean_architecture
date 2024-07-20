const { createDirectories, renderTemplateAndWriteFile } = require("./utils/fileUtils");
const path = require("path");

function createRequiredDirectories(domainPath, domain) {
    const directories = [
        path.join(domainPath, "entities", domain.name),
        path.join(domainPath, "repositories", domain.name),  
        path.join(domainPath, "usecases", domain.name),
    ];

    return Promise.all(directories.map(directory => {
        return new Promise((resolve, reject) => {
            try {
                createDirectories(directory);
                console.log("\x1b[37m Directory created successfully:", directory);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }));
}



  function generateRepositoryFile(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/domain/repositories/repositories.mustache", outputFile, domain);
            
            console.log("\x1b[37m Repositories file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }

  function generateEntityFile(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/domain/entities/entity.mustache", outputFile, domain);
            
            console.log("\x1b[37m Entity file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }

  function generateUseCaseFile(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/domain/usecases/usecase.mustache", outputFile, domain);
            
            console.log("\x1b[37m UseCase file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }








async function generateDomainFiles(domain) {
    const domainPath = `./src/domain/`;
  try {
      await createRequiredDirectories(domainPath, domain);
      await generateEntityFile(`${domainPath}/entities/${domain.name}/${domain.name}-entity.ts`, domain);
      await generateRepositoryFile(`${domainPath}/repositories/${domain.name}/${domain.name}.repository.ts`, domain);
      await generateUseCaseFile(`${domainPath}/usecases/${domain.name}/get-${domain.name}.usecase.ts`, domain);
      console.log( "✅ \x1b[32m Domain layer created\x1b[0m" );

  } catch (err) {
      console.error("\x1b[31m Error:", err);
  }
}


module.exports = {
    generateDomainFiles
};
