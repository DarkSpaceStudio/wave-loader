const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");

test("package exports WaveLoader from built bundle", () => {
  assert.equal(fs.existsSync("dist/index.js"), true);
  assert.equal(fs.existsSync("dist/index.mjs"), true);
  assert.equal(fs.existsSync("dist/index.d.ts"), true);

  const originalLoad = Module._load;
  Module._load = function mockLoad(request, parent, isMain) {
    if (request === "@shopify/react-native-skia") {
      return {};
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    const pkg = require("../dist/index.js");
    assert.equal(typeof pkg.WaveLoader, "function");
  } finally {
    Module._load = originalLoad;
  }
});
