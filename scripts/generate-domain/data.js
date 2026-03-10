const path = require('path');
const { createDirectory, renderTemplateAndWriteFile } = require('./utils/fileUtils');

const TEMPLATES = 'scripts/generate-domain/templates';

async function generateDataFiles(domain) {
  const datasource = `./src/data/datasource/${domain.name}`;
  const repository = `./src/data/repositories/${domain.name}`;
  const di = `./src/data/di`;

  createDirectory(path.join(datasource, 'remote', 'dto'));
  createDirectory(path.join(datasource, 'local', 'dbo'));
  createDirectory(path.join(datasource, 'source'));
  createDirectory(path.join(repository, 'mappers'));
  createDirectory(di);

  // DTOs & DBOs
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/dto.mustache`,
    `${datasource}/remote/dto/${domain.name}.dto.ts`,
    domain,
  );
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/dbo.mustache`,
    `${datasource}/local/dbo/${domain.name}.dbo.ts`,
    domain,
  );

  // DataSources interfaces
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/remote-source.mustache`,
    `${datasource}/source/${domain.name}-remote-datasource.ts`,
    domain,
  );
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/local-source.mustache`,
    `${datasource}/source/${domain.name}-local-datasource.ts`,
    domain,
  );

  // DataSources implementations
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/remote-source-imp.mustache`,
    `${datasource}/remote/${domain.name}-remote-datasource-imp.ts`,
    domain,
  );
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/local-source-imp.mustache`,
    `${datasource}/local/${domain.name}-local-datasource-imp.ts`,
    domain,
  );

  // Mappers
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/dto-to-entity.mapper.mustache`,
    `${repository}/mappers/dto-to-entity.mapper.ts`,
    domain,
  );
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/dbo-to-entity.mapper.mustache`,
    `${repository}/mappers/dbo-to-entity.mapper.ts`,
    domain,
  );

  // Repository implementation
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/repository-impl.mustache`,
    `${repository}/${domain.name}-implementation.repository.ts`,
    domain,
  );

  // DI provider
  renderTemplateAndWriteFile(
    `${TEMPLATES}/datasource/di.mustache`,
    `${di}/${domain.name}.di.ts`,
    domain,
  );

  console.log('✅ \x1b[32mData layer created\x1b[0m');
}

module.exports = { generateDataFiles };
