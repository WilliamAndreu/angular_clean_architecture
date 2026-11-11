import ts from 'typescript';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? files(target) : target.endsWith('.ts') ? [target] : [];
  });
}
const errors = [];
for (const file of files('src')) {
  const layer = file.split(path.sep)[1];
  if (!['domain', 'core', 'data', 'presentation', 'tests'].includes(layer)) continue;
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  function visit(node) {
    if (ts.isClassDeclaration(node) && node.name) {
      const isAbstract = node.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.AbstractKeyword,
      );
      if (
        (layer === 'data' ||
          (layer === 'core' && /^src[\\/]core[\\/](services|mappers|handlers)[\\/]/.test(file))) &&
        !isAbstract &&
        (!node.name.text.endsWith('Imp') || !file.endsWith('.imp.ts'))
      )
        errors.push(`${file}: implementations must use the Imp class suffix and .imp.ts filename`);
      if (
        file.includes(`${path.sep}source${path.sep}`) &&
        (!isAbstract || !file.endsWith('.source.ts'))
      )
        errors.push(`${file}: source contracts must be abstract classes in .source.ts files`);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log('Architecture naming conventions verified.');
