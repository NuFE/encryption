cmake_minimum_required(VERSION 3.14)
project(wasm C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED True)

add_executable(wasm main.c)
set_target_properties(wasm PROPERTIES SUFFIX ".js")

target_link_options(wasm PRIVATE "SHELL:-s NO_EXIT_RUNTIME=1" "SHELL:-s EXPORTED_RUNTIME_METHODS=['ccall']" "SHELL:-s MODULARIZE=1" "SHELL:-sENVIRONMENT='web'" "SHELL:-sNO_DISABLE_EXCEPTION_CATCHING ")

target_include_directories(wasm PRIVATE)
target_link_libraries(wasm PRIVATE)
