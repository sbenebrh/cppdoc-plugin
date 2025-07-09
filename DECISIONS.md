# Initial Decisions

- **MVP target IDE**: VS Code  
  *Reason*: largest C++ user base, easy Marketplace publishing, and a straightforward WebView API.

- **Core language**: Rust (dynamic library + FFI interface)  
  *Reason*: high performance, single portable binary, and simple bindings to C and JavaScript.

- **Documentation source**: official cppreference “HTML book” archive (CC-BY-SA 3.0)  
  *Reason*: contains the full C++ reference offline, follows a stable format, and is easy to parse.
