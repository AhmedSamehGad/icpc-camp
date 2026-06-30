const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: 'inherit', cwd: rootDir });
}

function ensureFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function ensureTailwindCssFile() {
  const candidates = [
    path.join(rootDir, 'src', 'index.css'),
    path.join(rootDir, 'src', 'styles', 'index.css'),
  ];

  const existing = candidates.find((candidate) => fs.existsSync(candidate));

  if (existing) {
    return existing;
  }

  const target = candidates[0];
  const targetDir = path.dirname(target);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(target, '', 'utf8');
  return target;
}

function ensureTailwindDirectives(cssPath) {
  const directives = ['@tailwind base;', '@tailwind components;', '@tailwind utilities;'];
  const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

  if (directives.every((directive) => cssContent.includes(directive))) {
    return;
  }

  const cleaned = cssContent.replace(/^\uFEFF/, '').replace(/^\s*\n/, '');
  const newContent = `${directives.join('\n')}\n\n${cleaned}`.trimStart();
  fs.writeFileSync(cssPath, newContent, 'utf8');
}

console.log('Installing Tailwind CSS packages...');
run('npm install -D tailwindcss@3.4.17 postcss autoprefixer');

const tailwindConfigPath = path.join(rootDir, 'tailwind.config.js');
const tailwindConfigContent = `module.exports = {\n  content: ['./src/**/*.{js,jsx,ts,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n`;
ensureFile(tailwindConfigPath, tailwindConfigContent);

const postcssConfigPath = path.join(rootDir, 'postcss.config.js');
const postcssConfigContent = `module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n`;
ensureFile(postcssConfigPath, postcssConfigContent);

const cssPath = ensureTailwindCssFile();
ensureTailwindDirectives(cssPath);

console.log(`\nTailwind setup complete.`);
console.log(`- Tailwind config: ${path.relative(rootDir, tailwindConfigPath)}`);
console.log(`- PostCSS config: ${path.relative(rootDir, postcssConfigPath)}`);
console.log(`- Stylesheet: ${path.relative(rootDir, cssPath)}`);
