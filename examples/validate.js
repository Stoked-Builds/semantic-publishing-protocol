#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const baseDir = process.argv[2] || './examples/stories';

function validateStory(folderPath) {
  const storyPath = path.join(folderPath, 'story.md');
  const semanticPath = path.join(folderPath, 'semantic.json');
  const topicsPath = path.join(folderPath, 'topics.json');

  if (!fs.existsSync(storyPath) || !fs.existsSync(semanticPath)) {
    console.error('Missing story.md or semantic.json');
    return;
  }

  const storyContent = fs.readFileSync(storyPath, 'utf8');
  const semantic = JSON.parse(fs.readFileSync(semanticPath, 'utf8'));
  const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

  // Digest check
  const hash = crypto.createHash('sha256').update(storyContent).digest('hex');
  if (semantic.digest && !semantic.digest.startsWith(hash.slice(0, 12))) {
    console.warn(`Digest mismatch in ${folderPath}`);
  }

  // Topic validation
  const validTopics = new Set(topics.map(t => t.id));
  for (const topic of semantic.topics) {
    if (!validTopics.has(topic.id)) {
      console.warn(`Invalid topic '${topic.id}' in ${folderPath}`);
    }
  }

  console.log(`✓ Validated ${path.basename(folderPath)}`);
}

function main() {
  const dirs = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const dirent of dirs) {
    if (dirent.isDirectory()) {
      validateStory(path.join(baseDir, dirent.name));
    }
  }
}

main();
