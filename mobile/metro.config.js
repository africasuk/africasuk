const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project root directory
const projectRoot = __dirname;
// Find the monorepo root directory (one level up if mobile is in root, or two levels up if in apps/mobile)
const monorepoRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all workspace packages (packages/validation, packages/types, etc.)
config.watchFolders = [monorepoRoot];

// 2. Help Metro resolve modules across the monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

module.exports = config;