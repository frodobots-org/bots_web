cmake_minimum_required(VERSION 3.10)
project(cpp_http_server)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

add_executable(main main.cpp)

target_include_directories(main PRIVATE 
)

target_link_libraries(main
    PRIVATE 
        pthread
        ssl
        crypto
        cjson
)