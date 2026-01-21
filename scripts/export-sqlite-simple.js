const { execSync } = require('child_process');
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
  // Use sqlite3 command line tool to dump data as JSON
  const tables = ['SiteConfig', 'Program', 'Partner', 'PastEvent'];
  const data = {};

  tables.forEach(table => {
    try {
      const cmd = `sqlite3 "${dbPath}" "SELECT json_group_array(json_object(${getColumns(table)})) FROM ${table}"`;
      const result = execSync(cmd, { encoding: 'utf-8' }).trim();
      const parsed = JSON.parse(result || '[]');

      if (table === 'SiteConfig') {
        data.siteConfig = parsed[0] || null;
      } else {
        data[table.charAt(0).toLowerCase() + table.slice(1) + 's'] = parsed;
      }

      console.log(`✅ Exported ${table}: ${parsed.length} records`);
    } catch (error) {
      console.log(`⚠️  ${table}: No data or error - ${error.message}`);
      if (table === 'SiteConfig') {
        data.siteConfig = null;
      } else {
        data[table.charAt(0).toLowerCase() + table.slice(1) + 's'] = [];
      }
    }
  });

  const jsonData = JSON.stringify(data, null, 2);
  const exportPath = path.join(process.cwd(), 'data-export.json');
  fs.writeFileSync(exportPath, jsonData);

  console.log('');
  console.log('✅ Data exported to data-export.json');
  console.log(`   Path: ${exportPath}`);
  console.log('');
  console.log('🎉 Export completed successfully!');

} catch (error) {
  console.error('');
  console.error('❌ Export failed:');
  console.error('   Error:', error.message);
  console.error('');
  throw error;
}

function getColumns(table) {
  const dbPathEscaped = dbPath.replace(/'/g, "''");
  const cmd = `sqlite3 "${dbPath}" "PRAGMA table_info(${table})"`;
  const result = execSync(cmd, { encoding: 'utf-8' });
  const lines = result.trim().split('\n');

  return lines.map(line => {
    const parts = line.split('|');
    const colName = parts[1];
    return `'${colName}', ${colName}`;
  }).join(', ');
}
