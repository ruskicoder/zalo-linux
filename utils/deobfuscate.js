#!/usr/bin/env node
/**
 * Deobfuscation script for Zalo Linux application
 * This script beautifies minified JavaScript files and adds basic comments
 */

const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js;

// Configuration
const config = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: 2,
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: 'normal',
  brace_style: 'collapse',
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: true,
  wrap_line_length: 0,
  indent_inner_html: false,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false
};

/**
 * Beautify a JavaScript file
 */
function beautifyFile(inputPath, outputPath) {
  console.log(`Processing: ${inputPath}`);
  
  try {
    // Read the minified file
    const minified = fs.readFileSync(inputPath, 'utf8');
    
    // Beautify the code
    const beautified = beautify(minified, config);
    
    // Add header comment
    const header = `/**
 * Deobfuscated from: ${path.basename(inputPath)}
 * Generated: ${new Date().toISOString()}
 * 
 * This file has been automatically beautified from minified source.
 * Variable names are preserved from the original obfuscated code.
 * Manual analysis and renaming may be needed for better readability.
 */

`;
    
    const output = header + beautified;
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the beautified file
    fs.writeFileSync(outputPath, output, 'utf8');
    
    console.log(`✓ Saved to: ${outputPath}`);
    console.log(`  Original size: ${(minified.length / 1024).toFixed(2)} KB`);
    console.log(`  Beautified size: ${(output.length / 1024).toFixed(2)} KB`);
    
    return true;
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    return false;
  }
}

/**
 * Process a directory recursively
 */
function processDirectory(inputDir, outputDir, filePattern = /\.js$/) {
  console.log(`\nProcessing directory: ${inputDir}`);
  
  const files = fs.readdirSync(inputDir);
  let processed = 0;
  let failed = 0;
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const stat = fs.statSync(inputPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subOutputDir = path.join(outputDir, file);
      const result = processDirectory(inputPath, subOutputDir, filePattern);
      processed += result.processed;
      failed += result.failed;
    } else if (stat.isFile() && filePattern.test(file)) {
      // Skip already beautified files
      if (file.includes('.beautified.') || file.includes('.patched.')) {
        console.log(`Skipping already processed: ${file}`);
        continue;
      }
      
      const outputPath = path.join(outputDir, file);
      const success = beautifyFile(inputPath, outputPath);
      
      if (success) {
        processed++;
      } else {
        failed++;
      }
    }
  }
  
  return { processed, failed };
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node deobfuscate.js <input-file-or-dir> <output-file-or-dir>');
    console.log('');
    console.log('Examples:');
    console.log('  node deobfuscate.js original/Zalo/Zalo/app/main-dist/main.js source-code/main-dist/main.js');
    console.log('  node deobfuscate.js original/Zalo/Zalo/app/pc-dist source-code/pc-dist');
    process.exit(1);
  }
  
  const inputPath = args[0];
  const outputPath = args[1];
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input path does not exist: ${inputPath}`);
    process.exit(1);
  }
  
  const stat = fs.statSync(inputPath);
  
  if (stat.isFile()) {
    // Process single file
    const success = beautifyFile(inputPath, outputPath);
    process.exit(success ? 0 : 1);
  } else if (stat.isDirectory()) {
    // Process directory
    const result = processDirectory(inputPath, outputPath);
    console.log(`\n=== Summary ===`);
    console.log(`Processed: ${result.processed} files`);
    console.log(`Failed: ${result.failed} files`);
    process.exit(result.failed > 0 ? 1 : 0);
  }
}

module.exports = { beautifyFile, processDirectory };
