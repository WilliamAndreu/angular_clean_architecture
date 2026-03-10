function showSuccess(domain) {
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';

  console.log(`\n${bold}✅ Domain '${domain.name}' generated successfully!${reset}`);
  console.log(`\n${bold}Add the DI provider to your feature routes:${reset}`);
  console.log(`
${yellow}import { provide${domain.className}DI } from '@di/${domain.name}.di';

// In your routes file:
providers: [provide${domain.className}DI()]${reset}
  `);
}

module.exports = { showSuccess };
