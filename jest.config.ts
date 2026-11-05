import type{Config} from "jest"


// preset	Configures Jest to work with TypeScript in ESM mode.
// testEnvironment	Runs tests in Node.js rather than a browser environment.
// extensionsToTreatAsEsm	Treats TypeScript test files as ES modules.
// moduleNameMapper	Helps Jest resolve relative .js imports to their corresponding TypeScript files.

const config: Config = {
    preset:"ts-jest/presets/default-esm",
    testEnvironment:"node",
    extensionsToTreatAsEsm:[".ts"],
    moduleNameMapper:{
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
      transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
}
export default config;