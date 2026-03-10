const path = require('path');
const { createDirectory, renderTemplateAndWriteFile } = require('./utils/fileUtils');

const TEMPLATES = 'scripts/generate-domain/templates';

async function generateDomainFiles(domain) {
  const base = './src/domain';

  createDirectory(path.join(base, 'entities', domain.name));
  createDirectory(path.join(base, 'repositories', domain.name));
  createDirectory(path.join(base, 'usecases', domain.name));

  renderTemplateAndWriteFile(
    `${TEMPLATES}/domain/entities/entity.mustache`,
    `${base}/entities/${domain.name}/${domain.name}-entity.model.ts`,
    domain,
  );

  renderTemplateAndWriteFile(
    `${TEMPLATES}/domain/repositories/repository.mustache`,
    `${base}/repositories/${domain.name}/${domain.name}.repository.ts`,
    domain,
  );

  renderTemplateAndWriteFile(
    `${TEMPLATES}/domain/usecases/usecase.mustache`,
    `${base}/usecases/${domain.name}/get-${domain.name}.usecase.ts`,
    domain,
  );

  console.log('✅ \x1b[32mDomain layer created\x1b[0m');
}

module.exports = { generateDomainFiles };
