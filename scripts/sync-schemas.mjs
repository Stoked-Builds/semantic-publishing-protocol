#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const [, , version] = process.argv;

if (!version) {
  console.error('Usage: node scripts/sync-schemas.mjs <version>');
  process.exitCode = 1;
  process.exit();
}

if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(`Invalid version "${version}". Expected SemVer (e.g. 0.4.0 or 1.0.0-rc.1).`);
  process.exitCode = 1;
  process.exit();
}

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const schemasDir = path.join(repoRoot, 'schemas');
const releasesDir = path.join(schemasDir, 'releases');
const targetDir = path.join(releasesDir, version);

const skipDirs = new Set(['releases']);

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function collectSchemas(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const absPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(relPath.split(path.sep)[0])) continue;
      files.push(...await collectSchemas(absPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push({ absPath, relPath });
    }
  }

  return files;
}

async function checksum(buffer) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

async function main() {
  await ensureDir(releasesDir);

  try {
    const stat = await fs.stat(targetDir);
    if (stat.isDirectory()) {
      console.error(`Release directory ${targetDir} already exists. Refusing to overwrite.`);
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const schemas = await collectSchemas(schemasDir);

  if (schemas.length === 0) {
    console.error('No schemas found to release.');
    process.exitCode = 1;
    return;
  }

  const manifest = [];

  for (const { absPath, relPath } of schemas) {
    const destPath = path.join(targetDir, relPath);
    await ensureDir(path.dirname(destPath));
    const contents = await fs.readFile(absPath);
    await fs.writeFile(destPath, contents);
    const hash = await checksum(contents);
    manifest.push({
      path: relPath.replace(/\\/g, '/'),
      sha256: hash
    });
  }

  manifest.sort((a, b) => a.path.localeCompare(b.path));

  const manifestPayload = {
    version,
    generatedAt: new Date().toISOString(),
    source: 'schemas',
    files: manifest
  };

  await fs.writeFile(
    path.join(targetDir, 'manifest.json'),
    JSON.stringify(manifestPayload, null, 2)
  );

  const checksumLines = manifest
    .map(({ sha256, path: rel }) => `${sha256}  ${rel}`)
    .join('\n');

  await fs.writeFile(
    path.join(targetDir, 'checksums.txt'),
    checksumLines + '\n'
  );

  const packageJson = {
    name: '@spp/schemas',
    version,
    description: 'Semantic Publishing Protocol canonical JSON Schemas',
    license: 'Apache-2.0',
    type: 'module',
    exports: {
      '.': './manifest.json'
    },
    files: ['**/*.json', 'checksums.txt']
  };

  await fs.writeFile(
    path.join(targetDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log(`Created schema release directory at ${path.relative(repoRoot, targetDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
