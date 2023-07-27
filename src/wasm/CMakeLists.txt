cmake_minimum_required(VERSION 3.14)
project(wasm C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED True)

add_executable(wasm main.c aes.c des.c)

# Set the output directory to "/Users/andyhu/project/5008Proj/public"
set_target_properties(wasm PROPERTIES 
  RUNTIME_OUTPUT_DIRECTORY "/Users/andyhu/project/5008Proj/public" 
  SUFFIX ".js"
)

target_link_options(wasm PRIVATE 
"SHELL:-s NO_EXIT_RUNTIME=1" 
"SHELL:-s EXPORTED_RUNTIME_METHODS=['ccall']" 
"SHELL:-s MODULARIZE=1" 
"SHELL:-s ENVIRONMENT='web'" 
"SHELL:-s NO_DISABLE_EXCEPTION_CATCHING" 
"SHELL:-s EXPORTED_FUNCTIONS=['_malloc','_free']")
