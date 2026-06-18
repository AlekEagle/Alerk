#!/usr/bin/env node

const args = process.argv.slice(2),
  INPUT_MAPPINGS = args[0],
  INPUT_MAPPINGS_DIR = args[1],
  OUTPUT_MAPPINGS = args[2];

if (!INPUT_MAPPINGS || !INPUT_MAPPINGS_DIR || !OUTPUT_MAPPINGS) {
  console.error(
    'Usage: node unmap.js <input_mappings.json> <input_mappings_dir> <output_mappings_dir>\n\nExample: node unmap.js mappings.json objects/ output/',
  );
  process.exit(1);
}

const fs = require('fs'),
  path = require('path');

// Test if the input mappings file exists
if (!fs.existsSync(INPUT_MAPPINGS)) {
  console.error(`Input mappings file "${INPUT_MAPPINGS}" does not exist.`);
  process.exit(1);
}

// Test if the input mappings directory exists
if (!fs.existsSync(INPUT_MAPPINGS_DIR)) {
  console.error(
    `Input mappings directory "${INPUT_MAPPINGS_DIR}" does not exist.`,
  );
  process.exit(1);
}

// Create the output mappings directory if it doesn't exist
if (!fs.existsSync(OUTPUT_MAPPINGS)) {
  fs.mkdirSync(OUTPUT_MAPPINGS, { recursive: true });
}

const mappings = JSON.parse(fs.readFileSync(INPUT_MAPPINGS, 'utf-8'));

// If the mappings file is empty, exit the script

if (Object.keys(mappings).length === 0) {
  console.error(`Input mappings file "${INPUT_MAPPINGS}" is empty.`);
  process.exit(1);
}

for (let filePath of Object.entries(mappings.objects)) {
  const PRETTY_PATH = filePath[0];
  const HASH = filePath[1].hash;
  const OBJECT_PATH = path.resolve(
    INPUT_MAPPINGS_DIR,
    HASH.substring(0, 2),
    HASH,
  );

  const COPY_PATH = path.resolve(OUTPUT_MAPPINGS, PRETTY_PATH);
  const DEST_DIR = path.dirname(COPY_PATH);

  if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

  console.log(OBJECT_PATH, '>', COPY_PATH);
  fs.copyFileSync(OBJECT_PATH, COPY_PATH);
}
