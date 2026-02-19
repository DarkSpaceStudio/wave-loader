const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const packageRoot = path.resolve(projectRoot, "package");

const config = getDefaultConfig(projectRoot);
const escapeForRegex = (value) => value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
const packageNodeModulesPath = path.resolve(packageRoot, "node_modules");
const linkedPackageNodeModulesPath = path.resolve(
  projectRoot,
  "node_modules/wave-loader/node_modules",
);

config.watchFolders = [packageRoot];

config.resolver.unstable_enableSymlinks = true;
config.resolver.blockList = [
  new RegExp(`${escapeForRegex(packageNodeModulesPath)}[\\\\/].*`),
  new RegExp(`${escapeForRegex(linkedPackageNodeModulesPath)}[\\\\/].*`),
];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];
config.resolver.extraNodeModules = {
  "wave-loader": packageRoot,
  react: path.resolve(projectRoot, "node_modules/react"),
  "react/jsx-runtime": path.resolve(
    projectRoot,
    "node_modules/react/jsx-runtime.js",
  ),
  "react/jsx-dev-runtime": path.resolve(
    projectRoot,
    "node_modules/react/jsx-dev-runtime.js",
  ),
  "react-dom": path.resolve(projectRoot, "node_modules/react-dom"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "@shopify/react-native-skia": path.resolve(
    projectRoot,
    "node_modules/@shopify/react-native-skia",
  ),
  "react-native-reanimated": path.resolve(
    projectRoot,
    "node_modules/react-native-reanimated",
  ),
  "react-native-worklets": path.resolve(
    projectRoot,
    "node_modules/react-native-worklets",
  ),
};

module.exports = config;
