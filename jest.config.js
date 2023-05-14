export default {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  transformIgnorePatterns: ["node_modules/", "dist/node/"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  testTimeout: 1_000_000,
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
