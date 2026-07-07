#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const electronPackageDir = path.join(rootDir, 'node_modules', 'electron');
const electronDistPath = path.join(electronPackageDir, 'dist', 'electron');

if (fs.existsSync(electronDistPath)) {
  console.log('Electron runtime already available.');
  process.exit(0);
}

console.log('Preparing Electron runtime...');

const cachedZip = path.join(os.homedir(), '.cache', 'electron', 'electron-v31.7.7-linux-x64.zip');
if (!fs.existsSync(cachedZip)) {
  const result = spawnSync(process.execPath, ['node_modules/electron/install.js'], {
    cwd: rootDir,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const zipPath = fs.existsSync(cachedZip) ? cachedZip : path.join(electronPackageDir, 'dist', 'electron-v31.7.7-linux-x64.zip');
if (!fs.existsSync(zipPath)) {
  console.error('Electron archive was not found.');
  process.exit(1);
}

fs.mkdirSync(path.join(electronPackageDir, 'dist'), { recursive: true });
const extractResult = spawnSync('unzip', ['-o', zipPath, '-d', path.join(electronPackageDir, 'dist')], {
  cwd: rootDir,
  stdio: 'inherit'
});

if (extractResult.status !== 0) {
  process.exit(extractResult.status ?? 1);
}

fs.writeFileSync(path.join(electronPackageDir, 'path.txt'), 'electron');
fs.writeFileSync(path.join(electronPackageDir, 'dist', 'version'), 'v31.7.7');
console.log('Electron runtime prepared successfully.');
