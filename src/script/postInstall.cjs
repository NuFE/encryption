const fs = require("fs").promises;
const { ensureDir } = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const cmakeFilePath = path.join(process.cwd(), "src/wasm/CMakeLists.txt");
const wasmDir = path.join(process.cwd(), "src/wasm");
const publicDir = path.join(process.cwd(), "public");
async function main() {
  console.log("Updating CMakeLists.txt...");
  const cmakeContent = `cmake_minimum_required(VERSION 3.14)
project(wasm C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED True)

add_executable(wasm main.c aes.c)

# Set the output directory to "${publicDir}"
set_target_properties(wasm PROPERTIES 
  RUNTIME_OUTPUT_DIRECTORY "${publicDir}" 
  SUFFIX ".js"
)

target_link_options(wasm PRIVATE "SHELL:-s NO_EXIT_RUNTIME=1" "SHELL:-s EXPORTED_RUNTIME_METHODS=['ccall']" "SHELL:-s MODULARIZE=1" "SHELL:-s ENVIRONMENT='web'" "SHELL:-s NO_DISABLE_EXCEPTION_CATCHING ")
`;

  await fs.writeFile(cmakeFilePath, cmakeContent);

  // Build the wasm project
  console.log("Building wasm project...");
  const buildDir = path.join(wasmDir, "build");
  shell.cd(buildDir);
  shell.exec(`emcmake cmake .. && emmake make`);

  // Move the build files
  console.log("Moving build files...");
  await ensureDir(publicDir);
  shell.mv(path.join(publicDir, "wasm.js"), wasmDir);
  shell.mv(path.join(publicDir, "wasm.wasm"), path.join(publicDir, "wasm.wasm"));

  console.log("Preparation completed successfully.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
