import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "dist/db-stress-cli.js",
    format: "esm",
    banner: "#!/usr/bin/env node",
  },

  // DO NOT bundle native modules or heavy DB drivers
  external: [
    "fs",
    "path",
    "url",
    "mongodb",
    "pg",
    "axios",
    "p-queue",
    "zod",
    "inquirer",
    "chalk",
    "mysql2",
    "mysql2/promise",
    "commander",
    "@faker-js/faker"
  ],

  plugins: [
    resolve({
      preferBuiltins: true,
      exportConditions: ["node"],
    }),
    commonjs(),
    json(),

    // Optional: transpile for older Node versions
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
      exclude: "node_modules/**",
    }),

    // Optional: compress code
    terser({
      module: true,
    }),
  ],
};
