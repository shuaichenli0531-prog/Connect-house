const sqlite3 = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

console.log('');
console.log('📦 Exporting data from local SQLite database...');
console.log(`   Database: ${dbPath}`);
console.log('');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Database file not found!');
  console.error(`   Path: ${dbPath}`);
  process.exit(1);
}

try {
  const db = sqlite3(dbPath, { readonly: true });

  // Export all tables
  const data = {
    siteConfig: db.prepare('SELECT * FROM SiteConfig').get(),
    programs: db.prepare('SELECT * FROM Program').all(),
    partners: db.prepare('SELECT * FROM Partner').all(),
    pastEvents: db.prepare('SELECT * FROM PastEvent').all(),
  };

  db.close();

  const jsonData = JSON.stringify(data, null, 2);
  const exportPath = path.join(process.cwd(), 'data-export.json');
  fs.writeFileSync(exportPath, jsonData);

  console.log('✅ Data exported to data-export.json');
  console.log(`   Path: ${exportPath}`);
  console.log(`   - SiteConfig: ${data.siteConfig ? '1 record' : 'none'}`);
  console.log(`   - Programs: ${data.programs.length} records`);
  console.log(`   - Partners: ${data.partners.length} records`);
  console.log(`   - PastEvents: ${data.pastEvents.length} records`);
  console.log('');
  console.log('🎉 Export completed successfully!');

} catch (error) {
  console.error('');
  console.error('❌ Export failed:');
  console.error('   Error:', error.message);
  console.error('');
  throw error;
}
