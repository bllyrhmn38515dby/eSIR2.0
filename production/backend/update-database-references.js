const fs = require('fs');
const path = require('path');

// List of core files that need to be updated
const coreFiles = [
  'backend/index.js',
  'backend/config/db.js',
  'backend/config.env',
  'backend/env.example',
  'backend/database.sql',
  'backend/restore-missing-tables.js',
  'backend/test-login-only.js',
  'backend/test-refresh-token.js',
  'backend/create-admin-user.js',
  'backend/check-esirv2-db.js',
  'backend/check-esirv2-user-password.js',
  'backend/clean-and-setup.js',
  'backend/setup-database.js',
  'backend/create-all-tables.js',
  'backend/check-tables.js',
  'backend/basic-users.js',
  'backend/minimal-users.js',
  'backend/minimal-db-setup.js',
  'backend/final-fix-db.js',
  'backend/clean-and-recreate.js',
  'backend/create-users-manual.js',
  'backend/fix-users-table.js',
  'backend/reset-database.js',
  'backend/setup-database-complete.js'
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace database references
    const replacements = [
      { from: /esirv2/g, to: 'prodsysesirv02' },
      { from: /'esirv2'/g, to: "'prodsysesirv02'" },
      { from: /"esirv2"/g, to: '"prodsysesirv02"' },
      { from: /esir_db/g, to: 'prodsysesirv02' },
      { from: /'esir_db'/g, to: "'prodsysesirv02'" },
      { from: /"esir_db"/g, to: '"prodsysesirv02"' },
      { from: /esir_db_new/g, to: 'prodsysesirv02' },
      { from: /'esir_db_new'/g, to: "'prodsysesirv02'" },
      { from: /"esir_db_new"/g, to: '"prodsysesirv02"' }
    ];

    replacements.forEach(replacement => {
      if (replacement.from.test(content)) {
        content = content.replace(replacement.from, replacement.to);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Updating database references from esirv2 to prodsysesirv02...\n');
  
  let updatedCount = 0;
  let totalCount = 0;

  coreFiles.forEach(filePath => {
    totalCount++;
    if (updateFile(filePath)) {
      updatedCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total files checked: ${totalCount}`);
  console.log(`   Files updated: ${updatedCount}`);
  console.log(`   Files unchanged: ${totalCount - updatedCount}`);

  if (updatedCount > 0) {
    console.log('\n✅ Database references updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Test database connection: node check-prodsysesirv02-db.js');
    console.log('   2. Start backend server: npm start');
    console.log('   3. Test login: node test-login-only.js');
  } else {
    console.log('\n✅ All files already using prodsysesirv02!');
  }
}

main();
