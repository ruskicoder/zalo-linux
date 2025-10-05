#!/usr/bin/env node

/**
 * Code Analysis Tool
 * Analyzes JavaScript files to extract functions, classes, exports, and dependencies
 */

const fs = require('fs');
const path = require('path');
const esprima = require('esprima');

class CodeAnalyzer {
  constructor() {
    this.analysis = {
      files: [],
      functions: [],
      classes: [],
      exports: [],
      ipcHandlers: [],
      eventListeners: [],
      apiEndpoints: [],
      dependencies: []
    };
  }

  analyzeDirectory(dirPath) {
    const files = this.getJavaScriptFiles(dirPath);
    
    for (const file of files) {
      console.log(`Analyzing: ${file}`);
      this.analyzeFile(file);
    }
    
    return this.analysis;
  }

  getJavaScriptFiles(dirPath) {
    const files = [];
    
    function traverse(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          traverse(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          files.push(fullPath);
        }
      }
    }
    
    traverse(dirPath);
    return files;
  }

  manualAnalysis(code, fileInfo, filePath) {
    // Extract functions using regex
    const functionRegex = /(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;
    while ((match = functionRegex.exec(code)) !== null) {
      fileInfo.functions.push({
        name: match[1],
        type: 'function',
        file: filePath,
        line: code.substring(0, match.index).split('\n').length,
        params: match[2] ? match[2].split(',').map(p => p.trim()) : [],
        async: match[0].startsWith('async')
      });
    }

    // Extract arrow functions assigned to variables
    const arrowRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/g;
    while ((match = arrowRegex.exec(code)) !== null) {
      fileInfo.functions.push({
        name: match[1],
        type: 'arrow',
        file: filePath,
        line: code.substring(0, match.index).split('\n').length,
        params: match[2] ? match[2].split(',').map(p => p.trim()) : [],
        async: match[0].includes('async')
      });
    }

    // Extract classes
    const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/g;
    while ((match = classRegex.exec(code)) !== null) {
      fileInfo.classes.push({
        name: match[1],
        file: filePath,
        line: code.substring(0, match.index).split('\n').length,
        methods: [],
        superClass: match[2] || null
      });
    }

    // Extract IPC handlers
    const ipcRegex = /ipcMain\.(on|handle|once)\s*\(\s*['"]([^'"]+)['"]/g;
    while ((match = ipcRegex.exec(code)) !== null) {
      this.analysis.ipcHandlers.push({
        channel: match[2],
        method: match[1],
        file: filePath,
        line: code.substring(0, match.index).split('\n').length
      });
    }

    // Extract event listeners
    const eventRegex = /\.(?:on|once|addEventListener)\s*\(\s*['"]([^'"]+)['"]/g;
    while ((match = eventRegex.exec(code)) !== null) {
      this.analysis.eventListeners.push({
        event: match[1],
        file: filePath,
        line: code.substring(0, match.index).split('\n').length
      });
    }

    // Extract requires
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(code)) !== null) {
      this.analysis.dependencies.push({
        from: filePath,
        to: match[1],
        line: code.substring(0, match.index).split('\n').length
      });
    }

    // Extract imports
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    while ((match = importRegex.exec(code)) !== null) {
      this.analysis.dependencies.push({
        from: filePath,
        to: match[1],
        line: code.substring(0, match.index).split('\n').length
      });
    }

    // Add functions to global analysis
    this.analysis.functions.push(...fileInfo.functions);
    this.analysis.classes.push(...fileInfo.classes);
  }

  analyzeFile(filePath) {
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      const relativePath = filePath.replace(process.cwd() + '/', '');
      
      // Get file stats
      const stats = fs.statSync(filePath);
      const lines = code.split('\n').length;
      
      const fileInfo = {
        path: relativePath,
        name: path.basename(filePath),
        size: stats.size,
        lines: lines,
        functions: [],
        classes: [],
        exports: [],
        imports: []
      };

      // Parse AST with multiple fallback strategies
      let ast;
      try {
        ast = esprima.parseModule(code, { 
          tolerant: true, 
          loc: true,
          comment: true,
          range: true,
          jsx: true
        });
      } catch (e) {
        try {
          ast = esprima.parseScript(code, { 
            tolerant: true, 
            loc: true,
            comment: true,
            range: true,
            jsx: true
          });
        } catch (e2) {
          // If parsing fails, do manual analysis
          console.warn(`  Warning: AST parsing failed, using regex-based analysis`);
          this.manualAnalysis(code, fileInfo, relativePath);
          return;
        }
      }

      // Traverse AST
      this.traverseAST(ast, fileInfo, relativePath);
      
      this.analysis.files.push(fileInfo);
      
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }
  }

  traverseAST(node, fileInfo, filePath, parentName = '') {
    if (!node || typeof node !== 'object') return;

    // Function declarations
    if (node.type === 'FunctionDeclaration' && node.id) {
      const funcInfo = {
        name: node.id.name,
        type: 'function',
        file: filePath,
        line: node.loc ? node.loc.start.line : null,
        params: node.params.map(p => this.getParamName(p)),
        async: node.async || false,
        generator: node.generator || false
      };
      
      fileInfo.functions.push(funcInfo);
      this.analysis.functions.push(funcInfo);
    }

    // Function expressions and arrow functions
    if ((node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && 
        node.parent && node.parent.type === 'VariableDeclarator' && node.parent.id) {
      const funcInfo = {
        name: node.parent.id.name,
        type: node.type === 'ArrowFunctionExpression' ? 'arrow' : 'function',
        file: filePath,
        line: node.loc ? node.loc.start.line : null,
        params: node.params.map(p => this.getParamName(p)),
        async: node.async || false
      };
      
      fileInfo.functions.push(funcInfo);
      this.analysis.functions.push(funcInfo);
    }

    // Class declarations
    if (node.type === 'ClassDeclaration' && node.id) {
      const classInfo = {
        name: node.id.name,
        file: filePath,
        line: node.loc ? node.loc.start.line : null,
        methods: [],
        superClass: node.superClass ? this.getIdentifierName(node.superClass) : null
      };
      
      // Extract methods
      if (node.body && node.body.body) {
        for (const member of node.body.body) {
          if (member.type === 'MethodDefinition' && member.key) {
            classInfo.methods.push({
              name: this.getIdentifierName(member.key),
              kind: member.kind,
              static: member.static || false,
              async: member.value && member.value.async || false
            });
          }
        }
      }
      
      fileInfo.classes.push(classInfo);
      this.analysis.classes.push(classInfo);
    }

    // Exports
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        const exportInfo = this.extractExportInfo(node.declaration, filePath);
        if (exportInfo) {
          fileInfo.exports.push(exportInfo);
          this.analysis.exports.push(exportInfo);
        }
      }
    }

    if (node.type === 'ExportDefaultDeclaration') {
      const exportInfo = {
        type: 'default',
        file: filePath,
        line: node.loc ? node.loc.start.line : null
      };
      fileInfo.exports.push(exportInfo);
      this.analysis.exports.push(exportInfo);
    }

    // Imports
    if (node.type === 'ImportDeclaration' && node.source) {
      const importInfo = {
        source: node.source.value,
        specifiers: node.specifiers.map(s => ({
          type: s.type,
          name: s.local ? s.local.name : null
        }))
      };
      fileInfo.imports.push(importInfo);
      
      this.analysis.dependencies.push({
        from: filePath,
        to: node.source.value,
        line: node.loc ? node.loc.start.line : null
      });
    }

    // Require statements
    if (node.type === 'CallExpression' && 
        node.callee.type === 'Identifier' && 
        node.callee.name === 'require' &&
        node.arguments.length > 0 &&
        node.arguments[0].type === 'Literal') {
      
      this.analysis.dependencies.push({
        from: filePath,
        to: node.arguments[0].value,
        line: node.loc ? node.loc.start.line : null
      });
    }

    // IPC handlers (ipcMain.on, ipcMain.handle)
    if (node.type === 'CallExpression' && 
        node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'ipcMain' &&
        (node.callee.property.name === 'on' || 
         node.callee.property.name === 'handle' ||
         node.callee.property.name === 'once')) {
      
      if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
        this.analysis.ipcHandlers.push({
          channel: node.arguments[0].value,
          method: node.callee.property.name,
          file: filePath,
          line: node.loc ? node.loc.start.line : null
        });
      }
    }

    // Event listeners
    if (node.type === 'CallExpression' && 
        node.callee.type === 'MemberExpression' &&
        (node.callee.property.name === 'on' || 
         node.callee.property.name === 'once' ||
         node.callee.property.name === 'addEventListener')) {
      
      if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
        this.analysis.eventListeners.push({
          event: node.arguments[0].value,
          file: filePath,
          line: node.loc ? node.loc.start.line : null
        });
      }
    }

    // Recursively traverse child nodes
    for (const key in node) {
      if (key === 'parent') continue; // Avoid circular references
      
      const child = node[key];
      if (child && typeof child === 'object') {
        if (Array.isArray(child)) {
          child.forEach(c => {
            if (c && typeof c === 'object') {
              c.parent = node;
              this.traverseAST(c, fileInfo, filePath, parentName);
            }
          });
        } else {
          child.parent = node;
          this.traverseAST(child, fileInfo, filePath, parentName);
        }
      }
    }
  }

  getParamName(param) {
    if (param.type === 'Identifier') {
      return param.name;
    } else if (param.type === 'RestElement' && param.argument) {
      return '...' + this.getParamName(param.argument);
    } else if (param.type === 'AssignmentPattern' && param.left) {
      return this.getParamName(param.left) + ' = default';
    } else if (param.type === 'ObjectPattern') {
      return '{ destructured }';
    } else if (param.type === 'ArrayPattern') {
      return '[ destructured ]';
    }
    return 'unknown';
  }

  getIdentifierName(node) {
    if (!node) return null;
    if (node.type === 'Identifier') return node.name;
    if (node.type === 'Literal') return node.value;
    return null;
  }

  extractExportInfo(declaration, filePath) {
    if (declaration.type === 'FunctionDeclaration' && declaration.id) {
      return {
        type: 'function',
        name: declaration.id.name,
        file: filePath
      };
    } else if (declaration.type === 'ClassDeclaration' && declaration.id) {
      return {
        type: 'class',
        name: declaration.id.name,
        file: filePath
      };
    } else if (declaration.type === 'VariableDeclaration') {
      return {
        type: 'variable',
        names: declaration.declarations.map(d => d.id.name),
        file: filePath
      };
    }
    return null;
  }

  generateMarkdown() {
    let md = '';
    
    md += '# Code Analysis Report\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;
    
    // Summary
    md += '## Summary\n\n';
    md += `- **Total Files**: ${this.analysis.files.length}\n`;
    md += `- **Total Functions**: ${this.analysis.functions.length}\n`;
    md += `- **Total Classes**: ${this.analysis.classes.length}\n`;
    md += `- **Total Exports**: ${this.analysis.exports.length}\n`;
    md += `- **IPC Handlers**: ${this.analysis.ipcHandlers.length}\n`;
    md += `- **Event Listeners**: ${this.analysis.eventListeners.length}\n\n`;
    
    // Files
    md += '## Files\n\n';
    for (const file of this.analysis.files) {
      md += `### ${file.name}\n\n`;
      md += `- **Path**: \`${file.path}\`\n`;
      md += `- **Size**: ${(file.size / 1024).toFixed(2)} KB\n`;
      md += `- **Lines**: ${file.lines}\n`;
      md += `- **Functions**: ${file.functions.length}\n`;
      md += `- **Classes**: ${file.classes.length}\n`;
      md += `- **Exports**: ${file.exports.length}\n\n`;
    }
    
    // Functions
    if (this.analysis.functions.length > 0) {
      md += '## Functions\n\n';
      md += '| Name | Type | File | Line | Parameters | Async |\n';
      md += '|------|------|------|------|------------|-------|\n';
      
      for (const func of this.analysis.functions) {
        const params = func.params.join(', ');
        md += `| ${func.name} | ${func.type} | ${path.basename(func.file)} | ${func.line || 'N/A'} | ${params || 'none'} | ${func.async ? 'Yes' : 'No'} |\n`;
      }
      md += '\n';
    }
    
    // Classes
    if (this.analysis.classes.length > 0) {
      md += '## Classes\n\n';
      
      for (const cls of this.analysis.classes) {
        md += `### ${cls.name}\n\n`;
        md += `- **File**: \`${cls.file}\`\n`;
        md += `- **Line**: ${cls.line || 'N/A'}\n`;
        if (cls.superClass) {
          md += `- **Extends**: ${cls.superClass}\n`;
        }
        md += `- **Methods**: ${cls.methods.length}\n\n`;
        
        if (cls.methods.length > 0) {
          md += '**Methods:**\n\n';
          for (const method of cls.methods) {
            md += `- \`${method.name}\` (${method.kind})`;
            if (method.static) md += ' [static]';
            if (method.async) md += ' [async]';
            md += '\n';
          }
          md += '\n';
        }
      }
    }
    
    // IPC Handlers
    if (this.analysis.ipcHandlers.length > 0) {
      md += '## IPC Handlers\n\n';
      md += '| Channel | Method | File | Line |\n';
      md += '|---------|--------|------|------|\n';
      
      for (const handler of this.analysis.ipcHandlers) {
        md += `| \`${handler.channel}\` | ${handler.method} | ${path.basename(handler.file)} | ${handler.line || 'N/A'} |\n`;
      }
      md += '\n';
    }
    
    // Event Listeners
    if (this.analysis.eventListeners.length > 0) {
      md += '## Event Listeners\n\n';
      md += '| Event | File | Line |\n';
      md += '|-------|------|------|\n';
      
      const uniqueListeners = [...new Set(this.analysis.eventListeners.map(l => JSON.stringify(l)))].map(s => JSON.parse(s));
      
      for (const listener of uniqueListeners) {
        md += `| \`${listener.event}\` | ${path.basename(listener.file)} | ${listener.line || 'N/A'} |\n`;
      }
      md += '\n';
    }
    
    // Dependencies
    if (this.analysis.dependencies.length > 0) {
      md += '## Dependencies\n\n';
      
      const depMap = {};
      for (const dep of this.analysis.dependencies) {
        if (!depMap[dep.from]) {
          depMap[dep.from] = [];
        }
        depMap[dep.from].push(dep.to);
      }
      
      for (const [from, deps] of Object.entries(depMap)) {
        md += `### ${path.basename(from)}\n\n`;
        const uniqueDeps = [...new Set(deps)];
        for (const dep of uniqueDeps) {
          md += `- \`${dep}\`\n`;
        }
        md += '\n';
      }
    }
    
    return md;
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node analyze-code.js <directory> <output-file>');
    process.exit(1);
  }
  
  const [directory, outputFile] = args;
  
  if (!fs.existsSync(directory)) {
    console.error(`Error: Directory not found: ${directory}`);
    process.exit(1);
  }
  
  console.log(`Analyzing directory: ${directory}`);
  console.log(`Output file: ${outputFile}\n`);
  
  const analyzer = new CodeAnalyzer();
  analyzer.analyzeDirectory(directory);
  
  const markdown = analyzer.generateMarkdown();
  fs.writeFileSync(outputFile, markdown, 'utf8');
  
  console.log(`\nAnalysis complete! Report saved to: ${outputFile}`);
}

module.exports = CodeAnalyzer;
