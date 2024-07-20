const { createDirectories, renderTemplateAndWriteFile } = require("./utils/fileUtils");
const path = require("path");

function createRequiredDirectories(datasourcePath, repositoryPath) {
    const directories = [
        path.join(datasourcePath),
        path.join(datasourcePath, "local"),
        path.join(datasourcePath, "remote"),
        path.join(datasourcePath, "source"),
        path.join(datasourcePath, "local", "dbo"),
        path.join(datasourcePath, "remote", "dto"),
        path.join(repositoryPath),
        path.join(repositoryPath, "mappers")
        
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




function generateDBOFile(outputFile, domain) {
  return new Promise((resolve, reject) => {
      try {
          renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/dbo.mustache", outputFile, domain);
          console.log("\x1b[37m DBO file generated successfully:", outputFile);
          resolve();
      } catch (err) {
          reject(err);
      }
  });
}

function generateDBOImpFile(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/local-source-imp.mustache", outputFile, domain);
            console.log("\x1b[37m DBO Imp file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }



function generateDTOFile(outputFile, domain) {
  return new Promise((resolve, reject) => {
      try {
          renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/dto.mustache", outputFile, domain);
          console.log("\x1b[37m DTO file generated successfully:", outputFile);
          resolve();
      } catch (err) {
          reject(err);
      }
  });
}

function generateDTOImpFile(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/remote-source-imp.mustache", outputFile, domain);
            console.log("\x1b[37m DTO Imp file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }

function generateSourceFiles(folderPath, domain) {
  const localSourceFile = `${folderPath}/source/${domain.name}-local-datasource.ts`;
  const remoteSourceFile = `${folderPath}/source/${domain.name}-remote-datasource.ts`;

  return Promise.all([
      new Promise((resolve, reject) => {
          try {
              renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/local-source.mustache", localSourceFile, domain);
              console.log("\x1b[37m Local source file generated successfully:", localSourceFile);
              resolve();
          } catch (err) {
              reject(err);
          }
      }),
      new Promise((resolve, reject) => {
          try {
              renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/remote-source.mustache", remoteSourceFile, domain);
              console.log("\x1b[37m Remote source file generated successfully:", remoteSourceFile);
              resolve();
          } catch (err) {
              reject(err);
          }
      })
  ]);
}

function generateDBOMapper(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/dbo.mapper.mustache", outputFile, domain);
            console.log("\x1b[37m DBO mapper file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }
  function generateDTOMapper(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/dto.mapper.mustache", outputFile, domain);
            console.log("\x1b[37m DTO mapper file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }

  function generateRepositoryImpl(outputFile, domain) {
    return new Promise((resolve, reject) => {
        try {
            renderTemplateAndWriteFile("scripts/generate-domain/templates/datasource/repository-impl.mustache", outputFile, domain);
            console.log("\x1b[37m Repository Impl file generated successfully:", outputFile);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
  }

async function generateDataFiles(domain) {
    const datasourcePath = `./src/data/datasource/${domain.name}`;
    const repositoryPath = `./src/data/repositories/${domain.name}`;
  try {
      await createRequiredDirectories(datasourcePath, repositoryPath);
      await generateDBOFile(`${datasourcePath}/local/dbo/${domain.name}.dbo.ts`, domain);
      await generateDBOImpFile(`${datasourcePath}/local/${domain.name}-local-datasource-imp.ts`, domain);
      await generateDTOFile(`${datasourcePath}/remote/dto/${domain.name}.dto.ts`, domain);
      await generateDTOImpFile(`${datasourcePath}/remote/${domain.name}-remote-datasource-imp.ts`, domain);
      await generateSourceFiles(datasourcePath, domain);
      await generateDBOMapper(`${repositoryPath}/mappers/${domain.name}-dbo-repository.mapper.ts`, domain);
      await generateDTOMapper(`${repositoryPath}/mappers/${domain.name}-dto-repository.mapper.ts`, domain);
      await generateRepositoryImpl(`${repositoryPath}/${domain.name}-implementation.repository.ts`, domain);
      console.log( "✅ \x1b[32m Data layer created" );

  } catch (err) {
      console.error("Error:", err);
  }
}


module.exports = {
    generateDataFiles
};
